import type { ReactNode } from 'react'
import styles from '../../styles/modal/styles.module.css'

interface ModalContentProps {
  children?: ReactNode
}

const ModalContent: React.FC<ModalContentProps> = ({ children }: ModalContentProps) => {
  return (
    <div className={styles.content}>
      {children}
    </div>
  )
}
export { ModalContent }
