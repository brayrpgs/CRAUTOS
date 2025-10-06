import type React from 'react'
import '../../styles/header/styles.css'

interface HeaderProps {
  children: React.ReactNode
}

const HeaderPage: React.FC<HeaderProps> = ({ children }: HeaderProps) => {
  return (
    <header>
      {children}
    </header>
  )
}

export { HeaderPage }
