import React from 'react';
import { IonCard, IonCardContent, IonIcon } from '@ionic/react';
import { medalOutline } from 'ionicons/icons';
import { PartidoVista } from '../hooks/usePartidos';
import { formatFecha } from '../utils/formatFecha';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import './RenderMatchCard.css';

const apiBaseUrl = 'https://fcnolimit-back.onrender.com';
const defaultLogo = '/assets/equipos/default.png';

interface RenderMatchCardProps {
  partido: PartidoVista & { division_nombre?: string; division?: string };
  isJugado: boolean;
}

export const RenderMatchCard: React.FC<RenderMatchCardProps> = ({ partido: p, isJugado }) => (
  <IonCard className="match-card" key={p.partido_id || p.id}>
    <IonCardContent>
      <div className="match-card-content">
        <div className="match-card-header-date">
          {p.fecha ? format(new Date(p.fecha), "EEEE d 'de' MMMM HH:mm", { locale: es }) : ''}
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
        <div className="match-info-item stadium">
          <IonIcon icon={medalOutline} className="icon" />
          <span>{p.division_nombre || p.division || 'División genérica'}</span>
        </div>
      </div>
    </IonCardContent>
  </IonCard>
);

