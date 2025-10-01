import EmailIcon from "../../icons/footer/EmailIcon"
import FacebookIcon from "../../icons/footer/FacebookIcon"
import InstagramIcon from "../../icons/footer/InstagramIcon"
import TelephoneIcon from "../../icons/footer/TelephoneIcon"
import TiktokIcon from "../../icons/footer/TiktokIcon"
import "../../styles/footer/styles.css"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <div className="footer-logo">
            <span>CR</span>
          </div>
          <h2 className="footer-title">CRAUTOS</h2>
          <p className="footer-description">
            Tu plataforma confiable para comprar y vender vehículos. Conectamos compradores y vendedores de manera
            segura.
          </p>
        </div>

        <div className="footer-copy">
          <p>© 2025 CrAutos. Todos los derechos reservados.</p>
          <p className="small">Plataforma autorizada para la compra y venta de vehículos</p>
        </div>

        <div className="footer-contact">
          <h3>CONTACTO</h3>
          <div className="contact-items">
            <div className="contact-item">
              <TelephoneIcon />
              <span>+506 2222-3333</span>
            </div>
            <div className="contact-item">
              <EmailIcon />
              <span>info@crautos.com</span>
            </div>
          </div>
        </div>

        <div className="footer-social">
          <h3>SÍGUENOS EN</h3>
          <div className="social-buttons">
            <button className="social-btn">
              <FacebookIcon />
              Síguenos en Facebook
            </button>

            <button className="social-btn">
              <InstagramIcon />
              Síguenos en Instagram
            </button>

            <button className="social-btn">
              <TiktokIcon />
              Síguenos en TikTok
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
