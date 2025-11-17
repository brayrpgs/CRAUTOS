import React, { useState, useEffect } from 'react'

import { Modal } from '../modal/Modal'
import { ModalHeader } from '../modal/ModalHeader'
import { ModalContent } from '../modal/ModalContent'
import { ModalFooter } from '../modal/ModalFooter'

import { Card } from '../card/Card'
import { Pagination } from '../pagination/Pagination'

import styles from '../../styles/announcement/styles.module.css'
import { CAR_IMAGES_URL, CARS_URL, IMAGES_URL } from '../../common/common'
import { CarForm } from './CarForm'

// Tipo de respuesta del backend
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

const TEMP_USER_ID = 7 // luego vendrá por contexto

const PublicationManager: React.FC = () => {
  const [cars, setCars] = useState<CarFromApi[]>([])
  const [loading, setLoading] = useState(true)

  const [open, setOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const [mode, setMode] = useState<'add' | 'edit'>('add')
  const [selected, setSelected] = useState<number | null>(null)

  const [resetFormSignal, setResetFormSignal] = useState(0)

  useEffect(() => {
    const modal = document.getElementById('publicacion-modal') as HTMLDialogElement | null
    if (modal == null) return

    const checkClosed = () => {
      if (!modal.open && open) {
        setOpen(false)
        setSelected(null)
        setResetFormSignal(prev => prev + 1)
      }
    }

    modal.addEventListener('close', checkClosed)
    return () => modal.removeEventListener('close', checkClosed)
  }, [open])

  useEffect(() => {
    const fetchCars = async (): Promise<void> => {
      try {
        const res = await fetch(
          `${CARS_URL}?id_users=eq.${TEMP_USER_ID}&select=id_cars,id_users,id_brands,id_models,id_styles,exterior_color,interior_color,id_transmission,id_displacement,id_fuel,receives,negotiable,number_of_doors,id_year,price,sold,brands(desc),models(desc),years(desc),cars_images(id_images,images(image))`
        )

        const data = await res.json()

        // Procesar la primera imagen base64
        const processed = data.map(car => {
          const firstRel = car.cars_images?.[0]
          const base64 = firstRel?.images?.image

          return {
            ...car,
            image: base64
              ? `data:image/jpeg;base64,${base64}`
              : null
          }
        })

        setCars(processed)
      } catch (err) {
        console.error('Error cargando tus vehículos:', err)
      } finally {
        setLoading(false)
      }
    }


    void fetchCars()
  }, [])

  /* =============================
        Sincronizar modal
  ============================== */
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

  /* =============================
        Abrir modal
  ============================== */
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

  /* =============================
        Eliminar vehículo
  ============================== */
  const confirmDelete = (id: number): void => {
    setSelected(id)
    setDeleteOpen(true)
  }

  const deleteCar = async (): Promise<void> => {
    if (selected == null) return

    try {
      await fetch(`${CARS_URL}?id_cars=eq.${selected}`, {
        method: 'DELETE'
      })

      setCars(prev => prev.filter(c => c.id_cars !== selected))
    } catch (error) {
      console.error('Error eliminando vehículo:', error)
    } finally {
      setDeleteOpen(false)
      setSelected(null)
    }
  }

  const handleSave = async (data) => {
    try {
      // 1. Convertir imágenes a base64
      const toBase64 = async (file: File) =>
        await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(String(reader.result).split(',')[1])
          reader.onerror = reject
          reader.readAsDataURL(file)
        })

      const base64Images = await Promise.all(
        data.images.map(async img => await toBase64(img))
      )

      // 2. Subir imágenes → /images
      const uploadedImagesIds: number[] = []

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
        uploadedImagesIds.push(json[0].id_images)
      }

      // 3. Crear CARRO → /cars
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
        id_users: 7
      }

      const carRes = await fetch(CARS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Prefer: 'return=representation'
        },
        body: JSON.stringify(carPayload)
      })

      const createdCar = await carRes.json()
      const id_cars = createdCar[0].id_cars

      // 4. Relacionar imágenes con el carro
      for (const id_images of uploadedImagesIds) {
        await fetch(CAR_IMAGES_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Prefer: 'return=representation'
          },
          body: JSON.stringify({
            id_cars,
            id_images
          })
        })
      }

      alert('Carro publicado correctamente 🎉')
      setResetFormSignal(prev => prev + 1)
      setOpen(false)
    } catch (err) {
      console.error('Error publicando carro:', err)
      alert('Ocurrió un error al publicar el vehículo')
    }
  }

  const selectedCarInfo =
    selected != null ? cars.find((c) => c.id_cars === selected)?.models?.desc ?? '' : ''

  return (
    <>
      {(open || deleteOpen) && <div className={styles.overlay} />}

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
              <p style={{ color: 'white', textAlign: 'center' }}>Aún no tienes publicaciones.</p>
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
                        x
                      </button>
                    </Card>
                  </div>
                )}
              />
            )}

        {/* === MODAL ADD / EDIT === */}
        <Modal open={open} id='publicacion-modal'>
          <ModalHeader>
            <h2 style={{ color: 'white' }}>
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
