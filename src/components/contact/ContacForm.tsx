import React, { useState } from 'react'
import FloatingInput from '../../components/input/FloatingInput'
import styles from '../../styles/contact/styles.module.css'

const ContactForm: React.FC = () => {
  const [message, setMessage] = useState('')

  return (
    <form className={styles.form}>
      {/* Campo nombre */}
      <div className={styles.inputGroup}>
        <FloatingInput type='text' label='Su nombre' />
      </div>

      {/* Campo correo */}
      <div className={styles.inputGroup}>
        <FloatingInput type='email' label='Su correo electrónico' />
      </div>

      {/* Campo teléfono */}
      <div className={styles.inputGroup}>
        <FloatingInput type='tel' label='Su número de teléfono' />
      </div>

      {/* TEXTAREA */}
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
  )
}

export { ContactForm }
