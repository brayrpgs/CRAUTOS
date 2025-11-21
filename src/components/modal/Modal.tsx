import { useEffect, useRef, type ReactNode } from 'react'
import styles from '../../styles/modal/styles.module.css'

interface ModalProps {
  children?: ReactNode
  open?: boolean
  id?: string
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

const Modal: React.FC<ModalProps> = ({ children, open, id, setOpen }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    dialogRef.current?.setAttribute('closedby', 'any')
    if (open ?? false) {
      dialogRef.current?.showModal()
    } else if (setOpen !== undefined) {
      setOpen(false)
      dialogRef.current?.close()
    } else {
      dialogRef.current?.close()
    }
  }, [open, dialogRef.current?.open])

  return (
    <dialog
      ref={dialogRef} className={styles.container} id={id}
      onClose={(e) => {
        setOpen?.(false)
      }}
    >
      <button
        className={styles['close-btn']}
        title='close'
        onClick={() => {
          dialogRef.current?.close()
          if (setOpen !== undefined) {
            setOpen(false)
          } else {
            console.log('set is undefined')
          }
        }}
      />
      {children}
    </dialog>
  )
}

export { Modal }
