import React, { useContext, useEffect, useState } from 'react'
import { Modal } from '../modal/Modal'
import { ModalContent } from '../modal/ModalContent'
import { ModalFooter } from '../modal/ModalFooter'
import { ModalHeader } from '../modal/ModalHeader'
import Carousel from '../carousel/Carousel'
import styles from '../../styles/card-sheet/styles.module.css'
import { HomeContext } from '../home/HomeContext'
import html2canvas from 'html2canvas'
import { FAVORITE_CAR_URL } from '../../common/common'
import { getLoggedUserId } from '../../utils/GetUserUtils'

export const CarTechnicalSheet: React.FC = () => {
  const ctx = useContext(HomeContext)
  const car = ctx?.carSelected

  /* ===========================
       TOAST
  ============================ */
  const [favToast, setFavToast] = useState<string | null>(null)

  const showFavToast = (msg: string): void => {
    setFavToast(msg)
    setTimeout(() => setFavToast(null), 3000)
  }

  /* ===========================
       FAVORITOS
  ============================ */
  const loggedId = getLoggedUserId()
  const [isFavorite, setIsFavorite] = useState(false)
  const [savingFav, setSavingFav] = useState(false)

  // Revisar si ya es favorito
  useEffect(() => {
    const checkFav = async (): Promise<void> => {
      if (!car || !loggedId) return

      const res = await fetch(
        `${FAVORITE_CAR_URL}?id_users=eq.${loggedId}&id_cars=eq.${car.id_cars}`
      )
      const data = await res.json()

      setIsFavorite(data.length > 0)
    }

    void checkFav()
  }, [car, loggedId])

  // Agregar a favoritos
  const addToFavorites = async (): Promise<void> => {
    if (!loggedId) {
      showFavToast('Debes iniciar sesión para agregar favoritos.')
      return
    }
    if (!car) return

    try {
      setSavingFav(true)

      const res = await fetch(FAVORITE_CAR_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_users: loggedId,
          id_cars: car.id_cars
        })
      })

      if (!res.ok) {
        showFavToast('Este vehículo ya está en tu lista de favoritos.')
        setIsFavorite(true)
        return
      }

      setIsFavorite(true)
      showFavToast('¡Agregado a favoritos!')
    } catch (err) {
      console.error(err)
      showFavToast('Error agregando a favoritos.')
    } finally {
      setSavingFav(false)
    }
  }

  /* ===========================
       CAPTURA (html2canvas)
  ============================ */
  const capture = async (): Promise<string | undefined> => {
    try {
      if (!car) return undefined

      const buildSimpleSheetElement = (carData: any): HTMLElement => {
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
        title.textContent = `${carData.brands?.desc ?? ''} - ${carData.models?.desc ?? ''}`
        title.style.margin = '0 0 8px 0'
        wrapper.appendChild(title)

        const subtitle = document.createElement('div')
        subtitle.textContent = carData.styles?.desc ?? ''
        subtitle.style.margin = '0 0 16px 0'
        wrapper.appendChild(subtitle)

        const imgsContainer = document.createElement('div')
        imgsContainer.style.display = 'grid'
        imgsContainer.style.gridTemplateColumns = '1fr 1fr'
        imgsContainer.style.gap = '12px'
        imgsContainer.style.marginBottom = '18px'

        const images = Array.isArray(carData.cars_images) ? carData.cars_images : []

        if (images.length === 0) {
          const placeholder = document.createElement('div')
          placeholder.style.width = '100%'
          placeholder.style.height = '260px'
          placeholder.style.background = '#eee'
          imgsContainer.appendChild(placeholder)
        } else {
          images.slice(0, 4).forEach((imgObj: any) => {
            const wrapperImg = document.createElement('div')
            wrapperImg.style.width = '100%'
            wrapperImg.style.height = '260px'
            wrapperImg.style.display = 'flex'
            wrapperImg.style.justifyContent = 'center'
            wrapperImg.style.alignItems = 'center'
            wrapperImg.style.background = '#fff'

            const img = document.createElement('img')
            img.src = imgObj?.images?.image ?? ''
            img.style.maxWidth = '100%'
            img.style.maxHeight = '100%'
            img.style.objectFit = 'contain'

            wrapperImg.appendChild(img)
            imgsContainer.appendChild(wrapperImg)
          })
        }

        wrapper.appendChild(imgsContainer)

        const fields: Array<[string, string]> = [
          ['Marca', carData.brands?.desc ?? ''],
          ['Modelo', carData.models?.desc ?? ''],
          ['Estilo', carData.styles?.desc ?? ''],
          ['Color exterior', carData.exterior_color ?? ''],
          ['Color interior', carData.interior_color ?? ''],
          ['Transmisión', carData.transmissions?.desc ?? ''],
          ['Cilindraje', carData.displacements?.desc ?? ''],
          ['Combustible', carData.fuel?.desc ?? ''],
          ['Recibe', carData.receives ? 'Sí' : 'No'],
          ['Puertas', String(carData.number_of_doors ?? '')],
          ['Año', carData.years?.desc ?? ''],
          ['Precio', formatCRC(carData.price)],
          ['Negociable', carData.negotiable ? 'Sí' : 'No'],
          ['Fecha de ingreso', (carData.audit?.created_at as string)?.split('T')[0] ?? ''],
          ['Vendido', carData.sold ? 'Sí' : 'No']
        ]

        const list = document.createElement('div')
        list.style.display = 'grid'
        list.style.gridTemplateColumns = '1fr 1fr'
        list.style.gap = '10px 24px'

        fields.forEach(([label, val]) => {
          const p = document.createElement('p')
          p.style.margin = '6px 0'

          const labelSpan = document.createElement('span')
          labelSpan.style.fontWeight = '700'
          labelSpan.textContent = label + ': '

          const valueSpan = document.createElement('span')
          valueSpan.textContent = val

          p.appendChild(labelSpan)
          p.appendChild(valueSpan)
          list.appendChild(p)
        })

        wrapper.appendChild(list)

        return wrapper
      }

      const element = buildSimpleSheetElement(car)
      element.style.position = 'fixed'
      element.style.left = '-9999px'
      element.style.top = '0'
      document.body.appendChild(element)

      const imgs = Array.from(element.querySelectorAll<HTMLImageElement>('img'))
      await Promise.all(
        imgs.map(img =>
          img.complete
            ? Promise.resolve()
            : new Promise(resolve => { img.onload = img.onerror = resolve })
        )
      )

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      })

      const dataUrl = canvas.toDataURL('image/png')
      element.remove()
      return dataUrl
    } catch (err) {
      console.error('Error capturando el modal:', err)
      return undefined
    }
  }

  if (!car) return null

  return (
    <Modal open={ctx.openSheet} id="modalSheet" setOpen={ctx.setOpenSheet}>

      {favToast && <div className={styles.globalToast}>{favToast}</div>}

      <ModalHeader>
        {car.brands.desc} - {car.styles.desc}
      </ModalHeader>

      <ModalContent>

        <div className={styles.carouselWrapper}>
          <Carousel images={car.cars_images.map(i => i.images.image)} />
        </div>

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
              <a href={`https://wa.me/506${car.users.phone}`} target="_blank" rel="noreferrer">WhatsApp</a>
              <a href={`mailto:${car.users.email}`}>Correo</a>
            </div>
          </div>

        </div>

      </ModalContent>

      <ModalFooter>
        <details className={styles.details}>
          <summary>Más opciones</summary>

          <div className={styles.actionsContainer}>

            {/* FAVORITOS */}
            <button
              className="glass"
              disabled={isFavorite || savingFav}
              onClick={() => void addToFavorites()}
              style={{
                opacity: isFavorite ? 0.6 : 1,
                cursor: isFavorite ? 'not-allowed' : 'pointer'
              }}
            >
              {isFavorite ? 'Ya está en favoritos' : savingFav ? 'Guardando...' : 'Agregar a Favoritos'}
            </button>

            {/* DESCARGAR */}
            <button
              className='glass'
              onClick={() => {
                const exec = async () => {
                  const dataUrl = await capture()
                  if (!dataUrl) return

                  const now = new Date()
                  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
                  const safeFileName = `${car.brands.desc}-${car.models.desc}-${dateStr}.png`
                    .replace(/[^a-z0-9-_.]/gi, '_')

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
              Descargar ficha técnica
            </button>

            {/* SOCIAL */}
            <a
              className='glass'
              target='_blank'
              rel='noreferrer'
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
            >
              Compartir Facebook
            </a>

            <a
              className='glass'
              target='_blank'
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

/* ===========================
      FORMATO CRC
=========================== */
const formatCRC = (value: any): string => {
  const n = Number(value)
  try {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      maximumFractionDigits: 0
    }).format(n)
  } catch {
    return '₡' + n.toLocaleString('es-CR')
  }
}
