import React, { useState } from 'react'
import { Modal } from '../modal/Modal'
import { ModalContent } from '../modal/ModalContent'
import { ModalFooter } from '../modal/ModalFooter'
import { ModalHeader } from '../modal/ModalHeader'
import Carousel from '../carousel/Carousel'
import styles from '../../styles/card-sheet/styles.module.css'
interface CarTechnicalSheetProps {
  id: number
}
export const CarTechnicalSheet: React.FC<CarTechnicalSheetProps> = ({ id }) => {
  const [titleCar, setTitleCar] = useState('No car selected')
  return (
    <Modal open id='modalSheet'>
      <ModalHeader>
        {titleCar}
      </ModalHeader>
      <ModalContent>
        <div className='carrusel'>
          <Carousel
            images={['ram3.avif', 'ram2.avif']}
          />
        </div>
        <div className={styles.container}>
          <p>Marca:</p>
          <p>Modelo:</p>
          <p>Estilo:</p>
          <p>Color exterior:</p>
          <p>Color interior:</p>
          <p>Transmision:</p>
          <p>Cilindraje:</p>
          <p>Combustible:</p>
          <p>Recibe:</p>
          <p>Negociable:</p>
          <p>Numero de puertas:</p>
          <p>Año:</p>
          <p>Precio:</p>
          <p>Negociable:</p>
          <p>Fecha de ingreso al sistema: 2025</p>
          <p>Vendido:</p>
        </div>
      </ModalContent>
      <ModalFooter>
        <details className={`${styles.details}`}>
          <summary>Mas opciones</summary>
          <div className={styles.actionsContainer}>
            <button className='glass'>Ver Vendedor</button>
            <button className='glass'>Agregar a Favoritos</button>
            <button className='glass'>Ver Vendedor</button>
            <button className='glass'>Compartir Whatsapp</button>
            <button className='glass'>Compartir facebook</button>
            <button className='glass'>Descargar ficha tecnica</button>
            <button className='glass'>Contactar al vendedor(correo)</button>
            <button className='glass'>Contactar al vendedor(Whatsapp)</button>
          </div>
        </details>
      </ModalFooter>
    </Modal>
  )
}
