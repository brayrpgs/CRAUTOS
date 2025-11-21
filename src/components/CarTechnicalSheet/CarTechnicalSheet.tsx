import React, { useContext, useEffect } from 'react'
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

  useEffect(() => {
  }, [ctx?.carSelected, ctx?.openSheet])
  // funcion para renderizar el modal
  const capture = async (): Promise<string | undefined> => {
    try {
      const car = ctx?.carSelected
      if (car == null) return undefined

      const formatCRC = (value: unknown): string => {
        const nVal = Number(value)
        const n = Number.isFinite(nVal) ? nVal : 0
        try {
          return new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(n)
        } catch (_e) {
          // fallback: use ₡ with thousand separators
          return '₡' + n.toLocaleString('es-CR')
        }
      }

      const buildSimpleSheetElement = (carData: any): HTMLElement => {
        // A4-like layout (portrait) at ~96dpi: 1123 x 1587 px
        const wrapper = document.createElement('div')
        wrapper.style.width = '1123px'
        wrapper.style.minHeight = '1587px'
        wrapper.style.background = '#ffffff'
        wrapper.style.color = '#111'
        wrapper.style.padding = '32px'
        wrapper.style.fontFamily = 'Arial, Helvetica, sans-serif'
        wrapper.style.boxSizing = 'border-box'
        wrapper.style.border = '1px solid #e6e6e6'
        wrapper.style.lineHeight = '1.3'
        wrapper.style.fontSize = '14px'

        const title = document.createElement('h1')
        title.textContent = String(carData.brands?.desc ?? '') + ' - ' + String(carData.models?.desc ?? '')
        title.style.margin = '0 0 8px 0'
        title.style.fontSize = '26px'
        title.style.color = '#111'
        wrapper.appendChild(title)

        const subtitle = document.createElement('div')
        subtitle.textContent = String(carData.styles?.desc ?? '')
        subtitle.style.margin = '0 0 16px 0'
        subtitle.style.color = '#444'
        wrapper.appendChild(subtitle)

        const imgsContainer = document.createElement('div')
        // Use grid so images keep aspect ratio (width constrained, height auto)
        imgsContainer.style.display = 'grid'
        imgsContainer.style.gridTemplateColumns = '1fr 1fr'
        imgsContainer.style.gap = '12px'
        imgsContainer.style.marginBottom = '18px'
        const images = Array.isArray(carData.cars_images) ? carData.cars_images : []
        if (images.length === 0) {
          const placeholder = document.createElement('div')
          placeholder.style.width = '100%'
          placeholder.style.height = '260px'
          placeholder.style.background = '#f4f4f4'
          imgsContainer.appendChild(placeholder)
        } else {
          // place up to 4 images and keep their natural aspect ratio
          images.slice(0, 4).forEach((imgObj: any) => {
            const container = document.createElement('div')
            container.style.width = '100%'
            container.style.height = '260px'
            container.style.overflow = 'hidden'
            container.style.display = 'flex'
            container.style.alignItems = 'center'
            container.style.justifyContent = 'center'
            container.style.background = '#fff'

            const img = document.createElement('img')
            img.src = String(imgObj?.images?.image ?? '')
            img.style.maxWidth = '100%'
            img.style.maxHeight = '100%'
            img.style.width = 'auto'
            img.style.height = 'auto'
            img.style.objectFit = 'contain'
            img.style.display = 'block'
            container.appendChild(img)
            imgsContainer.appendChild(container)
          })
        }
        wrapper.appendChild(imgsContainer)

        const fields: Array<[string, string]> = [
          ['Marca', carData.brands?.desc ?? ''],
          ['Modelo', carData.models?.desc ?? ''],
          ['Estilo', carData.styles?.desc ?? ''],
          ['Color exterior', carData.exterior_color ?? ''],
          ['Color interior', carData.interior_color ?? ''],
          ['Transmision', carData.transmissions?.desc ?? ''],
          ['Cilindraje', carData.displacements?.desc ?? ''],
          ['Combustible', carData.fuel?.desc ?? ''],
          ['Recibe', carData.receives === true ? 'Sí' : 'No'],
          ['Numero de puertas', String(carData.number_of_doors ?? '')],
          ['Año', carData.years?.desc ?? ''],
          ['Precio', String(carData.price ?? '')],
          ['Negociable', carData.negotiable === true ? 'Sí' : 'No'],
          ['Fecha de ingreso', carData.audit?.created_at ?? ''],
          ['Vendido', carData.sold === true ? 'Sí' : 'No']
        ]

        const list = document.createElement('div')
        list.style.display = 'grid'
        list.style.gridTemplateColumns = '1fr 1fr'
        list.style.gap = '10px 24px'
        list.style.color = '#222'
        fields.forEach(([label, val]) => {
          const p = document.createElement('p')
          p.style.margin = '6px 0'
          const labelSpan = document.createElement('span')
          labelSpan.style.display = 'inline-block'
          labelSpan.style.width = '140px'
          labelSpan.style.fontWeight = '700'
          labelSpan.textContent = String(label) + ':'
          const valueSpan = document.createElement('span')
          valueSpan.style.marginLeft = '8px'
          // format price field specially
          if (String(label).toLowerCase().includes('precio')) {
            valueSpan.textContent = formatCRC(val)
          } else {
            valueSpan.textContent = String(val)
          }
          p.appendChild(labelSpan)
          p.appendChild(valueSpan)
          list.appendChild(p)
        })
        wrapper.appendChild(list)

        // Footer / price highlight
        const footer = document.createElement('div')
        footer.style.marginTop = '20px'
        footer.style.display = 'flex'
        footer.style.justifyContent = 'space-between'
        const price = document.createElement('div')
        price.textContent = 'Precio: ' + formatCRC(carData.price)
        price.style.fontSize = '18px'
        price.style.fontWeight = '700'
        price.style.color = '#0b3d91'
        footer.appendChild(price)
        wrapper.appendChild(footer)

        return wrapper
      }

      const elementToCapture = buildSimpleSheetElement(car)
      elementToCapture.style.position = 'fixed'
      elementToCapture.style.left = '-9999px'
      elementToCapture.style.top = '0'
      elementToCapture.style.zIndex = '99999'
      document.body.appendChild(elementToCapture)

      const imgs = Array.from(elementToCapture.querySelectorAll<HTMLImageElement>('img'))
      const imgPromises = imgs.map(async (img) => {
        if (img.complete) return
        await new Promise<void>((resolve) => { img.onload = img.onerror = () => resolve() })
      })
      await Promise.all(imgPromises)

      const canvas = await html2canvas(elementToCapture, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      })
      const dataUrl = canvas.toDataURL('image/png')
      elementToCapture.remove()
      return dataUrl
    } catch (err) {
      console.error('Error capturando el modal →', err)
      return undefined
    }
  }
  if (ctx?.carSelected === undefined) return
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
          <p>Fecha de ingreso al sistema: {new Date(ctx.carSelected.audit.created_at).getUTCDate()}</p>
          <p>Vendido: {ctx.carSelected.sold ? 'Sí' : 'No'}</p>
        </div>
      </ModalContent>
      <ModalFooter>
        <details className={`${styles.details}`}>
          <summary>Mas opciones</summary>
          <div className={styles.actionsContainer}>
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
            <button
              className='glass'
              onClick={() => {
                const exec = async (): Promise<void> => {
                  const dataUrl = await capture()
                  if (dataUrl == null) return
                  const now = new Date()
                  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
                  const safeFileName = (String(ctx?.carSelected?.brands?.desc ?? 'ficha') + '-' + String(ctx?.carSelected?.models?.desc ?? '') + '-' + dateStr + '.png').replace(/[^a-z0-9-_.]/gi, '_')
                  const link = document.createElement('a')
                  link.href = dataUrl
                  link.download = safeFileName
                  document.body.appendChild(link)
                  link.click()
                  link.remove()
                }
                void exec()
              }}
            >
              Descargar ficha tecnica
            </button>
            <a className='glass' href={`mailto:${ctx.carSelected.users.email}`}>Contactar al vendedor(correo)</a>
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
