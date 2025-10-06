import { useEffect, useState } from 'react'
import styles from '../../styles/background/styles.module.css'

const images = [
  'ram1.avif',
  'ram2.avif',
  'ram3.avif',
  'toyota-hilux-rad-1.avif',
  'toyota-hilux-rad-2.avif',
  'toyota-hilux-rad-3.avif',
  'toyota-hilux-rad-4.avif'
]

export const Background: React.FC = () => {
  const [i, setI] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setI(p => (p + 1) % images.length), 4000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className={styles.background}>
      {images.map((src, idx) => (
        <img
          key={idx}
          src={src}
          className={`${styles.items} ${idx === i ? styles.fade : ''}`}
          alt=''
        />
      ))}
    </div>
  )
}
