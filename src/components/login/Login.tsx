import { useState, useEffect } from 'react'
import Logo from '../logo/Logo'
import GoogleIcon from '../../icons/GoogleIcon'
import { EyeOffIcon } from '../../icons/EyeOffIcon'
import { EyeIcon } from '../../icons/EyeIcon'
import styles from '../../styles/login/styles.module.css'
import { BASE_AUTH_URL, LOGIN_URL, USERS_URL } from '../../common/common'
import { getLoggedUser } from '../../utils/GetUserUtils'
import type { user } from '../../models/user'

export type LoginMode = 'signIn' | 'signUp'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const nameRegex = /^[A-Za-zÁ-Úá-úñÑ ]+$/

const LoginComponent: React.FC = () => {
  const [resolvedMode, setResolvedMode] = useState<LoginMode>('signIn')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [authError, setAuthError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const [signUpData, setSignUpData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const actionParam = params.get('action')
    if (actionParam === 'signIn' || actionParam === 'signUp') {
      setResolvedMode(actionParam)
    }

    // Verificar si hay un error en la URL
    const errorParam = params.get('error')
    if (errorParam) {
      const errorMessages: Record<string, string> = {
        auth_failed: 'Falló la autenticación con Google',
        user_not_found: 'No se pudo encontrar o crear el usuario',
        database_error: 'Error en la base de datos',
        server_error: 'Error en el servidor',
        unknown_error: 'Error desconocido'
      }
      setAuthError(errorMessages[errorParam] || 'Error desconocido')
    }
  }, [])

  const fetchUserData = async (idUser: number) => {
    const response = await fetch(`${USERS_URL}?id_user=eq.${idUser}&select=*`)
    const data = await response.json()
    return data[0] as user
  }

  const hasIncompleteProfile = (user: user) => {
    return (
      !user.name ||
      !user.last_name ||
      !user.phone ||
      !user.idcard ||
      !user.age ||
      user.age === 0
    )
  }


  const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSignUpData(prev => ({ ...prev, [name]: value }))

    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSignUpSubmit = async () => {
    const err = { fullName: '', email: '', password: '', confirmPassword: '' }

    if (resolvedMode === 'signUp') {
      if (!nameRegex.test(signUpData.fullName)) {
        err.fullName = 'El nombre solo debe contener letras'
      }
      if (!emailRegex.test(signUpData.email)) {
        err.email = 'Correo electrónico no válido'
      }
      if (signUpData.password.length < 6) {
        err.password = 'La contraseña debe tener al menos 6 caracteres'
      }
      if (signUpData.confirmPassword && signUpData.password !== signUpData.confirmPassword) {
        err.confirmPassword = 'Las contraseñas no coinciden'
      }
    }

    setErrors(err)
    const hasErrors = Object.values(err).some(Boolean)
    if (!hasErrors && resolvedMode === 'signUp') {

    }
  }

  const loginWithGoogle = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const width = 500
      const height = 700
      const left = window.screen.width / 2 - width / 2
      const top = window.screen.height / 2 - height / 2

      const popup = window.open(
        LOGIN_URL,
        'Google Login',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
      )

      if (!popup) {
        reject(new Error('No se pudo abrir la ventana. Verifica los bloqueadores de popup.'))
        return
      }

      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== BASE_AUTH_URL) return

        if (event.data.type === 'AUTH_SUCCESS' && event.data.token) {
          window.removeEventListener('message', handleMessage)
          popup.close()
          resolve(event.data.token)
        } else if (event.data.type === 'AUTH_ERROR') {
          window.removeEventListener('message', handleMessage)
          popup.close()
          reject(new Error(event.data.error))
        }
      }

      window.addEventListener('message', handleMessage)

      const checkPopupClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopupClosed)
          window.removeEventListener('message', handleMessage)
          reject(new Error('Ventana cerrada por el usuario'))
        }
      }, 500)

      setTimeout(() => {
        clearInterval(checkPopupClosed)
        window.removeEventListener('message', handleMessage)
        if (!popup.closed) {
          popup.close()
        }
        reject(new Error('Tiempo de espera agotado'))
      }, 60000)
    })
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setAuthError('')

    try {
      const token = await loginWithGoogle()
      localStorage.setItem('User_Token', token)

      // validar hacia donde redirigir
      const loggedUser = getLoggedUser()
      if (!loggedUser) throw new Error('Error guardando token en localStorage')
      const allLoggedUserData = await fetchUserData(loggedUser.id_user)
      hasIncompleteProfile(allLoggedUserData) ? window.location.href = '/profile?perfilIncompleto=true' : window.location.href = '/panel'
    } catch (error) {
      console.error('Error en autenticación:', error)

      // Mostrar error en la interfaz
      if (error instanceof Error) {
        const errorMessages: Record<string, string> = {
          auth_failed: 'Falló la autenticación con Google',
          user_not_found: 'No se pudo encontrar o crear el usuario',
          database_error: 'Error en la base de datos',
          server_error: 'Error en el servidor',
          unknown_error: 'Error desconocido'
        }
        setAuthError(errorMessages[error.message] || error.message)
      } else {
        setAuthError('Error desconocido al iniciar sesión')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        <Logo />

        {authError && (
          <div className={styles.errorBanner}>
            {authError}
          </div>
        )}

        <div className={styles.loginModeSwitcher}>
          <div
            className={`${styles.switchSlider} ${resolvedMode === 'signUp' ? styles.sliderSignUp : styles.sliderSignIn}`}
          />
          <button
            type="button"
            className={`${styles.switchBtn} ${resolvedMode === 'signIn' ? styles.switchBtnActive : ''}`}
            onClick={() => setResolvedMode('signIn')}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            className={`${styles.switchBtn} ${resolvedMode === 'signUp' ? styles.switchBtnActive : ''}`}
            onClick={() => setResolvedMode('signUp')}
          >
            Registrarse
          </button>
        </div>

        <div className={styles.formsContainer}>
          <div className={`${styles.formPanel} ${resolvedMode === 'signIn' ? styles.formVisible : styles.formHidden}`}>
            <div className={styles.formInput}>
              <div className={styles.inputWrapper}>
                <input id='em' name='em' type="email" placeholder="Correo electrónico" autoComplete='off' />
              </div>
            </div>

            <div className={styles.formInput}>
              <div className={styles.inputWrapper}>
                <input id='pa' name='pa' type={showPassword ? 'text' : 'password'} placeholder="Contraseña" />
                <span className={styles.eyeToggle} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </span>
              </div>
            </div>

            <button className={styles.submitBtn}>Iniciar sesión</button>
          </div>

          <div className={`${styles.formPanel} ${resolvedMode === 'signUp' ? styles.formVisible : styles.formHidden}`}>
            <div className={styles.formInput}>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Nombre completo"
                  value={signUpData.fullName}
                  onChange={handleSignUpChange}
                />
              </div>
              {errors.fullName && <span className={styles.errorText}>{errors.fullName}</span>}
            </div>

            <div className={styles.formInput}>
              <div className={styles.inputWrapper}>
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  value={signUpData.email}
                  onChange={handleSignUpChange}
                />
              </div>
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>

            <div className={styles.formInput}>
              <div className={styles.inputWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Contraseña"
                  value={signUpData.password}
                  onChange={handleSignUpChange}
                />
                <span className={styles.eyeToggle} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </span>
              </div>
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>

            <div className={styles.formInput}>
              <div className={styles.inputWrapper}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirmar contraseña"
                  value={signUpData.confirmPassword}
                  onChange={handleSignUpChange}
                />
                <span className={styles.eyeToggle} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </span>
              </div>
              {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
            </div>

            <button className={styles.submitBtn} onClick={handleSignUpSubmit}>
              Registrarse
            </button>
          </div>
        </div>

        <div className={styles.divider}>o continúa con</div>

        <button
          className={styles.googleBtn}
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <GoogleIcon />
          {isLoading ? 'Autenticando...' : 'Continúa con Google'}
        </button>
      </div>
    </div>
  )
}

export default LoginComponent