import type React from 'react'
import { useState, useEffect, useRef } from 'react'
import styles from '../../styles/header/styles.module.css'
import Logo from '../logo/Logo';

const HeaderPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [, forceUpdate] = useState({})
  const panelRef = useRef<HTMLDivElement>(null)

  /* TODO: MEJORAR PARA DETECTAR DE MEJOR MANERA (DINAMICAMENTE) */
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1000)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  /* TODO: MEJORAR PARA DETECTAR EN CUALQUIER TIPO DE CASO Y SIN TANTA VUELTA */
  useEffect(() => {
    const update = () => forceUpdate({})
    
    window.addEventListener('popstate', update)
    document.addEventListener('astro:page-load', update)
    
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')
      if (link && link.href) {
        setTimeout(update, 100)
      }
    }
    
    document.addEventListener('click', handleClick, true)
    
    const interval = setInterval(update, 200)
    
    return () => {
      window.removeEventListener('popstate', update)
      document.removeEventListener('astro:page-load', update)
      document.removeEventListener('click', handleClick, true)
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen && panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const isActive = (path: string): boolean => {
    if (typeof window === 'undefined') return false
    
    let currentPath = window.location.pathname
    if (currentPath === '/index' || currentPath === '/index.html') {
      currentPath = '/'
    }
    currentPath = currentPath.replace(/\/$/, '') || '/'
    
    let normalizedPath = path.replace(/\/$/, '') || '/'
    
    return currentPath === normalizedPath
  }

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (isActive(path)) {
      e.preventDefault()
    } else {
      setIsMobileMenuOpen(false)
    }
  }

  const navItems = (
    <>
      <a 
        href="/" 
        className={`${styles.navLink} ${isActive('/') ? styles.navLinkActive : ''}`}
        onClick={(e) => handleLinkClick(e, '/')}
      >
        Inicio
      </a>
      <a 
        href="/contact" 
        className={`${styles.navLink} ${isActive('/contact') ? styles.navLinkActive : ''}`}
        onClick={(e) => handleLinkClick(e, '/contact')}
      >
        Contáctenos
      </a>
      <a 
        href="/home" 
        className={`${styles.navLink} ${isActive('/home') ? styles.navLinkActive : ''}`}
        onClick={(e) => handleLinkClick(e, '/home')}
      >
        Ver autos
      </a>
      <div className={styles.authButtons}>
        <button className={styles.carouselButton}>Iniciar sesión</button>
        <button className={styles.carouselButton}>Registrarse</button>
      </div>
    </>
  )

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <Logo />

          <nav className={styles.desktopNav}>
            {navItems}
          </nav>

          <button
            className={styles.mobileMenuToggle}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Abrir menú"
          >
            {isMobile && '☰'}
          </button>
        </div>
      </header>

      {isMobileMenuOpen && isMobile && (
        <div className={styles.sidePanelOverlay}>
          <div
            className={styles.overlayBackdrop}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className={styles.sidePanel} ref={panelRef}>
            <Logo />
            <nav className={styles.mobileNav}>
              {navItems}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export { HeaderPage };