import { useEffect, useRef, type ReactNode } from 'react'
import styles from '../../styles/modal/styles.module.css'

interface ModalProps {
  children?: ReactNode
  open?: boolean
}

const Modal: React.FC<ModalProps> = ({ children, open }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (open ?? false) {
      console.log(open)
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
    }
  }, [open])

  return (
    <dialog ref={dialogRef} className={styles.container}>
      {children}
    </dialog>
  )
}

export { Modal }
