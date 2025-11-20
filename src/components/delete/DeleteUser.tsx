import React, { useState, useEffect } from 'react'
import styles from '../../styles/announcement/styles.module.css'

import {
  USERS_URL,
  CARS_URL,
  CAR_IMAGES_URL,
  IMAGES_URL,
  FAVORITE_CAR_URL,
  AUDIT_URL
} from '../../common/common'

import { Modal } from '../modal/Modal'
import { ModalHeader } from '../modal/ModalHeader'
import { ModalContent } from '../modal/ModalContent'
import { ModalFooter } from '../modal/ModalFooter'

import { getLoggedUserId } from '../../utils/GetUserUtils'

const UserLoguedId = getLoggedUserId()

const DeleteUser: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string): void => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  /* ============================================================
      BLOQUEAR SCROLL CUANDO EL MODAL ESTÁ ABIERTO
  ============================================================ */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'auto'
    return () => { document.body.style.overflow = 'auto' }
  }, [open])

  /* ============================================================
      sincronizar cierre modal
  ============================================================ */
  useEffect(() => {
    const modal = document.getElementById('delete-user-modal') as HTMLDialogElement | null
    if (modal == null) return

    const checkClosed = (): void => {
      if (!modal.open && open) {
        setOpen(false)
      }
    }

    modal.addEventListener('close', checkClosed)
    return () => modal.removeEventListener('close', checkClosed)
  }, [open])

  /* ============================================================
      eliminar usuario completamente
  ============================================================ */
  const deleteUser = async (): Promise<void> => {
    try {
      // 1. obtener carros del usuario
      const carRes = await fetch(
        `${CARS_URL}?id_users=eq.${UserLoguedId}&select=id_cars,id_audit`
      )
      const cars = await carRes.json()

      for (const car of cars) {
        const carId = car.id_cars

        // 2. obtener imágenes relacionadas
        const relRes = await fetch(
          `${CAR_IMAGES_URL}?id_cars=eq.${carId}&select=id_images`
        )
        const relData = await relRes.json()
        const carImageIds: number[] = relData.map((r: any) => r.id_images)

        // borrar car_images
        await fetch(`${CAR_IMAGES_URL}?id_cars=eq.${carId}`, { method: 'DELETE' })

        // borrar imágenes reales de los carros
        for (const id of carImageIds) {
          await fetch(`${IMAGES_URL}?id_images=eq.${id}`, { method: 'DELETE' })
        }

        // borrar favoritos que tenían este carro
        await fetch(`${FAVORITE_CAR_URL}?id_cars=eq.${carId}`, { method: 'DELETE' })

        // borrar carro
        await fetch(`${CARS_URL}?id_cars=eq.${carId}`, { method: 'DELETE' })

        // borrar auditoría del carro
        if (car.id_audit != null) {
          await fetch(`${AUDIT_URL}?id_audit=eq.${car.id_audit}`, { method: 'DELETE' })
        }
      }

      // 3. obtener datos del usuario (audit + imagen propia)
      const userRes = await fetch(
        `${USERS_URL}?id_user=eq.${UserLoguedId}&select=id_audit,id_images`
      )
      const userData = await userRes.json()

      const userAuditId = userData[0]?.id_audit
      const userImageId = userData[0]?.id_images

      // 3.1 borrar auditoría propia del usuario
      if (userAuditId != null) {
        await fetch(`${AUDIT_URL}?id_audit=eq.${userAuditId}`, { method: 'DELETE' })
      }

      // 3.2 borrar imagen asociada al usuario (foto de perfil, etc.)
      if (userImageId != null) {
        await fetch(`${IMAGES_URL}?id_images=eq.${userImageId}`, { method: 'DELETE' })
      }

      // 4. borrar usuario
      await fetch(`${USERS_URL}?id_user=eq.${UserLoguedId}`, {
        method: 'DELETE'
      })

      showToast('Tu cuenta ha sido eliminada correctamente')
      setOpen(false)

      // cerrar sesión
      localStorage.clear()
      window.location.href = '/'
    } catch (error) {
      console.error('Error eliminando usuario:', error)
      showToast('Error al intentar eliminar el usuario')
    }
  }

  return (
    <>
      {open && <div className={styles.overlay} />}

      {toast && (
        <div className={styles.globalToast}>
          {toast}
        </div>
      )}

      {/* === ENLACE COMO LOS DEMÁS === */}
      <a
        className={`glass ${styles.navigate}`}
        onClick={() => setOpen(true)}
        style={{ cursor: 'pointer' }}
      >
        <span className={styles.anchor}>
          &#10060; ELIMINAR CUENTA
        </span>
      </a>

      {/* === MODAL === */}
      <Modal open={open} id='delete-user-modal'>
        <ModalHeader>
          <h2 style={{ color: 'white' }}>Eliminar cuenta</h2>
        </ModalHeader>

        <ModalContent>
          <p style={{ color: 'white' }}>
            Esta acción eliminará tu cuenta y todos tus datos asociados. ¿Deseas continuar?
          </p>
        </ModalContent>

        <ModalFooter>
          <div style={{ display: 'flex', gap: '0.7rem' }}>
            <button
              className={`glass ${styles.modalPrimaryBtn}`}
              onClick={() => { void deleteUser() }}
            >
              Sí, eliminar definitivamente
            </button>

            <button
              className={`glass ${styles.modalSecondaryBtn}`}
              onClick={() => setOpen(false)}
            >
              Cancelar
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  )
}

export { DeleteUser }
