import React, { useEffect, useState } from 'react'
import styles from '../../styles/profile/styles.module.css'
import type { user } from '../../models/user'
import { AUDIT_URL, IMAGES_URL, USERS_URL } from '../../common/common'
import Rol from '../../enums/Rol'
import type { audit } from '../../models/audit'
import { getLoggedUser, type TokenPayload } from '../../utils/GetUserUtils'
import type { images } from '../../models/images'

export const Profile: React.FC = () => {
  const [user, setUser] = React.useState<user>()
  const [image, setImage] = React.useState<string>()
  const [toast, setToast] = React.useState<string | null>(null)
  const [changed, setChanged] = React.useState<boolean>(false)
  const refUploadImage = React.useRef<HTMLInputElement>(null)
  const [id, setId] = useState(0)

  // ===============================
  //   Nuevo método para mostrar toast
  // ===============================
  const showToast = (msg: string): void => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  // ===============================
  //   Cargar datos del usuario
  // ===============================
  const fetchUserData = async (idUser: number): Promise<void> => {
    try {
      const response = await fetch(
        `${USERS_URL}?id_user=eq.${idUser}&select=*,audit(*),images(*)`
      )
      const data = await response.json() as user[]
      setUser(data[0])
      setImage(data[0]?.images?.image)
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  // ===============================
  //   Perfil incompleto (toast)
  // ===============================
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const incomplete = params.get('perfilIncompleto')

    if (incomplete === 'true') {
      showToast('⚠️ Por favor completa tu información antes de continuar ⚠️')
    }
  }, [])

  // ===============================
  //   Guardar cambios en el perfil
  // ===============================
  const handleUpdateProfile = async (): Promise<void> => {
    try {
      // ======== ACTUALIZAR AUDITORÍA DEL USER =========
      if (user?.id_audit !== null) {
        const res = await fetch(
          `${AUDIT_URL}?id_audit=eq.${user?.id_audit}`,
          {
            method: 'PATCH',
            headers: {
              accept: 'application/json',
              'Content-Type': 'application/json',
              Prefer: 'return=representation'
            },
            body: JSON.stringify({ updated_at: new Date() })
          }
        )
        const a = await res.json() as audit[]
        setUser({ ...user, id_audit: a[0].id_audit })
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
        const updated = { ...user } as user
        updated.id_audit = a[0].id_audit
        updated.audit = a[0]
        setUser(updated)
      }

      // ======== ACTUALIZAR AUDITORÍA DE LA IMAGEN =========
      if (user?.images?.id_audit !== undefined) {
        const res = await fetch(
          `${AUDIT_URL}?id_audit=eq.${user?.images?.id_audit}`,
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
        const updated = { ...user } as user

        if (updated.images) {
          updated.images.id_audit = a[0].id_audit
          updated.images.audit = a[0]
        }

        setUser(updated)
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
        const updated = { ...user } as user

        if (updated.images) {
          updated.images.id_audit = a[0].id_audit
          updated.images.audit = a[0]
        }

        setUser(updated)
      }

      // ======== ACTUALIZAR IMAGEN =========
      if (user?.images?.id_images !== undefined) {
        const res = await fetch(
          `${IMAGES_URL}?id_images=eq.${user?.images?.id_images}`,
          {
            method: 'PATCH',
            headers: {
              accept: 'application/json',
              'Content-Type': 'application/json',
              Prefer: 'return=representation'
            },
            body: JSON.stringify({
              image: user?.images?.image,
              id_audit: user?.images?.id_audit
            })
          }
        )
        const img = await res.json() as images[]
        const updated = { ...user } as user
        updated.images = img[0]
        updated.id_images = img[0].id_images
        setUser(updated)
      } else {
        const res = await fetch(IMAGES_URL, {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            Prefer: 'return=representation'
          },
          body: JSON.stringify({
            image: user?.images?.image,
            id_audit: user?.images?.id_audit
          })
        })
        const img = await res.json() as images[]
        const updated = { ...user } as user
        updated.images = img[0]
        updated.id_images = img[0].id_images
        setUser(updated)
      }

      // ======== ACTUALIZAR USER =========
      const clone = { ...user }
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
        showToast('Los datos no se pudieron actualizar correctamente')
      } else {
        showToast('Datos actualizados correctamente')
        setChanged(!changed)
      }
    } catch (err) {
      console.error(err)
    }
  }

  // ===============================
  //   Convertir imagen a base64
  // ===============================
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (!e.target.files || e.target.files.length === 0) return

    const base64 = await fileToBase64(e.target.files[0])
    const updated = { ...user } as user

    updated.images = {
      image: base64,
      audit: {}
    }

    setUser(updated)
    setImage(base64)
  }

  // ===============================
  //   Cargar user desde token
  // ===============================
  useEffect(() => {
    const token: TokenPayload = getLoggedUser() as TokenPayload
    if (!token) window.location.href = '/'
    setId(token.id_user)
    void fetchUserData(token.id_user)
  }, [changed, id])

  return (
    <div className={styles.wrapper}>

      {/* === NUEVO TOAST GLOBAL === */}
      {toast && (
        <div className={styles.profileToast}>
          {toast}
        </div>
      )}

      <div className={styles.card}>
        <h2 className={styles.title}>Mi perfil de usuario</h2>

        {/* Avatar */}
        <div className={styles.avatarBox}>
          <img
            className={styles.avatar}
            src={image ?? "avatar.png"}
            alt="foto de perfil"
            onClick={() => refUploadImage.current?.click()}
          />

          <input
            type="file"
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
            <button
              className={`glass ${styles.button}`}
              onClick={() => void handleUpdateProfile()}
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

async function fileToBase64(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)

    reader.readAsDataURL(file)
  })
}
