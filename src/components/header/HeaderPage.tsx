import type React from 'react'
import { useState, useEffect, useRef } from 'react'
import styles from '../../styles/header/styles.module.css'
import Logo from '../logo/Logo'
import { isUserLogged, getLoggedUser } from '../../utils/GetUserUtils'
import { USERS_URL } from '../../common/common'
import type { user } from '../../models/user'

const HeaderPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [, forceUpdate] = useState({})
  const panelRef = useRef<HTMLDivElement>(null)

  const [hydrated, setHydrated] = useState(false)

  const [userData, setUserData] = useState<user | null>(null)
  const [image, setImage] = useState<string>()
  const [avatarOpen, setAvatarOpen] = useState(false)
  const avatarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setHydrated(true)

    if (isUserLogged()) {
      const loggedUser = getLoggedUser()
      if (!loggedUser) return

      const cacheKey = `userData_${loggedUser.id_user}`
      const cachedData = localStorage.getItem(cacheKey)
      const cacheTime = localStorage.getItem(`${cacheKey}_time`)

      const now = Date.now()
      const CACHE_DURATION = 60 * 60 * 1000 // 1 hora en ms

      if (cachedData && cacheTime && (now - parseInt(cacheTime)) < CACHE_DURATION) {
        // Usar cache
        const data = JSON.parse(cachedData) as user
        setUserData(data)
        setImage(data?.images?.image)
        return
      }

      // Si no hay cache válido, fetch y guardar
      fetchUserData(loggedUser.id_user, cacheKey)
    }
  }, [])

  const fetchUserData = async (idUser: number, cacheKey: string): Promise<void> => {
    try {
      const response = await fetch(`${USERS_URL}?id_user=eq.${idUser}&select=*,images(*)`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Range-Unit': 'items'
        }
      })
      const data = await response.json() as user[]
      const user = data[0]
      setUserData(user)
      setImage(user?.images?.image)

      localStorage.setItem(cacheKey, JSON.stringify(user))
      localStorage.setItem(`${cacheKey}_time`, Date.now().toString())
    } catch (error) {
      console.error('Error fetching user data:', error)
      localStorage.removeItem(cacheKey)
      localStorage.removeItem(`${cacheKey}_time`)
    }
  }

  /* Detectar mobile dinámicamente */
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1000)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  /* Forzar actualización de navegación */
  useEffect(() => {
    const update = (): void => forceUpdate({})

    window.addEventListener('popstate', update)
    document.addEventListener('astro:page-load', update)

    const handleClick = (e: MouseEvent): void => {
      const target = e.target as HTMLElement
      const link = target.closest('a')
      if ((link != null) && link.href) {
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

  /* Cerrar menú móvil al hacer click fuera */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (isMobileMenuOpen && (panelRef.current != null) && !panelRef.current.contains(event.target as Node)) {
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (avatarOpen && avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [avatarOpen])

  /* ===============================
        NAV ACTIVE (sin mismatch)
     =============================== */
  const isActive = (path: string): boolean => {
    if (!hydrated) return false // 💥 FIX: evita hydration mismatch

    let currentPath = window.location.pathname

    if (currentPath === '/index' || currentPath === '/index.html') {
      currentPath = '/'
    }

    currentPath = currentPath.replace(/\/$/, '') || '/'
    const normalizedPath = path.replace(/\/$/, '') || '/'

    return currentPath === normalizedPath
  }

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string): void => {
    if (isActive(path)) {
      e.preventDefault()
    } else {
      setIsMobileMenuOpen(false)
    }
  }

  /* =============================
    LOGOUT
  ============================= */
  const handleLogout = (): void => {
    localStorage.removeItem('User_Token')
    if (userData) {
      const cacheKey = `userData_${userData.id_user}`
      localStorage.removeItem(cacheKey)
      localStorage.removeItem(`${cacheKey}_time`)
    }
    setUserData(null)
    window.location.href = '/'
  }

  /* =============================
    AVATAR DROPDOWN
  ============================= */
  const avatarMenu = (
    <div className={styles.avatarContainer} ref={avatarRef}>
      <img
        src={image ?? 'avatar.png'}
        alt="avatar"
        className={styles.avatarImg}
        onClick={() => setAvatarOpen(!avatarOpen)}
      />

      {avatarOpen && (
        <div className={styles.avatarDropdown}>
          <a href="/panel">Panel</a>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      )}
    </div>
  )

  /* =============================
      NAV ITEMS
  ============================= */
  const navItems = (
    <>
      <a
        href='/'
        className={`${styles.navLink} ${isActive('/') ? styles.navLinkActive : ''}`}
        onClick={(e) => handleLinkClick(e, '/')}
      >
        Inicio
      </a>

      <a
        href='/contact'
        className={`${styles.navLink} ${isActive('/contact') ? styles.navLinkActive : ''}`}
        onClick={(e) => handleLinkClick(e, '/contact')}
      >
        Contáctenos
      </a>

      <a
        href='/home'
        className={`${styles.navLink} ${isActive('/home') ? styles.navLinkActive : ''}`}
        onClick={(e) => handleLinkClick(e, '/home')}
      >
        Ver autos
      </a>

      <div className={styles.authButtons}>
        {!userData ? (
          <>
            <a className={styles.carouselButton} href="/login?action=signIn">Iniciar sesión</a>
            <a className={styles.carouselButton} href="/login?action=signUp">Registrarse</a>
          </>
        ) : (
          avatarMenu
        )}
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
            aria-label='Abrir menú'
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
  )
}

export { HeaderPage }
