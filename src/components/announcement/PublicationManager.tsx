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
  FAVORITE_CAR_URL
} from '../../common/common'
import { CarForm } from './CarForm'

interface CarFromApi {
  id_cars: number
  id_users: number
  price: number
  image: string
  brands?: { desc: string }
  models?: { desc: string }
  years?: { desc: number }
  sold: boolean
}

const TEMP_USER_ID = 7

const PublicationManager: React.FC = () => {
  const [cars, setCars] = useState<CarFromApi[]>([])
  const [loading, setLoading] = useState(true)

  const [open, setOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const [mode, setMode] = useState<'add' | 'edit'>('add')
  const [selected, setSelected] = useState<number | null>(null)

  const [resetFormSignal, setResetFormSignal] = useState(0)

  // ======= TOAST GLOBAL =======
  const [mainToast, setMainToast] = useState<string | null>(null)

  const showToast = (msg: string): void => {
    setMainToast(msg)
    setTimeout(() => setMainToast(null), 3000)
  }

  /* ============================================================
      FUNCIÓN REUTILIZABLE PARA CARGAR CARROS
  ============================================================ */
  const fetchCars = async (): Promise<void> => {
    try {
      const res = await fetch(
        `${CARS_URL}?id_users=eq.${TEMP_USER_ID}&select=id_cars,id_users,id_brands,id_models,id_styles,exterior_color,interior_color,id_transmission,id_displacement,id_fuel,receives,negotiable,number_of_doors,id_year,price,sold,brands(desc),models(desc),years(desc),cars_images(id_images,images(image))`
      )

      const data = await res.json()

      const processed = data.map(car => {
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
      Sincronizar cierre modal principal
  ============================================================ */
  useEffect(() => {
    const modal = document.getElementById('publicacion-modal') as HTMLDialogElement | null
    if (modal == null) return

    const checkClosed = (): void => {
      if (!modal.open && open) {
        setOpen(false)
        setSelected(null)
        setResetFormSignal(prev => prev + 1)
      }
    }

    modal.addEventListener('close', checkClosed)
    return () => modal.removeEventListener('close', checkClosed)
  }, [open])

  /* ============================================================
      Modal de eliminar
  ============================================================ */
  useEffect(() => {
    const modal = document.getElementById('delete-car-modal') as HTMLDialogElement | null
    if (modal == null) return

    const checkClosed = (): void => {
      if (!modal.open && deleteOpen) {
        setDeleteOpen(false)
        setSelected(null)
      }
    }

    modal.addEventListener('close', checkClosed)
    return () => modal.removeEventListener('close', checkClosed)
  }, [deleteOpen])

  /* ============================================================
      Abrir modales
  ============================================================ */
  const openAddModal = (): void => {
    setMode('add')
    setSelected(null)
    setOpen(true)
  }

  const openEditModal = (id: number): void => {
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
      const relRes = await fetch(
        `${CAR_IMAGES_URL}?id_cars=eq.${selected}&select=id_images`
      )
      const relData = await relRes.json()

      const imageIds = relData.map(r => r.id_images)

      await fetch(`${CAR_IMAGES_URL}?id_cars=eq.${selected}`, {
        method: 'DELETE'
      })

      for (const id of imageIds) {
        await fetch(`${IMAGES_URL}?id_images=eq.${id}`, { method: 'DELETE' })
      }

      await fetch(`${FAVORITE_CAR_URL}?id_cars=eq.${selected}`, { method: 'DELETE' })

      await fetch(`${CARS_URL}?id_cars=eq.${selected}`, { method: 'DELETE' })

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
      Guardar vehículo (ADD / EDIT)
  ============================================================ */
  const handleSave = async (data): Promise<void> => {
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
          data.newImages.map(async f => await toBase64(f))
        )

        for (const b64 of base64Images) {
          const res = await fetch(IMAGES_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Prefer: 'return=representation'
            },
            body: JSON.stringify({ image: b64 })
          })

          const json = await res.json()
          newImageIds.push(json[0].id_images)
        }
      }

      /* ======================== AÑADIR ======================== */
      if (mode === 'add') {
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
          id_users: TEMP_USER_ID
        }

        const carRes = await fetch(CARS_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Prefer: 'return=representation'
          },
          body: JSON.stringify(carPayload)
        })

        const created = await carRes.json()
        const id_cars = created[0].id_cars

        for (const idImg of newImageIds) {
          await fetch(CAR_IMAGES_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Prefer: 'return=representation'
            },
            body: JSON.stringify({ id_cars, id_images: idImg })
          })
        }

        await fetchCars()
        showToast('¡Vehículo agregado exitosamente!')
        setOpen(false)
        setResetFormSignal(prev => prev + 1)
        return
      }

      /* ======================== EDITAR ======================== */
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
        headers: {
          'Content-Type': 'application/json',
          Prefer: 'return=representation'
        },
        body: JSON.stringify(updatePayload)
      })

      for (const idImg of data.imagesToDelete) {
        await fetch(`${CAR_IMAGES_URL}?id_images=eq.${idImg}`, { method: 'DELETE' })
        await fetch(`${IMAGES_URL}?id_images=eq.${idImg}`, { method: 'DELETE' })
      }

      for (const idImg of newImageIds) {
        await fetch(CAR_IMAGES_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Prefer: 'return=representation'
          },
          body: JSON.stringify({ id_cars: selected, id_images: idImg })
        })
      }

      await fetchCars()
      showToast('¡Vehículo editado exitosamente!')
      setOpen(false)
      setResetFormSignal(prev => prev + 1)
    } catch (err) {
      console.error('Error guardando vehículo:', err)
    }
  }

  const selectedCarInfo =
    selected != null ? cars.find(c => c.id_cars === selected)?.models?.desc ?? '' : ''

  return (
    <>
      {(open || deleteOpen) && <div className={styles.overlay} />}

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
                    className={styles.cardWrapper}
                    onClick={() => openEditModal(car.id_cars)}
                  >
                    <Card
                      image={car.image}
                      info={`${car.brands?.desc ?? ''} ${car.models?.desc ?? ''} ${car.years?.desc ?? ''} — ₡${car.price.toLocaleString('es-CR')}`}
                    >
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
      </section>
    </>
  )
}

export { PublicationManager }
