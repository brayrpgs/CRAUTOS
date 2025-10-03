import React from 'react'
import styles from '../../styles/card/styles.module.css'

interface CardProps {
  image?: string
  info?: string
}

const Card: React.FC<CardProps> = (data: CardProps) => {
  return (
    <>
      <div className={`${styles['container-card']}  ${styles['size-card']}`}>
        <div className={`${styles.image}  ${styles['size-card']}`}>
          <img src={data.image} alt='' />
        </div>
        <p className={`${styles.info}  ${styles['size-card']}`}>
          {data.info}
        </p>
      </div>
    </>
  )
}

export { Card }
