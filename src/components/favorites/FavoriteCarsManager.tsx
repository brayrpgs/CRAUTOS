import React, { useState } from 'react'
import styles from '../../styles/announcement/styles.module.css'
import { Card } from '../card/Card'
import { Pagination } from '../pagination/Pagination'

interface FavoriteCar {
  id: number
  image: string
  info: string
}

const initialFavorites: FavoriteCar[] = [
  { id: 1, image: '/images/cars/corolla.png', info: 'Toyota Corolla 2020' },
  { id: 2, image: '/images/cars/civic.png', info: 'Honda Civic 2019' },
  { id: 3, image: '/images/cars/mazda3.png', info: 'Mazda 3 Touring' },
  { id: 4, image: '/images/cars/elantra.png', info: 'Hyundai Elantra 2021' }
]

const FavoriteCarsManager: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteCar[]>(initialFavorites)

  const toggleFavorite = (id: number): void => {
    setFavorites(prev => prev.filter(car => car.id !== id))
  }

  const renderFavoriteCard = (car: FavoriteCar): React.ReactNode => (
    <div className={styles.cardWrapperFav}>
      <Card image={car.image} info={car.info}>
        <button
          className={styles.favoriteButton}
          onClick={() => toggleFavorite(car.id)}
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

      {favorites.length === 0
        ? (
          <p style={{ color: 'white', fontSize: '1rem' }}>
            No tienes vehículos favoritos.
          </p>
          )
        : (
          <Pagination
            items={favorites}
            renderItem={renderFavoriteCard}
            itemsPerPage={10}
          />
          )}
    </section>
  )
}

export { FavoriteCarsManager }
