import * as React from 'react'
import styles from '../../styles/card/styles.module.css'

interface CardProps {
  image?: string
  info?: string
  children?: React.ReactNode // Para overlays externos si se ocupan
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined
}

const Card: React.FC<CardProps> = ({ image, info, children, onClick }) => {
  return (
    <div className={styles['container-card']} onClick={onClick}>
      {/* Imagen */}
      <div className={styles.image}>
        <img src={image} alt='' />
      </div>

      {/* Texto de info */}
      <p className={styles.info}>
        {info}
      </p>

      {/* Overlay dinámico (opcional, útil para corazón, botones, badges...) */}
      {children}
    </div>
  )
}

export { Card }
