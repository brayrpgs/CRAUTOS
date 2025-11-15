import React, { useState, useEffect } from 'react'

import { Modal } from '../modal/Modal'
import { ModalHeader } from '../modal/ModalHeader'
import { ModalContent } from '../modal/ModalContent'
import { ModalFooter } from '../modal/ModalFooter'

import { Card } from '../card/Card'
import { Pagination } from '../pagination/Pagination'

import styles from '../../styles/announcement/styles.module.css'

const cards = [
  { id: 1, image: '/ram1.avif', info: 'Toyota Corolla 2020' },
  { id: 2, image: '/ram2.avif', info: 'Honda Civic 2019' },
  { id: 3, image: '/ram3.avif', info: 'Mazda 3 Touring' },
  { id: 4, image: '/toyota-hilux-rad-1.avif', info: 'Hyundai Elantra 2021' },
  { id: 5, image: '/toyota-hilux-rad-2.avif', info: 'Toyota Yaris 2021' },
  { id: 6, image: '/toyota-hilux-rad-3.avif', info: 'Suzuki Swift 2020' },
  { id: 7, image: '/toyota-hilux-rad-2.avif', info: 'Toyota Yaris 2021' },
  { id: 8, image: '/toyota-hilux-rad-3.avif', info: 'Suzuki Swift 2020' },
  { id: 9, image: '/toyota-hilux-rad-2.avif', info: 'Toyota Yaris 2021' },
  { id: 10, image: '/toyota-hilux-rad-2.avif', info: 'Toyota Yaris 2021' },
  { id: 11, image: '/toyota-hilux-rad-2.avif', info: 'Toyota Yaris 2021' },
  { id: 12, image: '/toyota-hilux-rad-3.avif', info: 'Suzuki Swift 2020' }

]

const PublicationManager: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'add' | 'edit'>('add')
  const [selected, setSelected] = useState<number | null>(null)

  // Sincroniza cierre del <dialog> con el estado de React
  useEffect(() => {
    const modal = document.getElementById('publicacion-modal') as HTMLDialogElement | null
    if (modal == null) return

    const checkClosed = (): void => {
      if (!modal.open && open) setOpen(false)
    }

    modal.addEventListener('close', checkClosed)
    return () => modal.removeEventListener('close', checkClosed)
  }, [open])

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

  return (
    <>
      {open && <div className={styles.overlay} />}

      <section className={styles.box}>
        <div className={styles.boxHeader}>
          <h2 className={styles.title}>Tus publicaciones</h2>

          <button
            type='button'
            className={styles.addButton}
            onClick={openAddModal}
          >
            + Nueva publicación
          </button>
        </div>

        <hr className={styles.divider} />

        {/* LISTA PAGINADA DE CARDS */}
        <Pagination
          items={cards}
          itemsPerPage={10}
          renderItem={(car) => (
            <div className={styles.cardWrapper}>
              <Card image={car.image} info={car.info}>
                <button
                  className={styles.cardClose}
                  onClick={(e) => {
                    e.stopPropagation()
                    alert(`Eliminar: ${car.info}`)
                  }}
                >
                  x
                </button>
              </Card>

              {/* Clic para editar */}
              <div
                className={styles.cardOverlayClick}
                onClick={() => openEditModal(car.id)}
              />
            </div>
          )}
        />

        {/* === MODAL === */}
        <Modal open={open} id='publicacion-modal'>
          <ModalHeader>
            <h2 style={{ color: 'white' }}>
              {mode === 'add'
                ? 'Nueva publicación'
                : `Editar ${selected != null
                  ? cards.find((c) => c.id === selected)?.info ?? ''
                  : ''
                }`}
            </h2>
          </ModalHeader>

          <ModalContent>
            <p style={{ color: 'white' }}>
              {mode === 'add'
                ? 'Formulario para agregar una nueva publicación.'
                : 'Formulario para editar el vehículo seleccionado.'}
            </p>
          </ModalContent>

          <ModalFooter>
            <button
              className={styles.modalPrimaryBtn}
              onClick={() => setOpen(false)}
            >
              {mode === 'add' ? 'Agregar' : 'Guardar'}
            </button>

            <button
              className={styles.modalSecondaryBtn}
              onClick={() => setOpen(false)}
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
