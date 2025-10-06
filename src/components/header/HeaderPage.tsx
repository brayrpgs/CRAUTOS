import type React from 'react'
import styles from '../../styles/header/styles.module.css'

interface HeaderProps {
  children: React.ReactNode
}

const HeaderPage: React.FC<HeaderProps> = ({ children }: HeaderProps) => {
  return (
    <header className={styles.header}>
      {children}
    </header>
  )
}

export { HeaderPage }
