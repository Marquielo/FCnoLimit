import React from 'react';
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/react';
import { calendarOutline, footballOutline } from 'ionicons/icons';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import './PartidosPage.css';

const partidosEjemplo = [
  { equipos: "Tigres FC vs Leones", fecha: "10/05/2024", hora: "18:00", lugar: "Estadio Central" },
  { equipos: "Águilas vs Lobos", fecha: "12/05/2024", hora: "20:00", lugar: "Cancha Norte" }
];

const PartidosPage: React.FC = () => (
  <IonPage>
    <NavBar />
    <IonContent fullscreen>
      <div className="hero-section partidos-hero">
        <div className="hero-content">
          <h1 className="main-title">Partidos</h1>
          <p className="hero-subtitle">Consulta los partidos programados y resultados</p>
          <IonButton color="secondary" size="large" routerLink="/crear-partido">
            Crear partido
          </IonButton>
        </div>
      </div>
      <div className="content-container">
        <section className="matches-section">
          <h2 className="section-title">Próximos Partidos</h2>
          <div className="matches-grid">
            {partidosEjemplo.map((p, idx) => (
              <div className="match-card" key={idx}>
                <IonIcon icon={calendarOutline} size="large" />
                <h3>{p.equipos}</h3>
                <p>Fecha: {p.fecha} - {p.hora}</p>
                <p>Lugar: {p.lugar}</p>
                <IonButton fill="outline" size="small">Ver detalles</IonButton>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </IonContent>
  </IonPage>
);

export default PartidosPage;
