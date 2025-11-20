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
  const [error, setError] = React.useState<string>()
  const [changed, setChanged] = React.useState<boolean>(false)
  const refToast = React.useRef<HTMLDivElement>(null)
  const refUploadImage = React.useRef<HTMLInputElement>(null)
  const [id, setId] = useState(0)

  // aca la logica con el id para traer los datos del usuario
  const fetchUserData = async (idUser: number): Promise<void> => {
    try {
      const response = await fetch(`${USERS_URL}?id_user=eq.${idUser}&select=*,audit(*),images(*)`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Range-Unit': 'items'
        }
      })
      const data = await response.json() as user[]
      setUser(data[0])
      setImage(data[0]?.images?.image)
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  // funcion para actualizar los datos del usuario
  const handleUpdateProfile = async (): Promise<void> => {
    try {
      // actualizar la auditoria del usuario
      if (user?.id_audit !== null) {
        const requestUpdateAudit = await fetch(
          `${AUDIT_URL}?id_audit=eq.${user?.id_audit as number}`,
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
        if (!requestUpdateAudit.ok) {
          console.error('not updated audit user')
          setChanged(!changed)
        }
        const auditUpdated = await requestUpdateAudit.json() as audit[]
        setUser({
          ...user as user,
          id_audit: auditUpdated[0].id_audit
        })
      } else {
        const requestCreateAudit = await fetch(
          AUDIT_URL,
          {
            method: 'POST',
            headers: {
              accept: 'application/json',
              'Content-Type': 'application/json',
              Prefer: 'return=representation'
            },
            body: JSON.stringify({})
          }
        )
        if (!requestCreateAudit.ok) {
          console.error('not updated audit user')
          setChanged(!changed)
        }
        const auditUpdated = await requestCreateAudit.json() as audit[]
        const userUpdated = user
        if (userUpdated !== undefined) {
          userUpdated.id_audit = auditUpdated[0].id_audit
          userUpdated.audit = auditUpdated[0]
        }
        setUser(userUpdated)
      }

      // actualizar auditoria de la imagen
      if (user?.images?.id_audit !== undefined) {
        const requestUpdateAudit = await fetch(
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
        if (!requestUpdateAudit.ok) {
          console.error('not updated audit user')
          setChanged(!changed)
        }
        const auditImageCreated = await requestUpdateAudit.json() as audit[]
        const updatedUser = user
        if (updatedUser?.images !== undefined && updatedUser?.images !== null) {
          updatedUser.images.id_audit = auditImageCreated[0].id_audit
          updatedUser.images.audit = auditImageCreated[0]
          setUser(updatedUser)
        }
      } else {
        const requestCreateAudit = await fetch(
          AUDIT_URL,
          {
            method: 'POST',
            headers: {
              accept: 'application/json',
              'Content-Type': 'application/json',
              Prefer: 'return=representation'
            },
            body: JSON.stringify({})
          }
        )
        if (!requestCreateAudit.ok) {
          console.error('not updated audit user')
          setChanged(!changed)
        }
        const auditImageCreated = await requestCreateAudit.json() as audit[]
        const updatedUser = user
        if (updatedUser?.images !== undefined && updatedUser.images !== null) {
          updatedUser.images.id_audit = auditImageCreated[0].id_audit
          updatedUser.images.audit = auditImageCreated[0]
          setUser(updatedUser)
        }
      }

      // actualizar la imagen en el endpoint de images
      if (user?.images?.id_images !== undefined) {
        const requestUpdateImage = await fetch(
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
            id_audit: user?.images?.id_audit as number
          })
        }
        )
        if (!requestUpdateImage.ok) {
          console.error('not updated image user')
          setChanged(!changed)
        }
        const imageData = await requestUpdateImage.json() as images[]
        const userUpdated = user
        userUpdated.images = imageData[0]
        userUpdated.id_images = imageData[0].id_images
        setUser(userUpdated)
      } else {
        const requestUpdateImage = await fetch(
        `${IMAGES_URL}`,
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            Prefer: 'return=representation'
          },
          body: JSON.stringify({
            image: user?.images?.image,
            id_audit: user?.images?.id_audit as number
          })
        }
        )
        if (!requestUpdateImage.ok) {
          console.error('not updated image user')
          setChanged(!changed)
        }
        const imageData = await requestUpdateImage.json() as images[]
        const userUpdated = user as user
        userUpdated.images = imageData[0]
        userUpdated.id_images = imageData[0].id_images
        setUser(userUpdated)
      }
      // actualizar los datos del usuario
      delete user?.images
      delete user?.audit
      delete user?.id_user
      const response = await fetch(`${USERS_URL}?id_user=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Prefer: 'return=representation'
        },
        body: JSON.stringify(user)
      })
      if (!response.ok) {
        setError('❌ Los datos no se pudieron actualizar correctamente. ❌')
        refToast.current?.classList.add(styles.showToast)
        setTimeout(() => {
          refToast.current?.classList.remove(styles.showToast)
        }, 5000)
      } else {
        setError('✅ Datos actualizados correctamente. ✅')
        refToast.current?.classList.remove('hide')
        refToast.current?.classList.add(styles.showToast)
        setTimeout(() => {
          refToast.current?.classList.remove(styles.showToast)
          refToast.current?.classList.add('hide')
          setChanged(!changed)
        }, 5000)
      }
    } catch (error) {
      console.error('Error updating user data:', error)
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    if ((e.target.files != null) && e.target.files.length > 0) {
      const image = await fileToBase64(e.target.files[0])
      if (image !== user?.images?.image) {
        console.log('imagen cambiada')
      }
      if (user !== undefined) {
        const userWithUpdatedImage = user
        userWithUpdatedImage.images = {
          image,
          audit: {}
        }
        setUser(userWithUpdatedImage)
        setImage(image)
      }
    }
  }

  useEffect(() => {
    // optener el user
    const userFromToken: TokenPayload = getLoggedUser() as TokenPayload
    if (userFromToken == null) window.location.href = '/'
    setId(userFromToken.id_user)
    void fetchUserData(userFromToken.id_user)
  }, [changed, id])
  return (
    <div className={styles.containerView}>
      <div className={`glass ${styles.toast}`} ref={refToast}>
        {error}
      </div>
      <div className={styles.containerProfile}>
        <div className={styles.headProfile}>
          <p>{'mi perfil de usuario'.toUpperCase()}</p>
        </div>
        <div className={styles.containerResposive}>
          <div className={`${styles.itemsProfile} ${styles.containerProfilePhoto}`}>
            <p className={styles.itemsTitle}>Foto de Perfil</p>
            <input type='file' hidden onChange={(e) => { void handleImageChange(e) }} ref={refUploadImage} />
            <img className={styles.profilePhoto} src={image ?? 'avatar.png'} alt='foto de perfil' onClick={(e) => { refUploadImage.current?.click() }} />
            <input type='hidden' />
          </div>
          <div>
            <div className={styles.itemsProfile}>
              <p className={styles.itemsTitle}>Nombre</p>
              <input
                type='text'
                className={`glass ${styles.itemsData}`}
                value={user?.name ?? ''}
                onInput={(e) => {
                  if (user !== undefined) {
                    setUser({ ...user, name: e.currentTarget.value })
                  }
                }}
              />
            </div>
            <div className={styles.itemsProfile}>
              <p className={styles.itemsTitle}>Apellidos</p>
              <input
                type='text' className={`glass ${styles.itemsData}`} value={user?.last_name ?? ''} onInput={(e) => {
                  if (user !== undefined) {
                    setUser({ ...user, last_name: e.currentTarget.value })
                  }
                }}
              />
            </div>
          </div>
        </div>
        <div className={styles.containerResposive}>
          <div className={styles.itemsProfile}>
            <p className={styles.itemsTitle}>Telefono</p>
            <input
              type='tel' className={`glass ${styles.itemsData}`} value={user?.phone ?? ''} onInput={(e) => {
                if (user !== undefined) {
                  setUser({ ...user, phone: e.currentTarget.value })
                }
              }}
            />
          </div>
          <div className={styles.itemsProfile}>
            <p className={styles.itemsTitle}>Email</p>
            <input
              type='email' className={`glass ${styles.itemsData}`} value={user?.email ?? ''} onInput={(e) => {
                if (user !== undefined) {
                  setUser({ ...user, email: e.currentTarget.value })
                }
              }}
            />
          </div>
        </div>
        <div className={styles.containerResposive}>
          <div className={styles.itemsProfile}>
            <p className={styles.itemsTitle}>Cedula</p>
            <input
              type='text' className={`glass ${styles.itemsData}`} value={user?.idcard ?? ''} onInput={(e) => {
                if (user !== undefined) {
                  setUser({ ...user, idcard: e.currentTarget.value })
                }
              }}
            />
          </div>
          <div className={styles.itemsProfile}>
            <p className={styles.itemsTitle}>Edad</p>
            <input
              type='number' className={`glass ${styles.itemsData}`} value={user?.age ?? ''} onInput={(e) => {
                if (user !== undefined) {
                  setUser({ ...user, age: Number(e.currentTarget.value) })
                }
              }}
            />
          </div>
        </div>
        <div className={styles.containerResposive}>
          <div className={styles.itemsProfile}>
            <p className={styles.itemsTitle}>Rol</p>
            <input type='text' disabled className={`glass ${styles.itemsData}`} value={Rol[user?.rol as any] ?? ''} />
          </div>
          <div className={styles.itemsProfile}>
            <p className={styles.itemsTitle}>Actualizar mis datos</p>
            <button className={`glass ${styles.itemsData}`} onClick={(e) => { void handleUpdateProfile() }}>Guardar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  )
}

async function fileToBase64 (file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)

    reader.readAsDataURL(file)
  })
}
