import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonChip
} from '@ionic/react';
import { trophy, star, diamond, ribbon } from 'ionicons/icons';
import PlayerCard, { PlayerCardData } from '../components/PlayerCard/PlayerCard';
import './PlayerCardsDemo.css';

// 🧸 Datos mock de niños futbolistas
const mockPlayers: PlayerCardData[] = [
  {
    id: 1,
    nombre: "Mateo",
    apellido: "González",
    edad: 8,
    posicion: "Delantero",
    numero: 10,
    stats: {
      velocidad: 85,
      tiro: 78,
      pase: 72,
      defensa: 45,
      overall: 70
    },
    rarity: "gold",
    equipo: "Los Tigres FC"
  },
  {
    id: 2,
    nombre: "Sofia",
    apellido: "Martínez",
    edad: 9,
    posicion: "Mediocampo",
    numero: 8,
    stats: {
      velocidad: 70,
      tiro: 65,
      pase: 88,
      defensa: 75,
      overall: 74
    },
    rarity: "gold",
    equipo: "Las Águilas"
  },
  {
    id: 3,
    nombre: "Lucas",
    apellido: "Rodríguez",
    edad: 7,
    posicion: "Portero",
    numero: 1,
    stats: {
      velocidad: 55,
      tiro: 30,
      pase: 70,
      defensa: 92,
      overall: 62
    },
    rarity: "silver",
    equipo: "Los Leones"
  },
  {
    id: 4,
    nombre: "Isabella",
    apellido: "López",
    edad: 10,
    posicion: "Defensa",
    numero: 4,
    stats: {
      velocidad: 68,
      tiro: 40,
      pase: 80,
      defensa: 90,
      overall: 69
    },
    rarity: "diamond",
    equipo: "Las Panteras"
  },
  {
    id: 5,
    nombre: "Diego",
    apellido: "Hernández",
    edad: 8,
    posicion: "Lateral",
    numero: 2,
    stats: {
      velocidad: 82,
      tiro: 55,
      pase: 75,
      defensa: 70,
      overall: 70
    },
    rarity: "bronze",
    equipo: "Los Zorros"
  },
  {
    id: 6,
    nombre: "Valentina",
    apellido: "Castro",
    edad: 9,
    posicion: "Delantero",
    numero: 11,
    stats: {
      velocidad: 88,
      tiro: 85,
      pase: 70,
      defensa: 40,
      overall: 71
    },
    rarity: "gold",
    equipo: "Las Estrellas"
  }
];

const PlayerCardsDemo: React.FC = () => {
  
  const handleCardClick = (player: PlayerCardData) => {
    alert(`¡Seleccionaste a ${player.nombre} ${player.apellido}!\nOverall: ${player.stats.overall}\nEquipo: ${player.equipo}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>⚽ FC noLimit - Cards de Jugadores</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen className="player-cards-demo">
        {/* Header Section */}
        <IonCard className="demo-header-card">
          <IonCardHeader>
            <IonCardTitle className="demo-title">
              🎮 Cartas FIFA para Niños 🎮
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonLabel>¡Descubre las cartas de nuestros pequeños campeones!</IonLabel>
          </IonCardContent>
        </IonCard>
        
        {/* Cards Grid */}
        <IonGrid className="cards-container">
          <IonRow>
            {mockPlayers.map((player) => (
              <IonCol key={player.id} size="12" sizeMd="6" sizeLg="4" sizeXl="3">
                <PlayerCard
                  player={player}
                  animated={true}
                  onClick={handleCardClick}
                />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        {/* Rarity Info Card */}
        <IonCard className="demo-info-card">
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={star} color="warning" /> Tipos de Rareza
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol size="6" sizeMd="3">
                  <IonChip color="medium">
                    <IonIcon icon={ribbon} />
                    <IonLabel>🥉 BRONCE</IonLabel>
                  </IonChip>
                </IonCol>
                <IonCol size="6" sizeMd="3">
                  <IonChip color="light">
                    <IonIcon icon={star} />
                    <IonLabel>🥈 PLATA</IonLabel>
                  </IonChip>
                </IonCol>
                <IonCol size="6" sizeMd="3">
                  <IonChip color="warning">
                    <IonIcon icon={trophy} />
                    <IonLabel>🥇 ORO</IonLabel>
                  </IonChip>
                </IonCol>
                <IonCol size="6" sizeMd="3">
                  <IonChip color="tertiary">
                    <IonIcon icon={diamond} />
                    <IonLabel>💎 DIAMANTE</IonLabel>
                  </IonChip>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default PlayerCardsDemo;
