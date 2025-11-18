import React, { useState, useEffect } from 'react'
import FloatingInput from '../../components/input/FloatingInput'
import styles from '../../styles/contact/styles.module.css'
import emailjs from 'emailjs-com'

// Modal genérico
import { Modal } from '../modal/Modal'
import { ModalHeader } from '../modal/ModalHeader'
import { ModalContent } from '../modal/ModalContent'
import { ModalFooter } from '../modal/ModalFooter'

const ContactForm: React.FC = () => {
  // Estados del formulario
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  // ===== MODAL =====
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMsg, setModalMsg] = useState('')
  const [modalType, setModalType] = useState<'success' | 'error'>('success')

  // ====== SINCRONIZACIÓN DE MODAL (como PublicationManager) ======
  useEffect(() => {
    const modal = document.getElementById('contact-modal') as HTMLDialogElement | null
    if (modal == null) return

    const checkClosed = (): void => {
      if (!modal.open && modalOpen) {
        setModalOpen(false)
      }
    }

    modal.addEventListener('close', checkClosed)
    return () => modal.removeEventListener('close', checkClosed)
  }, [modalOpen])

  // ===== VALIDACIÓN =====
  const validateForm = (): string | null => {
    if (!name.trim()) return 'El nombre es obligatorio.'

    // Solo letras (acentos y espacios permitidos)
    if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(name)) {
      return 'El nombre solo puede contener letras y espacios.'
    }

    if (!email.trim()) return 'El correo electrónico es obligatorio.'

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Ingrese un correo electrónico válido.'

    if (!phone.trim()) return 'El número de teléfono es obligatorio.'
    if (!/^\d+$/.test(phone)) return 'El teléfono solo puede contener números.'
    if (phone.length < 8) return 'El número telefónico debe tener al menos 8 dígitos.'

    if (!message.trim()) return 'El mensaje es obligatorio.'
    if (message.trim().length < 10) return 'El mensaje debe tener al menos 10 caracteres.'

    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const error = validateForm()
    if (error) {
      setModalType('error')
      setModalMsg(error)
      setModalOpen(true)
      return
    }

    emailjs.send(
      "service_q6hgq8u",
      "template_473talp",
      {
        name,
        email,
        phone,
        message
      },
      "XHkmqaIIQC7MWxH-J"
    )
      .then(() => {
        setModalType('success')
        setModalMsg("¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.")
        setModalOpen(true)

        setName('')
        setEmail('')
        setPhone('')
        setMessage('')
      })
      .catch(() => {
        setModalType('error')
        setModalMsg("Ocurrió un error al enviar tu mensaje. Inténtalo de nuevo más tarde.")
        setModalOpen(true)
      })
  }

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>

        <div className={styles.inputGroup}>
          <FloatingInput
            type='text'
            label='Su nombre'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <FloatingInput
            type='email'
            label='Su correo electrónico'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <FloatingInput
            type='tel'
            label='Su número de teléfono'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className={styles.textareaWrapper}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='Escriba su mensaje...'
          />
        </div>

        <button type='submit' className={styles.submitBtn}>
          Enviar Mensaje
        </button>
      </form>

      <Modal open={modalOpen} setOpen={setModalOpen} id="contact-modal">
        <ModalHeader>
          <h2 style={{ margin: 0 }}>
            {modalType === 'success' ? 'Mensaje enviado' : 'Error al enviar el mensaje'}
          </h2>
        </ModalHeader>

        <ModalContent>
          <p>{modalMsg}</p>
        </ModalContent>

        <ModalFooter>
          <button
            className="aceptMessageBtn"
            onClick={() => setModalOpen(false)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              background: modalType === 'success' ? '#4CAF50' : '#D32F2F',
              color: 'white'
            }}
          >
            Cerrar
          </button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export { ContactForm }
