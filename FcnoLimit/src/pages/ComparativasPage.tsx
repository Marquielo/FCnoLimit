import React from 'react';
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/react';
import { statsChartOutline, peopleOutline, footballOutline } from 'ionicons/icons';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import './ComparativaPage.css';

const ComparativasPage: React.FC = () => (
  <IonPage>
    <NavBar />
    <IonContent fullscreen>
      <div className="hero-section comparativas-hero">
        <div className="hero-content">
          <h1 className="main-title">Comparativas</h1>
          <p className="hero-subtitle">Analiza y compara el rendimiento de equipos y jugadores</p>
          <IonButton color="secondary" size="large" routerLink="/estadisticas">
            Ver estadísticas generales
          </IonButton>
        </div>
      </div>
      <div className="content-container">
        <section className="compare-section">
          <h2 className="section-title">Comparativa de Equipos</h2>
          <div className="compare-grid">
            <div className="compare-card">
              <IonIcon icon={footballOutline} size="large" />
              <h3>Tigres FC</h3>
              <p>Puntos: 32</p>
              <p>Goles: 25</p>
            </div>
            <div className="compare-card">
              <IonIcon icon={footballOutline} size="large" />
              <h3>Leones</h3>
              <p>Puntos: 28</p>
              <p>Goles: 22</p>
            </div>
          </div>
        </section>
        <section className="compare-section">
          <h2 className="section-title">Comparativa de Jugadores</h2>
          <div className="compare-grid">
            <div className="compare-card">
              <IonIcon icon={peopleOutline} size="large" />
              <h3>Juan Pérez</h3>
              <p>Goles: 10</p>
              <p>Asistencias: 5</p>
            </div>
            <div className="compare-card">
              <IonIcon icon={peopleOutline} size="large" />
              <h3>Luis Gómez</h3>
              <p>Goles: 8</p>
              <p>Asistencias: 7</p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </IonContent>
  </IonPage>
);

export default ComparativasPage;