import React from 'react';
import { IonIcon, IonButton } from '@ionic/react';
import { 
  logoFacebook, 
  logoInstagram, 
  logoTwitter, 
  logoYoutube,
  locationOutline,
  callOutline,
  mailOutline
} from 'ionicons/icons';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="club-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>FCnoLimit</h3>
          <p>Tu club de fútbol amateur favorito. Únete a nuestra comunidad y vive la pasión del fútbol.</p>
          <div className="social-links">
            <a href="#" className="social-link">
              <IonIcon icon={logoFacebook} />
            </a>
            <a href="#" className="social-link">
              <IonIcon icon={logoInstagram} />
            </a>
            <a href="#" className="social-link">
              <IonIcon icon={logoTwitter} />
            </a>
            <a href="#" className="social-link">
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
            <li><a href="#">Noticias</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contacto</h4>
          <ul className="contact-info">
            <li>
              <IonIcon icon={locationOutline} />
              <span>Ciudad Deportiva, #123</span>
            </li>
            <li>
              <IonIcon icon={callOutline} />
              <span>+123 456 7890</span>
            </li>
            <li>
              <IonIcon icon={mailOutline} />
              <span>info@fcnolimit.com</span>
            </li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Newsletter</h4>
          <p>Suscríbete para recibir las últimas noticias y actualizaciones.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Tu correo electrónico" />
            <IonButton color="secondary" size="small">
              Suscribirse
            </IonButton>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 FCnoLimit. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;