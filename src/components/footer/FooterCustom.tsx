import React from 'react'
import EmailIcon from '../../icons/EmailIcon'
import FacebookIcon from '../../icons/FacebookIcon'
import InstagramIcon from '../../icons/InstagramIcon'
import TelephoneIcon from '../../icons/TelephoneIcon'
import TiktokIcon from '../../icons/TiktokIcon'
import '../../styles/footer/styles.css'
import Logo from '../logo/Logo'

const Footer: React.FC = () => {
  return (
    <footer className='footer'>
      <div className='footer-container'>

        <div className='footer-brand'>
          <>
            <Logo />
            <p className='footer-description'>
              Tu plataforma confiable para comprar y vender vehículos.
            </p>
          </>

          <div className='footer-copy'>
            <p>© 2025 CRAUTOS. Todos los derechos reservados.</p>
            <p className='small'>Plataforma autorizada para la compra y venta de vehículos</p>
          </div>
        </div>

        <div className='footer-contact'>
          <h3>CONTACTO</h3>
          <div className='contact-items'>
            <div className='contact-item'>
              <TelephoneIcon />
              <span>+506 83150283</span>
            </div>
            <div className='contact-item'>
              <EmailIcon />
              <span>crautosuna2025@gmail.com</span>
            </div>
          </div>
        </div>

        <div className='footer-social'>
          <h3>SÍGUENOS EN</h3>
          <div className='social-buttons'>
            <button
              type='button'
              className='social-btn'
              onClick={() => window.open('https://facebook.com/CRAUTOS_UNA_2025', '_blank')}
            >
              <FacebookIcon />
              Síguenos en Facebook
            </button>

            <button
              type='button'
              className='social-btn'
              onClick={() => window.open('https://instagram.com/CRAUTOS_UNA_2025', '_blank')}
            >
              <InstagramIcon />
              Síguenos en Instagram
            </button>

            <button
              type='button'
              className='social-btn'
              onClick={() => window.open('https://tiktok.com/@CRAUTOS_UNA_2025', '_blank')}
            >
              <TiktokIcon />
              Síguenos en TikTok
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
