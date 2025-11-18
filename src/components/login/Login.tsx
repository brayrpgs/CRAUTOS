import { useState, useEffect } from 'react'
import Logo from '../logo/Logo'
import GoogleIcon from '../../icons/GoogleIcon'
import { EyeOffIcon } from '../../icons/EyeOffIcon'
import { EyeIcon } from '../../icons/EyeIcon'
import styles from '../../styles/login/styles.module.css'

export type LoginMode = 'signIn' | 'signUp'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const nameRegex = /^[A-Za-zÁ-Úá-úñÑ ]+$/

const LoginComponent: React.FC = () => {
  const [resolvedMode, setResolvedMode] = useState<LoginMode>('signIn')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
  }, [])

  const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSignUpData(prev => ({ ...prev, [name]: value }))
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSignUpSubmit = () => {
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
      console.log('Registro exitoso:', signUpData)
      // Aquí iría la llamada al backend
    }
  }

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        <Logo />

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
                <input type="email" placeholder="Correo electrónico" />
              </div>
            </div>

            <div className={styles.formInput}>
              <div className={styles.inputWrapper}>
                <input type={showPassword ? 'text' : 'password'} placeholder="Contraseña" />
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

        <button className={styles.googleBtn}>
          <GoogleIcon />
          Continúa con Google
        </button>
      </div>
    </div>
  )
}

export default LoginComponent