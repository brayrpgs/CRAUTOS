import React, { useContext, useEffect, useState } from 'react'
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
  const [image, setImage] = useState<string>()
  if (ctx?.carSelected === undefined) return
  const capture = async (): Promise<void> => {
    try {
      const element = document.getElementById('modalSheet')
      if (element == null) return
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true
      })
      const dataUrl = canvas.toDataURL('image/png')
      setImage(dataUrl)
    } catch (err) {
      console.error('Error capturandola informacion', err)
    }
  }
  useEffect(() => {
    void capture()
  }, [ctx.carSelected])
  return (
    <Modal open={ctx.openSheet} id='modalSheet' setOpen={ctx.setOpenSheet}>
      <ModalHeader>
        {`${ctx?.carSelected?.brands.desc} - ${ctx.carSelected.styles.desc}`}
      </ModalHeader>
      <ModalContent>
        <div className='carrusel'>
          <Carousel
            images={ctx.carSelected.cars_images.map((images) => { return images.images.image })}
          />
        </div>
        <div className={styles.container}>
          <p>Marca: {ctx.carSelected.brands.desc}</p>
          <p>Modelo: {ctx.carSelected.models.desc}</p>
          <p>Estilo: {ctx.carSelected.styles.desc}</p>
          <p>Color exterior: {ctx.carSelected.exterior_color}</p>
          <p>Color interior: {ctx.carSelected.interior_color}</p>
          <p>Transmision: {ctx.carSelected.transmissions.desc}</p>
          <p>Cilindraje: {ctx.carSelected.displacements.desc}</p>
          <p>Combustible: {ctx.carSelected.fuel.desc}</p>
          <p>Recibe: {ctx.carSelected.receives ? 'Sí' : 'No'}</p>
          <p>Numero de puertas: {ctx.carSelected.number_of_doors}</p>
          <p>Año: {ctx.carSelected.years.desc}</p>
          <p>Precio: {ctx.carSelected.price}</p>
          <p>Negociable: {ctx.carSelected.negotiable ? 'Sí' : 'No'}</p>
          <p>Fecha de ingreso al sistema: {ctx.carSelected.audit.created_at}</p>
          <p>Vendido: {ctx.carSelected.sold ? 'Sí' : 'No'}</p>
        </div>
      </ModalContent>
      <ModalFooter>
        <details className={`${styles.details}`}>
          <summary>Mas opciones</summary>
          <div className={styles.actionsContainer}>
            <button className='glass'>Ver Vendedor</button>
            <button className='glass'>Agregar a Favoritos</button>
            <button className='glass'>Ver Vendedor</button>
            <a className='glass' href={`https://wa.me/506${ctx.carSelected?.users.phone}/?text=${window.location.href}`}>Compartir Whatsapp</a>
            <a
              className='glass'
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              Compartir Facebook
            </a>
            <a className='glass' href={image}>Descargar ficha tecnica</a>
            <button className='glass'>Contactar al vendedor(correo)</button>
            <a
              className='glass'
              href={`https://api.whatsapp.com/send?phone=506${ctx.carSelected?.users.phone}`}
            >
              Contactar al vendedor(Whatsapp)
            </a>
          </div>
        </details>
      </ModalFooter>
    </Modal>
  )
}
