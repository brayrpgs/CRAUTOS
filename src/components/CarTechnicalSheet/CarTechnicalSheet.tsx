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

        const subtitle = document.createElement('span')
        subtitle.textContent = `${carData.brands?.desc ?? ''} · ${carData.models?.desc ?? ''} · ${carData.years?.desc ?? ''}`
        subtitle.style.fontSize = '14px'
        subtitle.style.color = '#6b7280'

        header.appendChild(title)
        header.appendChild(subtitle)
        card.appendChild(header)

        // LINEA
        const hr = document.createElement('div')
        hr.style.height = '1px'
        hr.style.background = '#d1d5db'
        hr.style.marginBottom = '24px'
        card.appendChild(hr)

        // === GALERÍA DE FOTOS (TODAS PERFECTAS EN CUADROS) ===
        const photosSection = document.createElement('div')
        photosSection.style.display = 'grid'
        photosSection.style.gridTemplateColumns = 'repeat(3, 1fr)'
        photosSection.style.gap = '14px'
        photosSection.style.marginBottom = '28px'

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
          ['Fecha de ingreso', (carData.audit?.created_at as string).split('T')[0] ?? ''],
          ['Vendido', carData.sold === true ? 'Sí' : 'No']
        ]

        const list = document.createElement('div')
        list.style.display = 'grid'
        list.style.gridTemplateColumns = '1fr 1fr'

        list.style.gap =
          '10px 24px'
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

      const element = buildPdfElement(car)
      element.style.position = 'fixed'
      element.style.top = '-99999px'
      element.style.left = '-99999px'
      element.style.opacity = '1'
      element.style.pointerEvents = 'none'
      element.style.zIndex = '-1'
      document.body.appendChild(element)

      const imgs = Array.from(element.querySelectorAll<HTMLImageElement>('img'))
      await Promise.all(
        imgs.map(async img =>
          img.complete
            ? await Promise.resolve()
            : await new Promise<void>(res => { img.onload = img.onerror = () => res() })
        )
      )

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

  const car = ctx.carSelected

  return (
    <Modal open={ctx.openSheet} id='modalSheet' setOpen={ctx.setOpenSheet}>
      <ModalHeader>
        {car.brands.desc} - {car.styles.desc}
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
              <a href={`https://wa.me/506${car.users.phone}`} target='_blank' rel='noreferrer'>WhatsApp</a>
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

                  link.download =
                    safeFileName
                  document.body.appendChild(link)

                  link.click()
                  link.remove()
                }
                void exec()
              }}
            >Descargar ficha técnica
            </button>

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
