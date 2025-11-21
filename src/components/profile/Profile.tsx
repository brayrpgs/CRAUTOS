import React, { useEffect, useState } from 'react'
import styles from '../../styles/profile/styles.module.css'
import type { user } from '../../models/user'
import { AUDIT_URL, IMAGES_URL, USERS_URL } from '../../common/common'
import Rol from '../../enums/Rol'
import type { audit } from '../../models/audit'
import { getLoggedUser, type TokenPayload } from '../../utils/GetUserUtils'
import type { images } from '../../models/images'

export const Profile: React.FC = () => {
  const [user, setUser] = useState<user>()
  const [image, setImage] = useState<string>()
  const [toast, setToast] = useState<string | null>(null)
  const [changed, setChanged] = useState<boolean>(false)
  const refUploadImage = React.useRef<HTMLInputElement>(null)
  const [id, setId] = useState(0)

  // ===============================
  // TOAST
  // ===============================
  const showToast = (msg: string) => setToast(msg)

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  // ===============================
  // Cargar usuario
  // ===============================
  const fetchUserData = async (idUser: number) => {
    try {
      const response = await fetch(
        `${USERS_URL}?id_user=eq.${idUser}&select=*,audit(*),images(*)`
      )
      const data = await response.json() as user[]
      const u = data[0]

      setUser(u)
      setImage(u?.images?.image)
    } catch (err) {
      console.error(err)
    }
  }

  // ===============================
  // Perfil incompleto
  // ===============================
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('perfilIncompleto') === 'true') {
      showToast('⚠️ Por favor completa tu información antes de continuar ⚠️')
    }
  }, [])

  // ===============================
  // Guardar cambios del perfil
  // ===============================
  const handleUpdateProfile = async () => {
    try {
      let current = user

      // ======== AUDITORÍA USER =========
      if (current?.id_audit) {
        const res = await fetch(`${AUDIT_URL}?id_audit=eq.${current.id_audit}`, {
          method: 'PATCH',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            Prefer: 'return=representation'
          },
          body: JSON.stringify({ updated_at: new Date() })
        })
        const a = await res.json() as audit[]
        current = { ...current, id_audit: a[0].id_audit }
      } else {
        const res = await fetch(AUDIT_URL, {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            Prefer: 'return=representation'
          },
          body: JSON.stringify({})
        })
        const a = await res.json() as audit[]
        current = { ...current!, id_audit: a[0].id_audit, audit: a[0] }
      }

      // ======== AUDITORÍA IMAGEN =========
      if (current?.images?.id_audit) {
        const res = await fetch(
          `${AUDIT_URL}?id_audit=eq.${current.images.id_audit}`,
          {
            method: 'PATCH',
            headers: {
              accept: 'application/json',
              'Content-Type': 'application/json',
              Prefer: 'return=representation'
            },
            body: JSON.stringify({ updated_at: new Date().toISOString() })
          }
        )
        const a = await res.json() as audit[]
        current = {
          ...current,
          images: { ...current.images!, id_audit: a[0].id_audit, audit: a[0] }
        }
      } else {
        const res = await fetch(AUDIT_URL, {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            Prefer: 'return=representation'
          },
          body: JSON.stringify({})
        })
        const a = await res.json() as audit[]
        current = {
          ...current!,
          images: { ...current.images!, id_audit: a[0].id_audit, audit: a[0] }
        }
      }

      // ======== ACTUALIZAR IMAGEN =========
      if (current?.images?.id_images) {
        const res = await fetch(
          `${IMAGES_URL}?id_images=eq.${current.images.id_images}`,
          {
            method: 'PATCH',
            headers: {
              accept: 'application/json',
              'Content-Type': 'application/json',
              Prefer: 'return=representation'
            },
            body: JSON.stringify({
              image: current.images.image,
              id_audit: current.images.id_audit
            })
          }
        )
        const img = await res.json() as images[]
        current = { ...current!, images: img[0], id_images: img[0].id_images }
      } else {
        const res = await fetch(IMAGES_URL, {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            Prefer: 'return=representation'
          },
          body: JSON.stringify({
            image: current?.images?.image,
            id_audit: current?.images?.id_audit
          })
        })
        const img = await res.json() as images[]
        current = { ...current!, images: img[0], id_images: img[0].id_images }
      }

      // ======== ACTUALIZAR USER =========
      const clone = structuredClone(current)
      delete clone.images
      delete clone.audit
      delete clone.id_user

      const res = await fetch(`${USERS_URL}?id_user=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Prefer: 'return=representation'
        },
        body: JSON.stringify(clone)
      })

      if (!res.ok) {
        showToast('❌ Los datos no se pudieron actualizar correctamente')
      } else {
        showToast('✔ Datos actualizados correctamente')
        setChanged(prev => !prev)
      }

      setUser(current)
    } catch (err) {
      console.error(err)
      showToast('❌ Error interno')
    }
  }

  // ===============================
  // Convertir imagen a base64
  // ===============================
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const base64 = await fileToBase64(e.target.files[0]);

    setUser(prev => ({
      ...prev!,
      images: {
        ...prev?.images,
        image: base64
      }
    }));

    setImage(base64);
  };

  // ===============================
  // Cargar user desde token
  // ===============================
  useEffect(() => {
    const token: TokenPayload = getLoggedUser() as TokenPayload
    if (!token) window.location.href = '/'
    setId(token.id_user)
    fetchUserData(token.id_user)
  }, [changed])

  return (
    <div className={styles.wrapper}>

      {toast && (
        <div className={styles.globalToast}>
          {toast}
        </div>
      )}

      <div className={styles.card}>
        <h2 className={styles.title}>Mi perfil de usuario</h2>

        <div className={styles.avatarBox}>
          <img
            className={styles.avatar}
            src={image ?? 'avatar.png'}
            alt='foto de perfil'
            onClick={() => refUploadImage.current?.click()}
          />

          <input
            type='file'
            hidden
            ref={refUploadImage}
            onChange={handleImageChange}
          />

          <p className={styles.label}>Foto de Perfil</p>

          <span className={styles.roleBadge}>
            {Rol[user?.rol as any]}
          </span>
        </div>

        {/* Formulario */}
        <div className={styles.grid}>
          <div className={styles.item}>
            <label htmlFor='na' className={styles.label}>Nombre</label>
            <input
              id='na'
              name='na'
              className={`glass ${styles.input}`}
              value={user?.name ?? ''}
              onInput={e => setUser({ ...user!, name: e.currentTarget.value })}
            />
          </div>

          <div className={styles.item}>
            <label htmlFor='ln' className={styles.label}>Apellidos</label>
            <input
              id='ln'
              name='ln'
              className={`glass ${styles.input}`}
              value={user?.last_name ?? ''}
              onInput={e => setUser({ ...user!, last_name: e.currentTarget.value })}
            />
          </div>

          <div className={styles.item}>
            <label htmlFor='ph' className={styles.label}>Teléfono</label>
            <input
              id='ph'
              name='ph'
              className={`glass ${styles.input}`}
              value={user?.phone ?? ''}
              onInput={e => setUser({ ...user!, phone: e.currentTarget.value })}
            />
          </div>

          <div className={styles.item}>
            <label htmlFor='em' className={styles.label}>Email</label>
            <input
              id='em'
              name='em'
              className={`glass ${styles.input}`}
              value={user?.email ?? ''}
              onInput={e => setUser({ ...user!, email: e.currentTarget.value })}
            />
          </div>

          <div className={styles.item}>
            <label htmlFor='ced' className={styles.label}>Cédula</label>
            <input
              id='ced'
              name='ced'
              className={`glass ${styles.input}`}
              value={user?.idcard ?? ''}
              onInput={e => setUser({ ...user!, idcard: e.currentTarget.value })}
            />
          </div>

          <div className={styles.item}>
            <label htmlFor='ag' className={styles.label}>Edad</label>
            <input
              id='ag'
              name='ag'
              className={`glass ${styles.input}`}
              value={user?.age ?? ''}
              onInput={e => setUser({ ...user!, age: Number(e.currentTarget.value) })}
            />
          </div>

          <div className={`${styles.item} ${styles.buttonBox}`}>
            <button className={`glass ${styles.button}`} onClick={handleUpdateProfile}>
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ===============================
async function fileToBase64(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
