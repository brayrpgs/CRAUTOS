import type React from "react"
import "./HeaderPage.css";

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