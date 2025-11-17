import React, { useEffect, useState } from 'react'
import styles from '../../styles/announcement/styles.module.css'
import { Card } from '../card/Card'
import { Pagination } from '../pagination/Pagination'
import { FAVORITE_CAR_URL, CARS_URL } from '../../common/common'
import { Modal } from '../modal/Modal'
import { ModalHeader } from '../modal/ModalHeader'
import { ModalContent } from '../modal/ModalContent'
import { ModalFooter } from '../modal/ModalFooter'

// Wishlist
interface WishlistItem {
  id_wishlist: number
  id_users: number
  id_cars: number
}

// Cars con SELECT JOIN
interface CarFromApi {
  id_cars: number
  id_users: number
  price: number
  image: string
  brands: { desc: string } | null
  models: { desc: string } | null
  years: { desc: number } | null
}

interface FavoriteCar {
  id: number
  image: string
  info: string
  price: number
}

const TEMP_USER_ID = 7

const FavoriteCarsManager: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteCar[]>([])
  const [loading, setLoading] = useState(true)

  // Estado del modal
  const [open, setOpen] = useState(false)
  const [carToDelete, setCarToDelete] = useState<number | null>(null)

  /* ===========================================
       SINCRONIZACIÓN DEL MODAL
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
        Cargar Favoritos
  ============================================ */
  useEffect(() => {
    const loadFavorites = async (): Promise<void> => {
      try {
        const wishlistRes = await fetch(`${FAVORITE_CAR_URL}?id_users=eq.${TEMP_USER_ID}`)
        const wishlist: WishlistItem[] = await wishlistRes.json()

        const favoriteIds = wishlist.map(w => w.id_cars)

        if (favoriteIds.length === 0) {
          setFavorites([])
          return
        }

        const carsRes = await fetch(
          `${CARS_URL}?select=id_cars,id_users,price,brands(desc),models(desc),years(desc)`
        )

        const cars: CarFromApi[] = await carsRes.json()

        const filtered: FavoriteCar[] = cars
          .filter(car => favoriteIds.includes(car.id_cars))
          .filter(car => car.id_users !== TEMP_USER_ID)
          .map(car => ({
            id: car.id_cars,
            image: car.image ?? '/ram1.avif',
            price: car.price,
            info: `${car.brands?.desc ?? ''} ${car.models?.desc ?? ''} ${car.years?.desc ?? ''}`
          }))

        setFavorites(filtered)
      } catch (err) {
        console.error('Error cargando favoritos', err)
      } finally {
        setLoading(false)
      }
    }

    void loadFavorites()
  }, [])

  /* ===========================================
        Lógica de eliminación
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
        `${FAVORITE_CAR_URL}?id_users=eq.${TEMP_USER_ID}&id_cars=eq.${carToDelete}`,
        { method: 'DELETE' }
      )

      setFavorites(prev => prev.filter(c => c.id !== carToDelete))
    } catch (err) {
      console.error('Error eliminando favorito', err)
    } finally {
      closeModal()
    }
  }

  /* ===========================================
        Render de card
  ============================================ */
  const renderFavoriteCard = (car: FavoriteCar): React.ReactNode => (
    <div className={styles.cardWrapperFav}>
      <Card
        image={car.image}
        info={`${car.info} — ₡${car.price.toLocaleString('es-CR')}`}
      >
        <button
          className={styles.favoriteButton}
          onClick={() => confirmDelete(car.id)}
        >
          ❤️
        </button>
      </Card>
    </div>
  )

  return (
    <section className={styles.box}>
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

      {/* ===== MODAL ===== */}
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
            className={styles.modalPrimaryBtn}
            onClick={() => { void handleDelete() }}
          >
            Sí, eliminar
          </button>

          <button
            className={styles.modalSecondaryBtn}
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
