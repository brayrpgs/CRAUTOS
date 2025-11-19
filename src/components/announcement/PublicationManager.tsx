import React, { useState, useEffect } from 'react'

import { Modal } from '../modal/Modal'
import { ModalHeader } from '../modal/ModalHeader'
import { ModalContent } from '../modal/ModalContent'
import { ModalFooter } from '../modal/ModalFooter'

import { Card } from '../card/Card'
import { Pagination } from '../pagination/Pagination'

import styles from '../../styles/announcement/styles.module.css'
import {
  CAR_IMAGES_URL,
  CARS_URL,
  IMAGES_URL,
  FAVORITE_CAR_URL,
  AUDIT_URL
} from '../../common/common'
import { CarForm } from './CarForm'

interface CarFromApi {
  id_cars: number
  id_users: number
  price: number
  image: string | null
  brands?: { desc: string }
  models?: { desc: string }
  years?: { desc: number }
  id_audit: number
  sold: boolean
}

const TEMP_USER_ID = 1
const JSON_HEADERS = {
  'Content-Type': 'application/json',
  Prefer: 'return=representation'
} as const

const PublicationManager: React.FC = () => {
  const [cars, setCars] = useState<CarFromApi[]>([])
  const [loading, setLoading] = useState(true)

  const [open, setOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const [mode, setMode] = useState<'add' | 'edit'>('add')
  const [selected, setSelected] = useState<number | null>(null)

  const [resetFormSignal, setResetFormSignal] = useState(0)

  const [mainToast, setMainToast] = useState<string | null>(null)

  const [confirmSoldOpen, setConfirmSoldOpen] = useState(false)
  const [carToSell, setCarToSell] = useState<number | null>(null)
  const [editBlockedOpen, setEditBlockedOpen] = useState(false)

  const showToast = (msg: string): void => {
    setMainToast(msg)
    setTimeout(() => setMainToast(null), 3000)
  }

  // ==============================================
  // BLOQUEAR SCROLL CUANDO CUALQUIER MODAL ABRE
  // ==============================================
  useEffect(() => {
    const anyModalOpen =
      open || deleteOpen || confirmSoldOpen || editBlockedOpen

    document.body.style.overflow = anyModalOpen ? 'hidden' : 'auto'

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [open, deleteOpen, confirmSoldOpen, editBlockedOpen])

  /* ============================================================
      FUNCIÓN REUTILIZABLE PARA CARGAR CARROS
  ============================================================ */
  const fetchCars = async (): Promise<void> => {
    try {
      const res = await fetch(
        `${CARS_URL}?id_users=eq.${TEMP_USER_ID}` +
        '&select=id_cars,id_users,id_brands,id_models,id_styles,exterior_color,interior_color,' +
        'id_transmission,id_displacement,id_fuel,receives,negotiable,number_of_doors,' +
        'id_year,price,id_audit,sold,' +
        'brands(desc),models(desc),years(desc),' +
        'cars_images(id_images,images(image))'
      )

      const data = await res.json()

      const processed: CarFromApi[] = data.map((car: any) => {
        const firstRel = car.cars_images?.[0]
        const base64 = firstRel?.images?.image ?? null

        return {
          ...car,
          image: base64 ? `data:image/jpeg;base64,${base64}` : null
        }
      })

      setCars(processed)
    } catch (err) {
      console.error('Error cargando tus vehículos:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchCars()
  }, [])

  /* ============================================================
      Helper genérico para sincronizar cierre de modales <dialog>
  ============================================================ */
  const setupDialogCloseSync = (
    id: string,
    isOpen: boolean,
    onClose: () => void
  ): void => {
    const modal = document.getElementById(id) as HTMLDialogElement | null
    if (modal == null) return

    const checkClosed = (): void => {
      if (!modal.open && isOpen) {
        onClose()
      }
    }

    modal.addEventListener('close', checkClosed)
    // cleanup
    return () => modal.removeEventListener('close', checkClosed)
  }

  /* ============================================================
      Sincronizar cierre modal principal
  ============================================================ */
  useEffect(() => {
    return setupDialogCloseSync('publicacion-modal', open, () => {
      setOpen(false)
      setSelected(null)
      setResetFormSignal(prev => prev + 1)
    })
  }, [open])

  /* ============================================================
      Modal de eliminar
  ============================================================ */
  useEffect(() => {
    return setupDialogCloseSync('delete-car-modal', deleteOpen, () => {
      setDeleteOpen(false)
      setSelected(null)
    })
  }, [deleteOpen])

  /* ============================================================
      Modal de confirmar venta
  ============================================================ */
  useEffect(() => {
    return setupDialogCloseSync('confirm-sold-modal', confirmSoldOpen, () => {
      setConfirmSoldOpen(false)
      setCarToSell(null)
    })
  }, [confirmSoldOpen])

  /* ============================================================
      Modal bloquear edición
  ============================================================ */
  useEffect(() => {
    return setupDialogCloseSync('edit-blocked-modal', editBlockedOpen, () => {
      setEditBlockedOpen(false)
    })
  }, [editBlockedOpen])

  /* ============================================================
      Abrir modales
  ============================================================ */
  const openAddModal = (): void => {
    setMode('add')
    setSelected(null)
    setResetFormSignal(prev => prev + 1)
    setOpen(true)
  }

  const openEditModal = (id: number): void => {
    const car = cars.find(c => c.id_cars === id)

    if (car?.sold) {
      setEditBlockedOpen(true)
      return
    }

    setMode('edit')
    setSelected(id)
    setOpen(true)
  }

  /* ============================================================
      Confirmar borrar
  ============================================================ */
  const confirmDelete = (id: number): void => {
    setSelected(id)
    setDeleteOpen(true)
  }

  /* ============================================================
      Eliminar carro
  ============================================================ */
  const deleteCar = async (): Promise<void> => {
    if (selected == null) return

    try {
      // relaciones imágenes-carro
      const relRes = await fetch(
        `${CAR_IMAGES_URL}?id_cars=eq.${selected}&select=id_images`
      )
      const relData = await relRes.json()
      const imageIds: number[] = relData.map((r: any) => r.id_images)

      // obtener audit_id desde cars
      const carRes = await fetch(
        `${CARS_URL}?id_cars=eq.${selected}&select=id_audit`
      )
      const carData = await carRes.json()
      const audit_id = carData[0]?.id_audit

      // borrar relaciones car_images
      await fetch(`${CAR_IMAGES_URL}?id_cars=eq.${selected}`, {
        method: 'DELETE'
      })

      // borrar imágenes reales
      for (const id of imageIds) {
        await fetch(`${IMAGES_URL}?id_images=eq.${id}`, { method: 'DELETE' })
      }

      // borrar favoritos
      await fetch(`${FAVORITE_CAR_URL}?id_cars=eq.${selected}`, {
        method: 'DELETE'
      })

      // borrar carro (primero, por FK)
      await fetch(`${CARS_URL}?id_cars=eq.${selected}`, { method: 'DELETE' })

      // ahora sí, borrar audit
      if (audit_id != null) {
        await fetch(`${AUDIT_URL}?id_audit=eq.${audit_id}`, {
          method: 'DELETE'
        })
      }

      await fetchCars()
      showToast('¡Vehículo eliminado exitosamente!')
    } catch (error) {
      console.error('Error eliminando vehículo:', error)
    } finally {
      setDeleteOpen(false)
      setSelected(null)
    }
  }

  /* ============================================================
      NUEVO: Marcar como vendido
  ============================================================ */
  const markAsSold = async (id: number): Promise<void> => {
    try {
      await fetch(`${CARS_URL}?id_cars=eq.${id}`, {
        method: 'PATCH',
        headers: JSON_HEADERS,
        body: JSON.stringify({ sold: true })
      })

      await fetchCars()
      showToast('¡Vehículo marcado como vendido!')
    } catch (err) {
      console.error('Error marcando como vendido:', err)
      showToast('Error al marcar como vendido.')
    }
  }

  /* ============================================================
      Guardar vehículo (ADD / EDIT)
  ============================================================ */
  const handleSave = async (data: any): Promise<void> => {
    try {
      const toBase64 = async (file: File) =>
        await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(String(reader.result).split(',')[1])
          reader.onerror = reject
          reader.readAsDataURL(file)
        })

      const newImageIds: number[] = []

      if (data.newImages.length > 0) {
        const base64Images = await Promise.all(
          data.newImages.map(async (f: File) => await toBase64(f))
        )

        for (const b64 of base64Images) {
          const res = await fetch(IMAGES_URL, {
            method: 'POST',
            headers: JSON_HEADERS,
            body: JSON.stringify({ image: b64 })
          })

          const json = await res.json()
          newImageIds.push(json[0].id_images)
        }
      }

      /* ======================== AÑADIR ======================== */
      if (mode === 'add') {
        // 1. Crear AUDIT vacío (campo por defecto en DB)
        const auditRes = await fetch(AUDIT_URL, {
          method: 'POST',
          headers: JSON_HEADERS,
          body: JSON.stringify({})
        })
        const auditJson = await auditRes.json()
        const id_audit = auditJson[0].id_audit

        // 2. Crear el carro con el audit_id
        const carPayload = {
          id_brands: data.id_brands,
          id_models: data.id_models,
          id_styles: data.id_styles,
          exterior_color: data.exterior_color,
          interior_color: data.interior_color,
          id_transmission: data.id_transmission,
          id_displacement: data.id_displacement,
          id_fuel: data.id_fuel,
          receives: data.receives,
          negotiable: data.negotiable,
          number_of_doors: data.number_of_doors,
          id_year: data.id_year,
          price: data.price,
          sold: false,
          id_users: TEMP_USER_ID,
          id_audit
        }

        const carRes = await fetch(CARS_URL, {
          method: 'POST',
          headers: JSON_HEADERS,
          body: JSON.stringify(carPayload)
        })

        const created = await carRes.json()
        const id_cars = created[0].id_cars

        // 3. Relacionar imágenes
        for (const idImg of newImageIds) {
          await fetch(CAR_IMAGES_URL, {
            method: 'POST',
            headers: JSON_HEADERS,
            body: JSON.stringify({ id_cars, id_images: idImg })
          })
        }

        await fetchCars()
        showToast('¡Vehículo agregado exitosamente!')
        setOpen(false)
        return
      }

      /* ======================== EDITAR ======================== */
      const carAuditRes = await fetch(
        `${CARS_URL}?id_cars=eq.${selected}&select=id_audit`
      )
      const carAuditData = await carAuditRes.json()
      const audit_id = carAuditData[0]?.id_audit
      const now = new Date().toISOString()

      // 1. Actualizar AUDIT (updated_at)
      if (audit_id) {
        await fetch(`${AUDIT_URL}?id_audit=eq.${audit_id}`, {
          method: 'PATCH',
          headers: JSON_HEADERS,
          body: JSON.stringify({
            updated_at: now
          })
        })
      }

      // 2. Actualizar el carro
      const updatePayload = {
        id_brands: data.id_brands,
        id_models: data.id_models,
        id_styles: data.id_styles,
        exterior_color: data.exterior_color,
        interior_color: data.interior_color,
        id_transmission: data.id_transmission,
        id_displacement: data.id_displacement,
        id_fuel: data.id_fuel,
        receives: data.receives,
        negotiable: data.negotiable,
        number_of_doors: data.number_of_doors,
        id_year: data.id_year,
        price: data.price,
        sold: data.sold
      }

      await fetch(`${CARS_URL}?id_cars=eq.${selected}`, {
        method: 'PATCH',
        headers: JSON_HEADERS,
        body: JSON.stringify(updatePayload)
      })

      // borrar imágenes marcadas
      for (const idImg of data.imagesToDelete) {
        await fetch(`${CAR_IMAGES_URL}?id_images=eq.${idImg}`, { method: 'DELETE' })
        await fetch(`${IMAGES_URL}?id_images=eq.${idImg}`, { method: 'DELETE' })
      }

      // asociar nuevas imágenes
      for (const idImg of newImageIds) {
        await fetch(CAR_IMAGES_URL, {
          method: 'POST',
          headers: JSON_HEADERS,
          body: JSON.stringify({ id_cars: selected, id_images: idImg })
        })
      }

      await fetchCars()
      showToast('¡Vehículo editado exitosamente!')
      setOpen(false)
    } catch (err) {
      console.error('Error guardando vehículo:', err)
    }
  }

  const selectedCarInfo =
    selected != null
      ? cars.find(c => c.id_cars === selected)?.models?.desc ?? ''
      : ''

  return (
    <>
      {(open || deleteOpen || confirmSoldOpen || editBlockedOpen) && (
        <div className={styles.overlay} />
      )}

      {/* ==== TOAST GLOBAL ==== */}
      {mainToast && (
        <div className={styles.globalToast}>
          {mainToast}
        </div>
      )}

      <section className={styles.box}>
        <div className={styles.boxHeader}>
          <h2 className={styles.title}>Tus publicaciones</h2>

          <button className={styles.addButton} onClick={openAddModal}>
            + Nueva publicación
          </button>
        </div>

        <hr className={styles.divider} />

        {loading
          ? (
            <p style={{ color: 'white' }}>Cargando...</p>
          )
          : cars.length === 0
            ? (
              <p style={{ color: 'white', textAlign: 'center' }}>
                Aún no tienes publicaciones.
              </p>
            )
            : (
              <Pagination
                items={cars}
                itemsPerPage={10}
                renderItem={(car) => (
                  <div
                    className={`${styles.cardWrapper} ${car.sold ? styles.cardSold : ''}`}
                    onClick={() => openEditModal(car.id_cars)}
                  >
                    <Card
                      image={car.image}
                      info={`${car.brands?.desc ?? ''} ${car.models?.desc ?? ''} ${car.years?.desc ?? ''} — ₡${car.price.toLocaleString('es-CR')}`}
                    >
                      {car.sold && (
                        <div className={styles.soldDiagonal}>VENDIDO</div>
                      )}

                      {!car.sold && (
                        <button
                          className={styles.soldButton}
                          onClick={(e) => {
                            e.stopPropagation()
                            setCarToSell(car.id_cars)
                            setConfirmSoldOpen(true)
                          }}
                        >
                          Marcar como vendido
                        </button>
                      )}

                      {car.sold && (
                        <div className={styles.soldBadge}>
                          VENDIDO
                        </div>
                      )}

                      <button
                        className={styles.cardClose}
                        onClick={(e) => {
                          e.stopPropagation()
                          confirmDelete(car.id_cars)
                        }}
                      >
                        <svg
                          width='18'
                          height='18'
                          viewBox='0 0 24 24'
                          fill='black'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path d='M3 6h18v2H3V6zm2 3h14l-1.2 12.1c-.1 1.1-1 1.9-2.1 1.9H8.3c-1.1 0-2-.8-2.1-1.9L5 9zm5 2v8h2v-8H8zm4 0v8h2v-8h-2zM9 4V2h6v2h5v2H4V4h5z' />
                        </svg>
                      </button>
                    </Card>
                  </div>
                )}
              />
            )}

        {/* === MODAL ADD / EDIT === */}
        <Modal open={open} id='publicacion-modal'>
          <ModalHeader>
            <h2 className={styles.titleH2}>
              {mode === 'add' ? 'Nueva publicación' : `Editar ${selectedCarInfo}`}
            </h2>
          </ModalHeader>

          <ModalContent>
            <CarForm
              mode={mode}
              selected={selected}
              cars={cars}
              resetSignal={resetFormSignal}
              onSubmit={handleSave}
            />
          </ModalContent>
        </Modal>

        {/* === MODAL DELETE === */}
        <Modal open={deleteOpen} id='delete-car-modal'>
          <ModalHeader>
            <h2 style={{ color: 'white' }}>Eliminar vehículo</h2>
          </ModalHeader>

          <ModalContent>
            <p style={{ color: 'white' }}>
              ¿Estás seguro de que deseas eliminar esta publicación?
            </p>
          </ModalContent>

          <ModalFooter>
            <div style={{ display: 'flex', gap: '0.7rem' }}>
              <button
                className={`glass ${styles.modalPrimaryBtn}`}
                onClick={() => { void deleteCar() }}
              >
                Sí, eliminar
              </button>

              <button
                className={`glass ${styles.modalSecondaryBtn}`}
                onClick={() => setDeleteOpen(false)}
              >
                Cancelar
              </button>
            </div>
          </ModalFooter>
        </Modal>

        {/* === MODAL CONFIRMAR VENTA === */}
        <Modal open={confirmSoldOpen} setOpen={setConfirmSoldOpen} id='confirm-sold-modal'>
          <ModalHeader>
            <h2 style={{ color: 'white' }}>Confirmar venta</h2>
          </ModalHeader>

          <ModalContent>
            <p style={{ color: 'white' }}>
              ¿Seguro que deseas marcar este vehículo como vendido?
            </p>
          </ModalContent>

          <ModalFooter>
            <div style={{ display: 'flex', gap: '0.7rem' }}>
              <button
                className={`glass ${styles.modalPrimaryBtn}`}
                onClick={async () => {
                  if (carToSell == null) return
                  await markAsSold(carToSell)
                  setConfirmSoldOpen(false)
                }}
              >
                Sí, marcar como vendido
              </button>

              <button
                className={`glass ${styles.modalSecondaryBtn}`}
                onClick={() => setConfirmSoldOpen(false)}
              >
                Cancelar
              </button>
            </div>
          </ModalFooter>
        </Modal>

        {/* === MODAL BLOQUEAR EDICIÓN === */}
        <Modal open={editBlockedOpen} setOpen={setEditBlockedOpen} id='edit-blocked-modal'>
          <ModalHeader>
            <h2 style={{ color: 'white' }}>Edición no permitida</h2>
          </ModalHeader>

          <ModalContent>
            <p style={{ color: 'white' }}>
              No puedes editar este vehículo porque ya fue marcado como vendido.
            </p>
          </ModalContent>

          <ModalFooter>
            <button
              className='glass'
              style={{ width: '100%' }}
              onClick={() => setEditBlockedOpen(false)}
            >
              Entendido
            </button>
          </ModalFooter>
        </Modal>

      </section>
    </>
  )
}

export { PublicationManager }
