import type { ReactNode } from 'react'

interface ModalFooterProps {
  children?: ReactNode
}

const ModalFooter: React.FC<ModalFooterProps> = ({ children }: ModalFooterProps) => {
  return (
    <div className=''>
      {children}
    </div>
  )
}
export { ModalFooter }
