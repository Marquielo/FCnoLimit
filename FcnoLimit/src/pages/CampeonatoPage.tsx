import React from 'react';
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/react';
import { trophyOutline } from 'ionicons/icons';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import './CampeonatoPage.css';

const CampeonatosPage: React.FC = () => {
  return (
    <IonPage>
      <NavBar />
      <IonContent fullscreen>
        <div className="hero-section campeonatos-hero">
          <div className="hero-content">
            <h1 className="main-title">Campeonatos</h1>
            <p className="hero-subtitle">Participa y sigue los campeonatos más importantes</p>
            <IonButton color="secondary" size="large" routerLink="/crear-campeonato">
              Crear campeonato
            </IonButton>
          </div>
        </div>

        <div className="content-container">
          <section className="championships-section">
            <h2 className="section-title">Listado de Campeonatos</h2>
            <div className="championships-grid">
              {/* Ejemplo de campeonato */}
              <div className="championship-card">
                <IonIcon icon={trophyOutline} size="large" />
                <h3>Nombre del Campeonato</h3>
                <p>Descripción breve del campeonato.</p>
                <IonButton fill="outline" size="small">Ver detalles</IonButton>
              </div>
              {/* ...otros campeonatos */}
            </div>
          </section>
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default CampeonatosPage;