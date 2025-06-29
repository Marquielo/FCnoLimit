import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonAvatar,
  IonBadge,
  IonChip,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonIcon
} from '@ionic/react';
import { trophy, flash, football, shield } from 'ionicons/icons';
import './PlayerCard.css';

export interface PlayerCardData {
  id: number;
  nombre: string;
  apellido: string;
  edad: number;
  posicion: string;
  numero: number;
  foto?: string;
  stats: {
    velocidad: number;    // 1-99
    tiro: number;        // 1-99
    pase: number;        // 1-99
    defensa: number;     // 1-99
    overall: number;     // Promedio calculado
  };
  rarity: 'bronze' | 'silver' | 'gold' | 'diamond';
  equipo: string;
}

interface PlayerCardProps {
  player: PlayerCardData;
  animated?: boolean;
  onClick?: (player: PlayerCardData) => void;
}

// Extend CSSProperties to include CSS custom properties
interface CustomCSSProperties extends React.CSSProperties {
  '--rarity-color'?: string;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ 
  player, 
  animated = true, 
  onClick 
}) => {
  
  const handleCardClick = () => {
    if (onClick) {
      onClick(player);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'bronze': return '#CD7F32';
      case 'silver': return '#C0C0C0';
      case 'gold': return '#FFD700';
      case 'diamond': return '#B9F2FF';
      default: return '#CD7F32';
    }
  };

  const getPositionShort = (position: string) => {
    const positions: { [key: string]: string } = {
      'Portero': 'POR',
      'Defensa': 'DEF',
      'Mediocampo': 'MED',
      'Delantero': 'DEL',
      'Lateral': 'LAT'
    };
    return positions[position] || position.substring(0, 3).toUpperCase();  };

  return (
    <IonCard 
      className={`player-card ${player.rarity} ${animated ? 'animated' : ''}`}
      onClick={handleCardClick}
      style={{
        '--rarity-color': getRarityColor(player.rarity)
      } as CustomCSSProperties}
    >      {/* Header con overall y posición */}
      <IonCardHeader className="card-header">
        <div className="overall-rating">
          <span className="overall-number">{player.stats.overall}</span>
          <span className="position">{getPositionShort(player.posicion)}</span>
        </div>
        <IonBadge className="rarity-badge" color={player.rarity === 'gold' ? 'warning' : player.rarity === 'diamond' ? 'light' : 'medium'}>
          {player.rarity.toUpperCase()}
        </IonBadge>
      </IonCardHeader>

      <IonCardContent>
        {/* Foto del jugador */}
        <div className="player-photo">
          <IonAvatar className="player-avatar">
            {player.foto ? (
              <img 
                src={player.foto} 
                alt={`${player.nombre} ${player.apellido}`}
              />
            ) : (
              <div className="placeholder-photo">
                <span className="player-initials">
                  {player.nombre.charAt(0)}{player.apellido.charAt(0)}
                </span>
              </div>
            )}
          </IonAvatar>
          <IonChip className="player-number" color="primary">
            <IonLabel>#{player.numero}</IonLabel>
          </IonChip>
        </div>

        {/* Información del jugador */}
        <div className="player-info">
          <IonCardTitle className="player-name">
            {player.nombre}
          </IonCardTitle>
          <IonCardSubtitle className="player-lastname">
            {player.apellido}
          </IonCardSubtitle>
          <IonLabel className="player-team">{player.equipo}</IonLabel>
          <IonLabel className="player-age">Edad: {player.edad}</IonLabel>
        </div>

        {/* Stats con iconos */}
        <IonGrid className="player-stats">
          <IonRow>
            <IonCol size="6">
              <IonItem lines="none" className="stat-item">
                <IonIcon icon={flash} slot="start" color="warning" />
                <IonLabel>
                  <h3>VEL</h3>
                  <p>{player.stats.velocidad}</p>
                </IonLabel>
              </IonItem>
            </IonCol>
            <IonCol size="6">
              <IonItem lines="none" className="stat-item">
                <IonIcon icon={football} slot="start" color="danger" />
                <IonLabel>
                  <h3>TIR</h3>
                  <p>{player.stats.tiro}</p>
                </IonLabel>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="6">
              <IonItem lines="none" className="stat-item">
                <IonIcon icon={trophy} slot="start" color="success" />
                <IonLabel>
                  <h3>PAS</h3>
                  <p>{player.stats.pase}</p>
                </IonLabel>
              </IonItem>
            </IonCol>
            <IonCol size="6">
              <IonItem lines="none" className="stat-item">
                <IonIcon icon={shield} slot="start" color="primary" />
                <IonLabel>
                  <h3>DEF</h3>
                  <p>{player.stats.defensa}</p>
                </IonLabel>
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>

      {/* Shine effect */}
      {animated && <div className="card-shine"></div>}
    </IonCard>
  );
};

export default PlayerCard;
