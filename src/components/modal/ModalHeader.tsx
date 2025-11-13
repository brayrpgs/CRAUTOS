import type { ReactNode } from 'react'
import styles from '../../styles/modal/styles.module.css'

interface ModalHeaderProps {
  children?: ReactNode
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ children }: ModalHeaderProps) => {
  return (
    <div className={styles.header}>
      {children}
    </div>
  )
}
export { ModalHeader }
