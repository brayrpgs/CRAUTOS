import type React from "react"
import "../../styles/header/styles.css";

interface HeaderProps {
    children: React.ReactNode
}

const HeaderPage = ({ children }: HeaderProps) => {
    return <>
        <header>
            {children}
        </header>
    </>
}

export { HeaderPage }