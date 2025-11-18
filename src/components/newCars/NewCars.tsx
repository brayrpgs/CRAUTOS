import React from "react"

import styles from "../../styles/newCars/styles.module.css"
import Carousel from "../carousel/Carousel"

const cards = [
  { id: 1, image: '/ram1.avif', info: 'Toyota Corolla 2000' },
  { id: 2, image: '/ram2.avif', info: 'Toyota Corolla 2001' },
  { id: 3, image: '/ram3.avif', info: 'Toyota Corolla 2002' },
  { id: 4, image: '/toyota-hilux-rad-1.avif', info: 'Toyota Corolla 2003' },
  { id: 5, image: '/toyota-hilux-rad-2.avif', info: 'Toyota Corolla 2004' },
  { id: 6, image: '/toyota-hilux-rad-3.avif', info: 'Toyota Corolla 2005' },
  { id: 7, image: '/toyota-hilux-rad-2.avif', info: 'Toyota Corolla 2006' },
  { id: 8, image: '/toyota-hilux-rad-3.avif', info: 'Toyota Corolla 2007' },
  { id: 9, image: '/toyota-hilux-rad-2.avif', info: 'TToyota Corolla 2008' },
  { id: 10, image: '/toyota-hilux-rad-2.avif', info: 'Toyota Corolla 2009' },
  { id: 11, image: '/toyota-hilux-rad-2.avif', info: 'TToyota Corolla 2010' },
  { id: 12, image: '/toyota-hilux-rad-3.avif', info: 'Toyota Corolla 2011' }
]

const NewCars: React.FC = () => {
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