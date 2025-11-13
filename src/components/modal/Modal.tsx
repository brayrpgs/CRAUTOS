import { useEffect, useRef, type ReactNode } from 'react'
import styles from '../../styles/modal/styles.module.css'

interface ModalProps {
  children?: ReactNode
  open?: boolean
  id?: string
}

const Modal: React.FC<ModalProps> = ({ children, open, id }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    dialogRef.current?.setAttribute('closedby', 'any')
    if (open ?? false) {
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
    }
  }, [open])

  return (
    <dialog ref={dialogRef} className={styles.container} id={id}>
      <button className={styles['close-btn']} title='close' onClick={() => { dialogRef.current?.close() }} />
      {children}
    </dialog>
  )
}

export { Modal }
