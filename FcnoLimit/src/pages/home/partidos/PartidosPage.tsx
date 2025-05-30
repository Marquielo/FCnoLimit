import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonButton, IonIcon, IonSpinner } from '@ionic/react';
import { calendarOutline, locationOutline, arrowForward } from 'ionicons/icons';
import NavBar from '../../../components/NavBar';
import Footer from '../../../components/Footer';
import './PartidosPage.css';

const apiBaseUrl = 'https://fcnolimit-back.onrender.com';

interface PartidoVista {
  partido_id?: number;
  id?: number;
  equipo_local: string;
  equipo_visitante: string;
  goles_local?: number | null;
  goles_visitante?: number | null;
  fecha: string;
  estadio?: string;
  estado?: string;
  descripcion?: string;
  logo_local?: string;      // Si tienes logos en tu base de datos
  logo_visitante?: string;  // Si tienes logos en tu base de datos
}

const defaultLogo = '/assets/equipos/default.png'; // Cambia por tu ruta de logo por defecto

const PartidosPage: React.FC = () => {
  const [jugados, setJugados] = useState<PartidoVista[]>([]);
  const [pendientes, setPendientes] = useState<PartidoVista[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartidos = async () => {
      try {
        const [resJugados, resPendientes] = await Promise.all([
          fetch(`${apiBaseUrl}/api/partidos/jugados`, { cache: 'no-store' }),
          fetch(`${apiBaseUrl}/api/partidos/pendientes`, { cache: 'no-store' }),
        ]);
        if (!resJugados.ok || !resPendientes.ok) throw new Error('Error al cargar partidos');
        const dataJugados = await resJugados.json();
        const dataPendientes = await resPendientes.json();
        setJugados(Array.isArray(dataJugados) ? dataJugados : []);
        setPendientes(Array.isArray(dataPendientes) ? dataPendientes : []);
      } catch (err: any) {
        setError('No se pudieron cargar los partidos');
      } finally {
        setLoading(false);
      }
    };
    fetchPartidos();
  }, []);

  // Utilidad para formatear la fecha y hora
  const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    return `${date.toLocaleDateString()} • ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <IonPage>
      <NavBar />
      <IonContent fullscreen>
        <div className="content-container">
          <section className="matches-section">
            <h2 className="section-title">Próximos Partidos</h2>
            {loading ? (
              <IonSpinner name="crescent" />
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : pendientes.length === 0 ? (
              <p>No hay partidos pendientes.</p>
            ) : (
              <div className="matches-slider">
                {pendientes.map((p) => (
                  <div className="match-card" key={p.partido_id || p.id}>
                    <div className="match-card-header">
                      <div className="match-league">{p.descripcion || 'Partido Oficial'}</div>
                      <div className="match-date">{formatFecha(p.fecha)}</div>
                    </div>
                    <div className="match-teams">
                      <div className="team">
                        <div className="team-logo">
                          <img src={p.logo_local || defaultLogo} alt={p.equipo_local} />
                        </div>
                        <div className="team-name">{p.equipo_local}</div>
                      </div>
                      <div className="match-vs">
                        <div className="vs-badge">VS</div>
                      </div>
                      <div className="team">
                        <div className="team-logo">
                          <img src={p.logo_visitante || defaultLogo} alt={p.equipo_visitante} />
                        </div>
                        <div className="team-name">{p.equipo_visitante}</div>
                      </div>
                    </div>
                    <div className="match-info">
                      <div className="match-info-item">
                        <IonIcon icon={locationOutline} />
                        <span>{p.estadio || 'Por definir'}</span>
                      </div>
                      <IonButton className="match-details-btn" fill="clear" size="small" routerLink={`/partidos/${p.partido_id || p.id}`}>
                        Detalles <IonIcon icon={arrowForward} />
                      </IonButton>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="matches-section">
            <h2 className="section-title">Partidos Jugados</h2>
            {loading ? (
              <IonSpinner name="crescent" />
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : jugados.length === 0 ? (
              <p>No hay partidos jugados.</p>
            ) : (
              <div className="matches-slider">
                {jugados.map((p) => (
                  <div className="match-card" key={p.partido_id || p.id}>
                    <div className="match-card-header">
                      <div className="match-league">{p.descripcion || 'Partido Oficial'}</div>
                      <div className="match-date">{formatFecha(p.fecha)}</div>
                    </div>
                    <div className="match-teams">
                      <div className="team">
                        <div className="team-logo">
                          <img src={p.logo_local || defaultLogo} alt={p.equipo_local} />
                        </div>
                        <div className="team-name">{p.equipo_local}</div>
                      </div>
                      <div className="match-vs">
                        <div className="vs-badge">VS</div>
                      </div>
                      <div className="team">
                        <div className="team-logo">
                          <img src={p.logo_visitante || defaultLogo} alt={p.equipo_visitante} />
                        </div>
                        <div className="team-name">{p.equipo_visitante}</div>
                      </div>
                    </div>
                    <div className="match-info">
                      <div className="match-info-item">
                        <IonIcon icon={locationOutline} />
                        <span>{p.estadio || 'Por definir'}</span>
                      </div>
                      <div className="match-result">
                        <strong>
                          {typeof p.goles_local === 'number' && typeof p.goles_visitante === 'number'
                            ? `${p.goles_local} - ${p.goles_visitante}`
                            : 'Sin resultado'}
                        </strong>
                      </div>
                      <IonButton className="match-details-btn" fill="clear" size="small" routerLink={`/partidos/${p.partido_id || p.id}`}>
                        Detalles <IonIcon icon={arrowForward} />
                      </IonButton>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default PartidosPage;
