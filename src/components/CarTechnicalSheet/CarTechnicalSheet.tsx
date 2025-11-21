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
      if (car == null || loggedId == null) return

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
    if (car == null) return

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
      if (car == null) return undefined

      const buildPdfElement = (carData: any): HTMLElement => {
        // === LIENZO A4 ===
        const wrapper = document.createElement('div')
        wrapper.style.width = '1123px'
        wrapper.style.minHeight = '1587px'
        wrapper.style.background = '#f3f4f7'
        wrapper.style.display = 'flex'
        wrapper.style.justifyContent = 'center'
        wrapper.style.alignItems = 'flex-start'
        wrapper.style.boxSizing = 'border-box'
        wrapper.style.padding = '40px'
        wrapper.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'

        // === CARD ===
        const card = document.createElement('div')
        card.style.width = '100%'
        card.style.maxWidth = '980px'
        card.style.background = '#ffffff'
        card.style.borderRadius = '20px'
        card.style.boxShadow = '0 18px 40px rgba(0,0,0,0.15)'
        card.style.padding = '36px'
        card.style.boxSizing = 'border-box'
        card.style.color = '#111827'
        wrapper.appendChild(card)

        // === HEADER ===
        const header = document.createElement('div')
        header.style.display = 'flex'
        header.style.justifyContent = 'space-between'
        header.style.alignItems = 'baseline'
        header.style.marginBottom = '18px'

        const title = document.createElement('h1')
        title.textContent = `${carData.brands?.desc ?? ''} – ${carData.models?.desc ?? ''}`
        title.style.margin = '0'
        title.style.fontSize = '26px'
        title.style.letterSpacing = '0.04em'
        title.style.textTransform = 'uppercase'

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
        hr.style.background = 'linear-gradient(to right,#e5e7eb,#d1d5db,#e5e7eb)'
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
          placeholder.style.gridColumn = '1 / span 3'
          placeholder.style.height = '200px'
          placeholder.style.borderRadius = '14px'
          placeholder.style.background = '#e5e7eb'
          placeholder.style.display = 'flex'
          placeholder.style.alignItems = 'center'
          placeholder.style.justifyContent = 'center'
          placeholder.style.color = '#6b7280'
          placeholder.textContent = 'Sin imágenes disponibles'
          photosSection.appendChild(placeholder)
        } else {
          images.forEach((imgObj: any) => {
            const cell = document.createElement('div')
            cell.style.position = 'relative'
            cell.style.overflow = 'hidden'
            cell.style.borderRadius = '14px'
            cell.style.height = '200px'
            cell.style.background = '#000'
            cell.style.display = 'flex'
            cell.style.alignItems = 'center'
            cell.style.justifyContent = 'center'

            const img = document.createElement('img')
            img.src = String(imgObj?.images?.image ?? '')
            img.style.width = '100%'
            img.style.height = '100%'
            img.style.objectFit = 'cover' // 🔥 N A D A    D E    E S T I R A C I Ó N
            img.style.display = 'block'

            cell.appendChild(img)
            photosSection.appendChild(cell)
          })
        }

        card.appendChild(photosSection)

        // === GRID DE DETALLES ===
        const detailsGrid = document.createElement('div')
        detailsGrid.style.display = 'grid'
        detailsGrid.style.gridTemplateColumns = '1.2fr 1.2fr'
        detailsGrid.style.columnGap = '48px'
        detailsGrid.style.rowGap = '28px'
        detailsGrid.style.marginBottom = '24px'
        card.appendChild(detailsGrid)

        const makeSection = (titleText: string, items: Array<[string, string]>) => {
          const section = document.createElement('div')

          const titleSec = document.createElement('h2')
          titleSec.textContent = titleText
          titleSec.style.fontSize = '15px'
          titleSec.style.textTransform = 'uppercase'
          titleSec.style.letterSpacing = '0.08em'
          titleSec.style.margin = '0 0 10px 0'
          titleSec.style.color = '#374151'
          section.appendChild(titleSec)

          const list = document.createElement('div')
          list.style.display = 'grid'
          list.style.gridTemplateColumns = '1fr 1fr'
          list.style.columnGap = '18px'
          list.style.rowGap = '6px'

          items.forEach(([label, value]) => {
            const row = document.createElement('div')
            row.style.fontSize = '12px'
            row.style.color = '#4b5563'

            const strong = document.createElement('span')
            strong.textContent = `${label}: `
            strong.style.fontWeight = '600'
            strong.style.color = '#111827'

            const spanVal = document.createElement('span')
            spanVal.textContent = value ?? ''

            row.appendChild(strong)
            row.appendChild(spanVal)
            list.appendChild(row)
          })

          section.appendChild(list)
          return section
        }

        const specs = makeSection('Especificaciones', [
          ['Marca', carData.brands?.desc ?? ''],
          ['Modelo', carData.models?.desc ?? ''],
          ['Estilo', carData.styles?.desc ?? ''],
          ['Año', carData.years?.desc ?? ''],
          ['Color exterior', carData.exterior_color ?? ''],
          ['Color interior', carData.interior_color ?? '']
        ])

        const mech = makeSection('Detalles mecánicos', [
          ['Transmisión', mapTransmission(carData.transmissions?.desc ?? '3')],
          ['Cilindraje', (() => {
            const desc = carData?.displacements?.desc

            if (typeof desc === 'string') {
              return desc.toLowerCase() === 'otro'
                ? 'Otro'
                : `${desc} L`
            }

            return ''
          })()],
          ['Combustible', carData.fuel?.desc ?? ''],
          ['Puertas', String(carData.number_of_doors ?? '')],
          ['Recibe', carData.receives ? 'Sí' : 'No'],
          ['Negociable', carData.negotiable ? 'Sí' : 'No']
        ])

        const state = makeSection('Estado', [
          ['Precio', formatCRC(carData.price)],
          ['Vendido', carData.sold ? 'Sí' : 'No'],
          ['Fecha de ingreso', (carData.audit?.created_at as string)?.split('T')[0] ?? '']
        ])

        detailsGrid.appendChild(specs)
        detailsGrid.appendChild(mech)

        const stateWrapper = document.createElement('div')
        stateWrapper.style.gridColumn = '1 / span 2'
        stateWrapper.appendChild(state)
        detailsGrid.appendChild(stateWrapper)

        // === FOOTER PRECIO ===
        const priceFooter = document.createElement('div')
        priceFooter.style.marginTop = '10px'
        priceFooter.style.paddingTop = '14px'
        priceFooter.style.borderTop = '1px solid #e5e7eb'
        priceFooter.style.display = 'flex'
        priceFooter.style.justifyContent = 'space-between'
        priceFooter.style.alignItems = 'center'

        const sellerLabel = document.createElement('div')
        sellerLabel.style.fontSize = '11px'
        sellerLabel.style.color = '#6b7280'
        sellerLabel.textContent = `Vendedor: ${carData.users?.name ?? ''} ${carData.users?.last_name ?? ''}`

        const priceBig = document.createElement('div')
        priceBig.textContent = formatCRC(carData.price)
        priceBig.style.fontSize = '20px'
        priceBig.style.fontWeight = '700'
        priceBig.style.color = '#0b3d91'

        priceFooter.appendChild(sellerLabel)
        priceFooter.appendChild(priceBig)
        card.appendChild(priceFooter)

        return wrapper
      }

      const element = buildPdfElement(car)
      element.style.position = 'fixed'
      element.style.left = '-9999px'
      element.style.top = '0'
      element.style.zIndex = '99999'
      document.body.appendChild(element)

      const imgs = Array.from(element.querySelectorAll<HTMLImageElement>('img'))
      await Promise.all(
        imgs.map(async img =>
          img.complete
            ? Promise.resolve()
            : new Promise<void>(res => { img.onload = img.onerror = () => res() })
        )
      )

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#f3f4f7'
      })

      const dataUrl = canvas.toDataURL('image/png')
      element.remove()
      return dataUrl
    } catch (err) {
      console.error('Error capturando el modal:', err)
      return undefined
    }
  }

  if (car == null) return null

  return (
    <Modal open={ctx.openSheet} id='modalSheet' setOpen={ctx.setOpenSheet}>

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

            {/* FAVORITOS */}
            <button
              className='glass'
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
                const exec = async (): Promise<void> => {
                  const imgData = await capture()
                  if (imgData == null) return

                  const JsPDF = (await import('jspdf')).default
                  const pdf = new JsPDF('p', 'mm', 'a4')

                  const pageWidth = 210
                  const pageHeight = 297

                  const img = new Image()
                  img.src = imgData

                  img.onload = () => {
                    const imgWidth = img.width
                    const imgHeight = img.height

                    const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight)

                    const finalWidth = imgWidth * ratio
                    const finalHeight = imgHeight * ratio

                    const marginX = (pageWidth - finalWidth) / 2
                    const marginY = 10

                    pdf.addImage(imgData, 'PNG', marginX, marginY, finalWidth, finalHeight)

                    const now = new Date()
                    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
                    const safeFileName = `${car.brands.desc}-${car.models.desc}-${dateStr}.pdf`
                      .replace(/[^a-z0-9-_.]/gi, '_')

                    pdf.save(safeFileName)
                  }
                }
                void exec()
              }}
            >
              Descargar ficha técnica (PDF)
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
              href={`https://wa.me/506${car.users.phone}/?text=${window.location.href}`} rel='noreferrer'
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

const mapTransmission = (id: number | string | null | undefined): string => {
  const num = Number(id)

  switch (num) {
    case 1: return 'Manual'
    case 2: return 'Automática'
    case 3: return 'Híbrida'
    default: return 'Desconocida'
  }
}
