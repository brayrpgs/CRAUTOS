import React, { useEffect, useState } from "react"

import styles from "../../styles/newCars/styles.module.css"
import Carousel from "../carousel/Carousel"
import { CARS_URL } from "../../common/common"

interface CarFromApi {
  id_cars: number
  id_audit: number

  brands?: { desc: string }
  models?: { desc: string }
  years?: { desc: number }
  cars_images?: Array<{ id_images: number; images: { image: string } }>

  mainImage?: string | null
}

const NewCars: React.FC = () => {
  const [cars, setCars] = useState<CarFromApi[]>([])

  useEffect(() => {
    fetchNewCars()
  }, [])

  const fetchNewCars = async (): Promise<void> => {
    try {
      const response = await fetch(
        `${CARS_URL}?order=id_audit.desc&limit=20&select=id_cars,id_audit,brands(desc),models(desc),years(desc),cars_images(id_images,images(image))`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      )

      if (!response.ok) throw new Error('Error en la respuesta')

      const data: CarFromApi[] = await response.json()

      const carsWithImages = data.map(car => {
        return {
          ...car,
          mainImage: car.cars_images?.[0]?.images?.image
        }
      })

      setCars(carsWithImages)
    } catch (error) {
      console.error("Error fetcheando carros mas nuevos", error)
    }
  }

  // Normalizar para el componente Card del Carousel
  const cards = cars.map((car) => ({
    id: car.id_cars,
    image: car.mainImage ?? "",
    info: `${car.brands?.desc ?? ""} ${car.models?.desc ?? ""} ${car.years?.desc ?? ""}`,
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
