import React from 'react';
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/react';
import { personCircleOutline } from 'ionicons/icons';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import './JugadoresPage.css';

const jugadoresEjemplo = [
  { nombre: "Juan Pérez", posicion: "Delantero", goles: 12, foto: "/assets/jugadores/juan.png" },
  { nombre: "Carlos Ruiz", posicion: "Portero", goles: 0, foto: "/assets/jugadores/carlos.png" },
  { nombre: "Luis Gómez", posicion: "Defensa", goles: 2, foto: "/assets/jugadores/luis.png" }
];

const JugadoresPage: React.FC = () => (
  <IonPage>
    <NavBar />
    <IonContent fullscreen>
      <div className="hero-section jugadores-hero">
        <div className="hero-content">
          <h1 className="main-title">Jugadores</h1>
          <p className="hero-subtitle">Conoce a los jugadores destacados de la liga</p>
          <IonButton color="secondary" size="large" routerLink="/registrar-jugador">
            Registrar jugador
          </IonButton>
        </div>
      </div>
      <div className="content-container">
        <section className="players-section">
          <h2 className="section-title">Listado de Jugadores</h2>
          <div className="players-grid">
            {jugadoresEjemplo.map((jug, idx) => (
              <div className="player-card" key={idx}>
                <img src={jug.foto} alt={jug.nombre} className="player-photo"/>
                <h3>{jug.nombre}</h3>
                <p>Posición: {jug.posicion}</p>
                <p>Goles: {jug.goles}</p>
                <IonButton fill="outline" size="small">Ver perfil</IonButton>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </IonContent>
  </IonPage>
);

export default JugadoresPage;