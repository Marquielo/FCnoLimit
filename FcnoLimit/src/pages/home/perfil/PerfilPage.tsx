// CardJugador.tsx
import React from 'react';
import { IonIcon } from '@ionic/react';
import { footballOutline } from 'ionicons/icons';
import NavBar from '../../../components/NavBar';
import Footer from '../../../components/Footer';
import './PerfilPage.css';

interface CardJugadorProps {
  jugador: {
    id: number;
    nombre: string;
    apellido: string;
    equipo: string;
    numero: number;
    posicion: string;
    imagen_url?: string;
  };
  onClick?: () => void;
}

// Ejemplo de datos de jugador
const jugadorDemo = {
  id: 1,
  nombre: 'Jefferson Alexis',
  apellido: 'Castillo Marín',
  equipo: 'Guillermo Rivera',
  numero: 22,
  posicion: 'Mediocampo',
  imagen_url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=60'
};

const CardJugador: React.FC<CardJugadorProps> = ({ jugador, onClick }) => (
  <div className="card-jugador" onClick={onClick}>
    <div className="card-jugador-img-container">
      <img src={jugador.imagen_url} alt={jugador.nombre} className="card-jugador-img" />
      <span className="card-jugador-numero">{jugador.numero}</span>
    </div>
    <div className="card-jugador-info">
      <div className="card-jugador-nombre">{jugador.nombre} {jugador.apellido}</div>
      <div className="card-jugador-equipo">{jugador.equipo}</div>
      <div className="card-jugador-posicion">
        <IonIcon icon={footballOutline} /> {jugador.posicion}
      </div>
    </div>
  </div>
);

const PerfilPage: React.FC = () => (
  <div className="perfil-main-bg">
    <NavBar />
    <main className="perfil-main-content">
      <h2 className="perfil-section-title">Perfil del Jugador</h2>
      <CardJugador jugador={jugadorDemo} />
    </main>
    <Footer />
  </div>
);

export default PerfilPage;