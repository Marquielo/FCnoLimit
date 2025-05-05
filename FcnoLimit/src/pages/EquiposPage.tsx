import React from 'react';
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/react';
import { peopleOutline, footballOutline } from 'ionicons/icons';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import './EquiposPage.css';

const equiposEjemplo = [
  { nombre: "Tigres FC", descripcion: "Equipo juvenil con gran trayectoria.", logo: "/assets/equipos/tigres.png" },
  { nombre: "Leones", descripcion: "Fuerza y garra en cada partido.", logo: "/assets/equipos/leones.png" },
  { nombre: "Águilas", descripcion: "Velocidad y precisión.", logo: "/assets/equipos/aguilas.png" }
];

const EquiposPage: React.FC = () => {
  return (
    <IonPage>
      <NavBar />
      <IonContent fullscreen>
        <div className="hero-section equipos-hero">
          <div className="hero-content">
            <h1 className="main-title">Nuestros Equipos</h1>
            <p className="hero-subtitle">Descubre todos los equipos registrados en FCnoLimit</p>
            <IonButton color="secondary" size="large" routerLink="/registrar-equipo">
              Registrar nuevo equipo
            </IonButton>
          </div>
        </div>
        <div className="content-container">
          <section className="teams-section">
            <h2 className="section-title">Listado de Equipos</h2>
            <div className="teams-grid">
              {equiposEjemplo.map((eq, idx) => (
                <div className="team-card" key={idx}>
                  <img src={eq.logo} alt={eq.nombre} className="team-logo"/>
                  <h3>{eq.nombre}</h3>
                  <p>{eq.descripcion}</p>
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
};

export default EquiposPage;