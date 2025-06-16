import React, { useRef } from 'react';
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

export const RenderMatchCard: React.FC<RenderMatchCardProps> = ({ partido: p, isJugado }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  let completeTimeout: NodeJS.Timeout | null = null;
  let progressInterval: NodeJS.Timeout | null = null;

  // Efecto: destello dorado que sigue el mouse + borde dorado progresivo
  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    // Destello dorado que sigue el mouse
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--glow-x', `${x}px`);
    card.style.setProperty('--glow-y', `${y}px`);
    // Si el borde no está completo, aumentar progresivamente
    if (!progressInterval) {
      let progress = parseFloat(card.style.getPropertyValue('--border-progress') || '0');
      progressInterval = setInterval(() => {
        progress = Math.min(progress + 0.04, 1);
        card.style.setProperty('--border-progress', progress.toString());
        if (progress >= 1 && progressInterval) {
          clearInterval(progressInterval);
          progressInterval = null;
        }
      }, 24);
    }
    if (completeTimeout) clearTimeout(completeTimeout);
    completeTimeout = setTimeout(() => {
      card.style.setProperty('--border-progress', '1');
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }
    }, 1200);
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.removeProperty('--glow-x');
    card.style.removeProperty('--glow-y');
    card.style.setProperty('--border-progress', '0');
    if (completeTimeout) clearTimeout(completeTimeout);
    if (progressInterval) clearInterval(progressInterval);
    progressInterval = null;
  };

  return (
    <IonCard
      className="match-card"
      key={p.partido_id || p.id}
      ref={cardRef as any}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
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
};

