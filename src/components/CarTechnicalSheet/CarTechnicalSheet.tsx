import React, { useContext } from 'react'
import { Modal } from '../modal/Modal'
import { ModalContent } from '../modal/ModalContent'
import { ModalFooter } from '../modal/ModalFooter'
import { ModalHeader } from '../modal/ModalHeader'
import Carousel from '../carousel/Carousel'
import styles from '../../styles/card-sheet/styles.module.css'
import { HomeContext } from '../home/HomeContext'
import html2canvas from 'html2canvas'

export const CarTechnicalSheet: React.FC = () => {
  const ctx = useContext(HomeContext)
  if ((ctx?.carSelected) == null) return null

  const car = ctx.carSelected

  return (
    <Modal open={ctx.openSheet} id='modalSheet' setOpen={ctx.setOpenSheet}>
      <ModalHeader>
        {car.brands.desc} – {car.styles.desc}
      </ModalHeader>

      <ModalContent>
        {/* Carrusel */}
        <div className={styles.carouselWrapper}>
          <Carousel
            images={car.cars_images.map(image => image.images.image)}
          />
        </div>

        {/* Información organizada en columnas */}
        <div className={styles.columnsGrid}>

          {/* ESPECIFICACIONES */}
          <div>
            <h3>Especificaciones</h3>
            <div className={styles.twoColumnList}>
              <p><strong>Marca:</strong> {car.brands.desc}</p>
              <p><strong>Modelo:</strong> {car.models.desc}</p>
              <p><strong>Estilo:</strong> {car.styles.desc}</p>
              <p><strong>Año:</strong> {car.years.desc}</p>
              <p><strong>Color exterior:</strong> {car.exterior_color}</p>
              <p><strong>Color interior:</strong> {car.interior_color}</p>
            </div>
          </div>

          {/* DETALLES MECÁNICOS */}
          <div>
            <h3>Detalles mecánicos</h3>
            <div className={styles.twoColumnList}>
              <p><strong>Transmisión:</strong> {car.transmissions.desc}</p>
              <p><strong>Cilindraje:</strong> {car.displacements.desc}</p>
              <p><strong>Combustible:</strong> {car.fuel.desc}</p>
              <p><strong>Puertas:</strong> {car.number_of_doors}</p>
              <p><strong>Recibe:</strong> {car.receives ? 'Sí' : 'No'}</p>
              <p><strong>Negociable:</strong> {car.negotiable ? 'Sí' : 'No'}</p>
            </div>
          </div>

          {/* ESTADO */}
          <div>
            <h3>Estado</h3>
            <div className={styles.twoColumnList}>
              <p><strong>Precio:</strong> ₡{car.price.toLocaleString('es-CR')}</p>
              <p><strong>Vendido:</strong> {car.sold ? 'Sí' : 'No'}</p>
              <p><strong>Fecha ingreso:</strong> {new Date(car.audit.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          {/* VENDEDOR */}
          <div className={styles.sellerCardInline}>
            <h3>Información del vendedor</h3>

            <p><strong>Nombre:</strong> {car.users.name} {car.users.last_name}</p>
            <p><strong>Correo:</strong> {car.users.email}</p>
            <p><strong>Teléfono:</strong> {car.users.phone}</p>

            <div className={styles.sellerButtonsInline}>
              <a href={`https://wa.me/506${car.users.phone}`} target="_blank">WhatsApp</a>
              <a href={`mailto:${car.users.email}`}>Correo</a>
            </div>
          </div>

        </div>

      </ModalContent>

      <ModalFooter>
        <details className={styles.details}>
          <summary>Más opciones</summary>

          <div className={styles.actionsContainer}>
            <button className='glass'>Agregar a Favoritos</button>
            <button className='glass'>Ver vendedor</button>

            <button className='glass'>Descargar ficha técnica</button>

            <a
              className='glass'
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              target='_blank' rel='noreferrer'
            >
              Compartir Facebook
            </a>

            <a
              className='glass'
              href={`https://wa.me/506${car.users.phone}/?text=${window.location.href}`}
            >
              Compartir WhatsApp
            </a>
          </div>
        </details>
      </ModalFooter>
    </Modal>
  )
}
