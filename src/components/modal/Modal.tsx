interface ModalProps {
  head?: React.ReactNode[]
  body?: React.ReactNode[]
  footer?: React.ReactNode[]
  onClose?: () => {}
}

const Modal: React.FC<ModalProps> = (Modal: ModalProps) => (
  <>
    <dialog open>
      <div>
        {Modal.head?.map(async (k, i) => (
          await k
        ))}
      </div>
      <div>
        {Modal.body?.map(async (k, i) => (
          await k
        ))}
      </div>
      <div>
        {Modal.footer?.map(async (k, i) => (
          await k
        ))}
      </div>
    </dialog>
  </>
)

export { Modal }
