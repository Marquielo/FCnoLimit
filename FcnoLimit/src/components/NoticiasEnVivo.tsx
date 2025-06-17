import React, { useEffect, useState } from 'react';
import { IonContent, IonRefresher, IonRefresherContent, IonSpinner, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonBadge, IonButton } from '@ionic/react';
import { footballOutline, timeOutline, calendarOutline, trophyOutline, locationOutline, peopleOutline, listOutline } from 'ionicons/icons';
import { getLiveEvents } from '../services/apiFootball';
import './NoticiasEnVivo.css';

interface Event {
  time: { elapsed: number };
  team: { name: string };
  player: { 
    name: string;
    photo?: string;
  };
  assist?: {
    name: string;
    photo?: string;
  };
  type: string;
  detail: string;
  comments: string | null;
}

const NoticiasEnVivo: React.FC = () => {
  const [noticias, setNoticias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarCantidad, setMostrarCantidad] = useState(10); // Mostrar 10 inicialmente

  const fetchNoticias = async () => {
    setLoading(true);
    const data = await getLiveEvents();
    setNoticias(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchNoticias();
  }, []);

  const handleRefresh = (event: CustomEvent) => {
    fetchNoticias().then(() => {
      event.detail.complete();
    });
  };

  const cargarMas = () => {
    setMostrarCantidad(prev => prev + 10);
  };

  const noticiasParaMostrar = noticias.slice(0, mostrarCantidad);  return (
    <div>
      <div style={{background: 'yellow', color: 'black', padding: 20, fontWeight: 'bold', fontSize: 22, textAlign: 'center', zIndex: 9999}}>
        DEBUG: El componente NoticiasEnVivo se está renderizando
      </div>
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent />
      </IonRefresher>
      <div className="noticias-en-vivo-container">
        <div className="noticias-header">
          <h2 className="noticias-title">Partidos de Hoy (debug)</h2>
          <div className="noticias-contador">
            Total: {noticias.length} partidos encontrados
          </div>
        </div>
        {/* DEBUG: Si no hay noticias, muestra una card de ejemplo */}
        {(!loading && noticias.length === 0) && (
          <div style={{marginBottom: '2rem'}}>
            <IonCard className="partido-card-ionic">
              <IonCardHeader>
                <IonBadge color="primary">Ejemplo Liga</IonBadge>
                <IonCardTitle>Equipo A <span style={{color:'#888'}}>vs</span> Equipo B</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div>Este es un ejemplo de card. Si ves esto, el componente sí se está renderizando.</div>
              </IonCardContent>
            </IonCard>
          </div>
        )}
        
        {loading ? (
          <div className="loading-container">
            <IonSpinner className="loading-spinner" />
            <p>Cargando eventos deportivos...</p>
          </div>
        ) : noticias.length === 0 ? (
          <div className="sin-eventos">
            <p>No hay eventos programados para hoy.</p>
          </div>        ) : (
          <>
            <div className="partidos-grid">
              {noticiasParaMostrar.map((fixture) => (
                <IonCard key={fixture.fixtureId} className="partido-card-ionic">
                  <IonCardHeader>
                    <div className="card-header-content">
                      <IonBadge color="primary" className="liga-badge">
                        <IonIcon icon={trophyOutline} />
                        {fixture.league}
                      </IonBadge>
                      <IonBadge 
                        color={fixture.status.short === 'FT' ? 'success' : fixture.status.short === 'LIVE' ? 'danger' : 'medium'} 
                        className="estado-badge"
                      >
                        {fixture.status.short}
                      </IonBadge>
                    </div>
                      <IonCardTitle className="equipos-vs">
                      <div className="equipo-info">
                        <img 
                          src={fixture.teams.home.logo} 
                          alt={`Logo ${fixture.teams.home.name}`}
                          className="equipo-logo"
                        />
                        <span className="equipo-nombre">{fixture.teams.home.name}</span>
                      </div>
                      
                      <div className="vs-container">
                        {fixture.goals.home !== null && fixture.goals.away !== null ? (
                          <div className="resultado-container">
                            <span className="resultado">{fixture.goals.home} - {fixture.goals.away}</span>
                            <span className="vs-text">{fixture.status.short}</span>
                          </div>
                        ) : (
                          <>
                            <IonIcon icon={footballOutline} className="vs-icon" />
                            <span className="vs-text">VS</span>
                          </>
                        )}
                      </div>
                      
                      <div className="equipo-info">
                        <img 
                          src={fixture.teams.away.logo} 
                          alt={`Logo ${fixture.teams.away.name}`}
                          className="equipo-logo"
                        />
                        <span className="equipo-nombre">{fixture.teams.away.name}</span>
                      </div>
                    </IonCardTitle>
                  </IonCardHeader>

                  <IonCardContent>
                    <div className="partido-detalles">
                      <div className="detalle-item">
                        <IonIcon icon={calendarOutline} className="detalle-icon" />
                        <span className="detalle-texto">
                          {new Date(fixture.date).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                        <div className="detalle-item">
                        <IonIcon icon={timeOutline} className="detalle-icon" />
                        <span className="detalle-texto">{fixture.status.long}</span>
                      </div>
                      
                      <div className="detalle-item">
                        <IonIcon icon={locationOutline} className="detalle-icon" />
                        <span className="detalle-texto">{fixture.venue.name}, {fixture.venue.city}</span>
                      </div>
                      
                      {fixture.goals.home !== null && fixture.goals.away !== null && (
                        <div className="detalle-item">
                          <IonIcon icon={footballOutline} className="detalle-icon" />
                          <span className="detalle-texto">
                            Resultado Final: {fixture.goals.home} - {fixture.goals.away}
                          </span>
                        </div>
                      )}
                      
                      {fixture.score.halftime.home !== null && fixture.score.halftime.away !== null && (
                        <div className="detalle-item">
                          <IonIcon icon={timeOutline} className="detalle-icon" />
                          <span className="detalle-texto">
                            Entretiempo: {fixture.score.halftime.home} - {fixture.score.halftime.away}
                          </span>
                        </div>
                      )}
                    </div>

                    {fixture.events && fixture.events.length > 0 ? (
                      <div className="eventos-card-section">
                        <div className="eventos-header">
                          <IonIcon icon={listOutline} />
                          <span>Eventos destacados</span>
                          <IonBadge color="secondary">{fixture.events.length}</IonBadge>
                        </div>
                          <div className="eventos-preview">
                          {fixture.events.slice(0, 3).map((event: Event, idx: number) => (
                            <div key={idx} className="evento-preview-item">
                              <div className="evento-tiempo-small">{event.time.elapsed}'</div>
                              
                              <div className="evento-info-small">
                                <div className="evento-header">
                                  <span className="evento-tipo">{event.type}</span>
                                  <span className="evento-equipo-small">{event.team.name}</span>
                                </div>
                                  {event.player?.name && (
                                  <div className="jugador-info">
                                    {event.player.photo ? (
                                      <img 
                                        src={event.player.photo} 
                                        alt={event.player.name}
                                        className="jugador-foto"
                                        onError={(e) => {
                                          console.log('Error cargando foto de jugador:', event.player.photo);
                                          // Mostrar un placeholder si la imagen no carga
                                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/35x35/3498db/ffffff?text=' + event.player.name.charAt(0);
                                        }}
                                      />
                                    ) : (
                                      <div className="jugador-foto-placeholder">
                                        {event.player.name.charAt(0)}
                                      </div>
                                    )}
                                    <div className="jugador-detalles">
                                      <span className="evento-jugador">{event.player.name}</span>
                                      {event.detail && (
                                        <span className="evento-detalle">{event.detail}</span>
                                      )}
                                    </div>
                                  </div>
                                )}
                                
                                {event.assist?.name && (
                                  <div className="asistencia-info">
                                    <span className="asistencia-label">Asistencia:</span>
                                    <span className="asistencia-jugador">{event.assist.name}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                          
                          {fixture.events.length > 3 && (
                            <div className="mas-eventos">
                              +{fixture.events.length - 3} eventos más
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="sin-eventos-card">
                        <IonIcon icon={timeOutline} />
                        <span>Sin eventos registrados</span>
                      </div>
                    )}

                    <IonButton 
                      fill="clear" 
                      size="small" 
                      className="ver-detalles-btn"
                      onClick={() => console.log('Ver detalles del partido', fixture.fixtureId)}
                    >
                      Ver detalles completos
                      <IonIcon icon={listOutline} slot="end" />
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              ))}
            </div>
            
            {mostrarCantidad < noticias.length && (
              <div className="cargar-mas-container">
                <IonButton 
                  expand="block" 
                  fill="solid" 
                  color="primary"
                  onClick={cargarMas}                  className="cargar-mas-btn-ionic"
                >
                  <IonIcon icon={peopleOutline} slot="start" />
                  Cargar más partidos ({mostrarCantidad} de {noticias.length})
                </IonButton>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NoticiasEnVivo;
