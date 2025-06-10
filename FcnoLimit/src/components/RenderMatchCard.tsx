import React from 'react';
import { IonIcon, IonButton } from '@ionic/react';
import { locationOutline, arrowForward } from 'ionicons/icons';
import { PartidoVista } from '../hooks/usePartidos';
import { formatFecha } from '../utils/formatFecha';

const apiBaseUrl = 'https://fcnolimit-back.onrender.com';
const defaultLogo = '/assets/equipos/default.png';

interface RenderMatchCardProps {
  partido: PartidoVista;
  isJugado: boolean;
}

export const RenderMatchCard: React.FC<RenderMatchCardProps> = ({ partido: p, isJugado }) => (
  <div className="match-card" key={p.partido_id || p.id}>
    <div className="match-card-header">
      <div className="match-league">{p.descripcion || (isJugado ? 'Partido Jugado' : 'Partido Oficial')}</div>
      <div className="match-date">{formatFecha(p.fecha)}</div>
    </div>
    <div className="match-teams">
      <div className="team">
        <div className="team-logo">
          <img
            src={p.logo_local ? `${apiBaseUrl}${p.logo_local}` : defaultLogo}
            alt={p.equipo_local || 'Logo Local'}
          />
        </div>
        <div className="team-name">
          {p.equipo_local || "Equipo Local"}
        </div>
      </div>
      <div className="match-vs">
        <div className="vs-badge">VS</div>
      </div>
      <div className="team">
        <div className="team-logo">
          <img
            src={p.logo_visitante ? `${apiBaseUrl}${p.logo_visitante}` : defaultLogo}
            alt={p.equipo_visitante || 'Logo Visitante'}
          />
        </div>
        <div className="team-name">
          {p.equipo_visitante || "Equipo Visitante"}
        </div>
      </div>
    </div>
    {isJugado && (
      <div className="match-score-prominent">
        <strong>
          {typeof p.goles_local === 'number' && typeof p.goles_visitante === 'number'
            ? `${p.goles_local} - ${p.goles_visitante}`
            : 'S/R'}
        </strong>
      </div>
    )}
    <div className="match-info">
      <div className="match-info-item stadium">
        <IonIcon icon={locationOutline} />
        <span>{p.estadio || 'Por definir'}</span>
      </div>
      <IonButton className="match-details-btn" fill="clear" size="small" routerLink={`/partidos/${p.partido_id || p.id}`}>
        Detalles <IonIcon icon={arrowForward} />
      </IonButton>
    </div>
  </div>
);
