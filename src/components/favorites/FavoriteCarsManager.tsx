import React, { useEffect, useState, useContext } from 'react'
import styles from '../../styles/announcement/styles.module.css'
import { Card } from '../card/Card'
import { Pagination } from '../pagination/Pagination'
import { FAVORITE_CAR_URL, CARS_URL } from '../../common/common'
import { Modal } from '../modal/Modal'
import { ModalHeader } from '../modal/ModalHeader'
import { ModalContent } from '../modal/ModalContent'
import { ModalFooter } from '../modal/ModalFooter'
import { getLoggedUserId } from '../../utils/GetUserUtils'

// IMPORTANTE: TRAER EL CONTEXTO
import { HomeContext } from '../home/HomeContext'

// Cars completos (usar tu tipo actual)
import type { Cars } from '../../models/car'

const UserLoguedId = getLoggedUserId()

const FavoriteCarsManager: React.FC = () => {
  const ctx = useContext(HomeContext) // ← AQUI NOS CONECTAMOS AL CONTEXTO

  const [favorites, setFavorites] = useState<Cars[]>([])
  const [loading, setLoading] = useState(true)

  const [open, setOpen] = useState(false)
  const [carToDelete, setCarToDelete] = useState<number | null>(null)

  const [toast, setToast] = useState<string | null>(null)

  /* ===========================================
        Sincronizar modal
  ============================================ */
  useEffect(() => {
    const modal = document.getElementById('confirm-delete-modal') as HTMLDialogElement | null
    if (modal == null) return

    const checkClosed = (): void => {
      if (!modal.open && open) {
        setOpen(false)
        setCarToDelete(null)
      }
    }

    modal.addEventListener('close', checkClosed)
    return () => modal.removeEventListener('close', checkClosed)
  }, [open])

  /* ===========================================
        Cargar favoritos + vehículos completos
  ============================================ */
  useEffect(() => {
    const loadFavorites = async (): Promise<void> => {
      try {
        // 1) Obtener los favoritos del usuario
        const wishlistRes = await fetch(`${FAVORITE_CAR_URL}?id_users=eq.${String(UserLoguedId)}`)
        const wishlist = await wishlistRes.json()

        const favoriteIds = wishlist.map((w: any) => w.id_cars)

        if (favoriteIds.length === 0) {
          setFavorites([])
          setLoading(false)
          return
        }

        // 2) Traer los carros COMPLETOS (igual que en Home)
        const carsRes = await fetch(
          `${CARS_URL}?select=*,brands(*),models(*),styles(*),transmissions(*),displacements(*),fuel(*),years(*),audit(*),users(*),cars_images(images(*))`
        )

        const cars: Cars[] = await carsRes.json()

        // 3) Filtrar solo los que están en favoritos y no son del usuario
        const processed = cars
          .filter(car => favoriteIds.includes(car.id_cars))
          .filter(car => car.id_users !== UserLoguedId)

        setFavorites(processed)
      } catch (err) {
        console.error('Error cargando favoritos', err)
      } finally {
        setLoading(false)
      }
    }

    void loadFavorites()
  }, [])

  /* ===========================================
        Eliminar favorito
  ============================================ */
  const confirmDelete = (carId: number): void => {
    setCarToDelete(carId)
    setOpen(true)
  }

  const closeModal = (): void => {
    setOpen(false)
    setCarToDelete(null)
  }

  const handleDelete = async (): Promise<void> => {
    if (carToDelete == null) return

    try {
      await fetch(
        `${FAVORITE_CAR_URL}?id_users=eq.${String(UserLoguedId)}&id_cars=eq.${carToDelete}`,
        { method: 'DELETE' }
      )

      setFavorites(prev => prev.filter(c => c.id_cars !== carToDelete))

      setToast(null)
      setTimeout(() => setToast('Eliminado de favoritos'), 20)
      setTimeout(() => setToast(null), 3500)
    } catch (err) {
      console.error('Error eliminando favorito', err)
    } finally {
      closeModal()
    }
  }

  /* ===========================================
        Render de tarjeta + ABRIR FICHA TECNICA
  ============================================ */
  const renderFavoriteCard = (car: Cars): React.ReactNode => (
    <div
      className={`${styles.cardWrapperFav} ${car.sold ? styles.cardSold : ''}`}
    >
      <Card
        image={car.cars_images?.[0]?.images?.image}
        info={`${car.brands?.desc ?? ''} ${car.models?.desc ?? ''} ${car.years?.desc ?? ''}\n₡${car.price.toLocaleString('es-CR')}`}

        // 🟢🟢🟢 AQUI ESTÁ LA MAGIA
        onClick={() => {
          ctx?.setCarSelected?.(car)
          ctx?.setOpenSheet?.(true)
        }}
      >
        {car.sold && (
          <>
            <div className={styles.soldDiagonal}>VENDIDO</div>
            <div className={styles.soldBadge}>VENDIDO</div>
          </>
        )}

        <button
          className={styles.favoriteButton}
          onClick={(e) => {
            e.stopPropagation() // ← evitar que abra la ficha al borrar
            confirmDelete(car.id_cars)
          }}
        >
          ❤️
        </button>
      </Card>
    </div>
  )

  return (
    <section className={styles.box}>
      {toast && <div className={styles.globalToast}>{toast}</div>}

      <div className={styles.boxHeader}>
        <h2 className={styles.title}>Mis favoritos</h2>
      </div>

      <hr className={styles.divider} />

      {loading
        ? <p style={{ color: 'white' }}>Cargando...</p>
        : favorites.length === 0
          ? <p style={{ color: 'white', textAlign: 'center' }}>No tienes vehículos favoritos.</p>
          : (
            <Pagination
              items={favorites}
              renderItem={renderFavoriteCard}
              itemsPerPage={10}
            />
          )}

      {/* MODAL DELETE */}
      <Modal open={open} id='confirm-delete-modal'>
        <ModalHeader>
          <h2 style={{ color: 'white' }}>Eliminar favorito</h2>
        </ModalHeader>

        <ModalContent>
          <p style={{ color: 'white' }}>
            ¿Estás seguro de que deseas eliminar este vehículo de tus favoritos?
          </p>
        </ModalContent>

        <ModalFooter>
          <button
            className={`glass ${styles.modalPrimaryBtn}`}
            onClick={() => { void handleDelete() }}
          >
            Sí, eliminar
          </button>

          <button
            className={`glass ${styles.modalSecondaryBtn}`}
            onClick={closeModal}
          >
            Cancelar
          </button>
        </ModalFooter>
      </Modal>
    </section>
  )
}

export { FavoriteCarsManager }
