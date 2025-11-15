import React, { useState, useEffect } from 'react'

import { Modal } from '../modal/Modal'
import { ModalHeader } from '../modal/ModalHeader'
import { ModalContent } from '../modal/ModalContent'
import { ModalFooter } from '../modal/ModalFooter'

import { Card } from '../card/Card'
import styles from '../../styles/announcement/styles.module.css'

const cards = [
  { id: 1, image: "/ram1.avif", info: "Toyota Corolla 2020" },
  { id: 2, image: "/ram2.avif", info: "Honda Civic 2019" },
  { id: 3, image: "/ram3.avif", info: "Mazda 3 Touring" },
  { id: 4, image: "/toyota-hilux-rad-1.avif", info: "Hyundai Elantra 2021" },
  { id: 5, image: "/toyota-hilux-rad-2.avif", info: "Toyota Yaris 2021" },
  { id: 6, image: "/toyota-hilux-rad-3.avif", info: "Suzuki Swift 2020" },
]

const PublicationManager: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'add' | 'edit'>('add')
  const [selected, setSelected] = useState<number | null>(null)

  useEffect(() => {
    const modal = document.getElementById('publicacion-modal') as HTMLDialogElement | null
    if (!modal) return

    const checkClosed = (): void => {
      if (!modal.open && open) {
        setOpen(false)
      }
    }

    modal.addEventListener('close', checkClosed)
    return () => modal.removeEventListener('close', checkClosed)
  }, [open])

  const openAddModal = () => {
    setMode('add')
    setSelected(null)
    setOpen(true)
  }

  const openEditModal = (index: number) => {
    setMode('edit')
    setSelected(index + 1)
    setOpen(true)
  }

  return (
    <>
      {open && <div className={styles.overlay} />}

      <section className={styles.box}>
        <div className={styles.boxHeader}>
          <h2 className={styles.title}>Tus publicaciones</h2>

          <button type='button' className={styles.addButton} onClick={openAddModal}>
            + Nueva publicación
          </button>
        </div>

        <hr className={styles.divider} />

        <div className={styles.cards}>
          {cards.map((car, index) => (
            <div
              key={car.id}
              style={{ position: "relative" }}
            >
              {/* CARD */}
              <div onClick={() => openEditModal(index)}>
                <Card image={car.image} info={car.info}>
                  {/* BOTÓN ELIMINAR */}
                  <button
                    type="button"
                    className={styles.cardClose}
                    aria-label="Eliminar tarjeta"
                    onClick={(e) => {
                      e.stopPropagation()
                      alert(`Eliminar: ${car.info}`)
                    }}
                  >
                    x
                  </button>
                </Card>
              </div>
            </div>
          ))}
        </div>

        {/* === MODAL === */}
        <Modal open={open} id='publicacion-modal'>
          <ModalHeader>
            <h2 style={{ color: 'white' }}>
              {mode === 'add'
                ? 'Nueva publicación'
                : `Editar ${selected !== null ? cards[selected - 1].info : ''}`}
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
              onClick={() => setOpen(false)}
              style={{
                background: '#0d6efd',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                marginRight: '0.5rem'
              }}
            >
              {mode === 'add' ? 'Agregar' : 'Guardar'}
            </button>

            <button
              onClick={() => setOpen(false)}
              style={{
                background: '#6c757d',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                color: 'white',
                border: 'none',
                cursor: 'pointer'
              }}
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
