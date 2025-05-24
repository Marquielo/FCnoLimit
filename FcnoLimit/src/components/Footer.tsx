import React from 'react';
import { IonIcon, IonButton } from '@ionic/react';
import { 
  logoFacebook, 
  logoInstagram, 
  logoTwitter, 
  logoYoutube,
  locationOutline,
  callOutline,
  mailOutline,
  timeOutline,
  arrowForwardOutline,
  sendOutline
} from 'ionicons/icons';
import './Footer.css';

const Footer: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para manejar la suscripción
  };

  return (
    <footer className="club-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>FCnoLimit</h3>
          <p>Tu club de fútbol amateur donde la pasión no tiene límites. Únete a nuestra comunidad y vive la emoción del deporte rey con nosotros.</p>
          <div className="social-links">
            <a href="#" className="social-link" aria-label="Facebook">
              <IonIcon icon={logoFacebook} />
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <IonIcon icon={logoInstagram} />
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <IonIcon icon={logoTwitter} />
            </a>
            <a href="#" className="social-link" aria-label="YouTube">
              <IonIcon icon={logoYoutube} />
            </a>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Enlaces Rápidos</h4>
          <ul>
            <li><a href="#">Inicio</a></li>
            <li><a href="#">Torneos</a></li>
            <li><a href="#">Equipos</a></li>
            <li><a href="#">Eventos</a></li>
            <li><a href="#">Noticias</a></li>
            <li><a href="#">Galería</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contacto</h4>
          <ul className="contact-info">
            <li>
              <IonIcon icon={locationOutline} />
              <span>Complejo Deportivo FCnoLimit, Av. Principal #123</span>
            </li>
            <li>
              <IonIcon icon={callOutline} />
              <span>+34 123 456 789</span>
            </li>
            <li>
              <IonIcon icon={mailOutline} />
              <span>info@fcnolimit.com</span>
            </li>
            <li>
              <IonIcon icon={timeOutline} />
              <span>Lun-Vie: 9:00 - 18:00</span>
            </li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Newsletter</h4>
          <p>Suscríbete para recibir las últimas noticias, eventos y actualizaciones de nuestros torneos.</p>
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input 
              type="email" 
              placeholder="Tu correo electrónico" 
              aria-label="Correo electrónico para newsletter" 
              required 
            />
            <button type="submit">
              Suscribirse <IonIcon icon={sendOutline} />
            </button>
          </form>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} FCnoLimit. Todos los derechos reservados. | Diseñado con <span style={{ color: '#e25555' }}>♥</span> para amantes del fútbol</p>
      </div>
    </footer>
  );
};

export default Footer;