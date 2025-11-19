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

// Cars con imágenes
interface CarFromApi {
  id_cars: number
  id_users: number
  price: number
  sold: boolean
  brands?: { desc: string }
  models?: { desc: string }
  years?: { desc: number }
  cars_images?: Array<{ id_images: number; images: { image: string } }>
}

// Favoritos procesados
interface FavoriteCar {
  id: number
  image: string
  info: string
  price: number
  sold: boolean
}

const TEMP_USER_ID = 2

const FavoriteCarsManager: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteCar[]>([])
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
        Cargar favoritos + vehículos
  ============================================ */
  useEffect(() => {
    const loadFavorites = async (): Promise<void> => {
      try {
        const wishlistRes = await fetch(`${FAVORITE_CAR_URL}?id_users=eq.${TEMP_USER_ID}`)
        const wishlist: WishlistItem[] = await wishlistRes.json()

        const favoriteIds = wishlist.map(w => w.id_cars)

        if (favoriteIds.length === 0) {
          setFavorites([])
          setLoading(false)
          return
        }

        // *** IMPORTANTE: ahora incluye sold ***
        const carsRes = await fetch(
          `${CARS_URL}?select=id_cars,id_users,price,sold,brands(desc),models(desc),years(desc),cars_images(id_images,images(image))`
        )

        const cars: CarFromApi[] = await carsRes.json()

        const processed: FavoriteCar[] = cars
          .filter(car => favoriteIds.includes(car.id_cars))
          .filter(car => car.id_users !== TEMP_USER_ID)
          .map(car => {
            const firstImage = car.cars_images?.[0]?.images?.image ?? null
            const image = firstImage
              ? `data:image/jpeg;base64,${firstImage}`
              : '/ram1.avif'

            return {
              id: car.id_cars,
              image,
              price: car.price,
              sold: car.sold,
              info: `${car.brands?.desc ?? ''} ${car.models?.desc ?? ''} ${car.years?.desc ?? ''}`
            }
          })

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
        Lógica eliminar favorito
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
        Render de tarjeta
  ============================================ */
  const renderFavoriteCard = (car: FavoriteCar): React.ReactNode => (
    <div
      className={`${styles.cardWrapperFav} ${car.sold ? styles.cardSold : ''}`}
    >
      <Card
        image={car.image}
        info={`${car.info}\n₡${car.price.toLocaleString('es-CR')}`}
      >
        {/* Etiquetas de vendido */}
        {car.sold && (
          <>
            <div className={styles.soldDiagonal}>VENDIDO</div>
            <div className={styles.soldBadge}>VENDIDO</div>
          </>
        )}

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

      {/* MODAL */}
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
