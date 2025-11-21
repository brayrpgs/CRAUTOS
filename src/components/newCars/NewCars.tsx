import React, { useEffect, useState } from 'react'

import styles from '../../styles/newCars/styles.module.css'
import Carousel from '../carousel/Carousel'
import { CARS_URL } from '../../common/common'
import { getLoggedUserId } from '../../utils/GetUserUtils'

interface CarFromApi {
  id_cars: number
  id_audit: number
  price: number

  id_users?: number

  brands?: { desc: string }
  models?: { desc: string }
  years?: { desc: number }
  cars_images?: Array<{ id_images: number, images: { image: string } }>

  mainImage?: string | null
}

const NewCars: React.FC = () => {
  const [cars, setCars] = useState<CarFromApi[]>([])

  useEffect(() => {
    void fetchNewCars()
  }, [])

  const fetchNewCars = async (): Promise<void> => {
    try {
      const loggedId = getLoggedUserId()

      // ===============================
      // BASE QUERY
      // ===============================
      let query =
        `${CARS_URL}?sold=eq.false&order=id_audit.desc&limit=20` +
        '&select=id_cars,id_audit,price,id_users,brands(desc),models(desc),years(desc),cars_images(id_images,images(image))'

      // ===============================
      // SI HAY USUARIO LOGUEADO → EXCLUIR SUS CARROS
      // ===============================
      if (loggedId != null) {
        query += `&id_users=neq.${loggedId}`
      }

      const response = await fetch(query, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      })

      if (!response.ok) throw new Error('Error en la respuesta')

      const data: CarFromApi[] = await response.json()

      const carsWithImages = data.map(car => ({
        ...car,
        mainImage: car.cars_images?.[0]?.images?.image ?? null
      }))

      setCars(carsWithImages)
    } catch (error) {
      console.error('Error fetcheando carros mas nuevos', error)
    }
  }

  // ===============================
  //  NORMALIZAR PARA EL CAROUSEL
  // ===============================
  const cards = cars.map(car => ({
    id: car.id_cars,
    image: car.mainImage ?? '',
    info:
      `${car.brands?.desc ?? ''} ${car.models?.desc ?? ''} ${car.years?.desc ?? ''}\n` +
      `₡${car.price.toLocaleString('es-CR')}`
  }))

  return (
    <section className={styles.carouselContainer}>
      <div className={styles.newCarsSlogan}>
        <h2>ECHA EL OJO A VEHÍCULOS NUEVOS DESTACADOS</h2>
        <h5>¡Están esperándote! ¿Qué esperás?</h5>
      </div>

      <Carousel cards={cards} autoPlay />
    </section>
  )
}

export default NewCars
