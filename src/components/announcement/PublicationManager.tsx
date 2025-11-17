import React, { useState, useEffect } from 'react'

import { Modal } from '../modal/Modal'
import { ModalHeader } from '../modal/ModalHeader'
import { ModalContent } from '../modal/ModalContent'
import { ModalFooter } from '../modal/ModalFooter'

import { Card } from '../card/Card'
import { Pagination } from '../pagination/Pagination'

import styles from '../../styles/announcement/styles.module.css'
import { CARS_URL } from '../../common/common'

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

  useEffect(() => {
    const fetchCars = async (): Promise<void> => {
      try {
        const res = await fetch(
          `${CARS_URL}?id_users=eq.${TEMP_USER_ID}&select=id_cars,id_users,price,brands(desc),models(desc),years(desc),sold`
        )
        const data = await res.json()
        setCars(data)
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
    const modal = document.getElementById('publicacion-modal') as HTMLDialogElement | null
    if (modal == null) return

    const checkClosed = (): void => {
      if (!modal.open && open) setOpen(false)
    }

    modal.addEventListener('close', checkClosed)
    return () => modal.removeEventListener('close', checkClosed)
  }, [open])

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
                      image={car.image ?? '/ram1.avif'}
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
            <p style={{ color: 'white' }}>
              Aquí va el formulario real (marca, modelo, color, transmisión, imágenes…)
            </p>
          </ModalContent>

          <ModalFooter>
            <button className={styles.modalPrimaryBtn} onClick={() => setOpen(false)}>
              {mode === 'add' ? 'Agregar' : 'Guardar cambios'}
            </button>

            <button className={styles.modalSecondaryBtn} onClick={() => setOpen(false)}>
              Cancelar
            </button>
          </ModalFooter>
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
            <button
              className={styles.modalPrimaryBtn}
              onClick={() => { void deleteCar() }}
            >
              Sí, eliminar
            </button>

            <button
              className={styles.modalSecondaryBtn}
              onClick={() => setDeleteOpen(false)}
            >
              Cancelar
            </button>
          </ModalFooter>
        </Modal>
      </section>
    </>
  )
}

export { PublicationManager }
