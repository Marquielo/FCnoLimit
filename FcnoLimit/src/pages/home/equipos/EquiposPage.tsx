import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonButton, IonIcon, IonSpinner } from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { peopleOutline, footballOutline, chevronForward, calendarOutline } from 'ionicons/icons';
import NavBar from '../../../components/NavBar';
import Footer from '../../../components/Footer';
import './EquiposPage.css';

const apiBaseUrl = 'https://fcnolimit-back.onrender.com';

interface Equipo {
  id: number;
  nombre: string;
  categoria?: string | null;
  liga_id?: number | null;
  imagen_url?: string | null;
  creado_en?: string | null;
  pais?: string | null;
  ciudad?: string | null;
  fundacion?: string | null;
  estadio_nombre?: string | null;
  capacidad_estadio?: number | null;
  valor_mercado_total?: number | null;
  jugadores_plantilla?: number | null;
  descripcion?: string | null;
  division?: string | null;
  logo?: string | null;
}

const EquiposPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const history = useHistory();
  const [equiposPorDivision, setEquiposPorDivision] = useState<{ [division: string]: Equipo[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [equipo, setEquipo] = useState<Equipo | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`${apiBaseUrl}/api/equipos/${id}`)
        .then(res => {
          if (!res.ok) throw new Error('No se pudo cargar el equipo');
          return res.json();
        })
        .then(data => {
          setEquipo(data);
          setLoading(false);
        })
        .catch(() => {
          setError('No se pudo cargar el equipo');
          setLoading(false);
        });
    } else {
      setEquipo(null);
      setLoading(true);
      fetch(`${apiBaseUrl}/api/divisiones/equipos`, { cache: 'no-store' })
        .then(res => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then((data: Equipo[]) => {
          const agrupados: { [division: string]: Equipo[] } = {};
          data.forEach(eq => {
            if (!agrupados[eq.division || 'Sin división']) agrupados[eq.division || 'Sin división'] = [];
            agrupados[eq.division || 'Sin división'].push(eq);
          });
          setEquiposPorDivision(agrupados);
          setLoading(false);
        })
        .catch(() => {
          setError('No se pudieron cargar los equipos');
          setLoading(false);
        });
    }
  }, [id]);

  return (
    <IonPage>
      <NavBar />
      <IonContent fullscreen>
        <div className="equipos-content">
          {loading ? (
            <div className="equipos-loading">
              <IonSpinner name="crescent" />
            </div>
          ) : error ? (
            <div className="equipos-error">{error}</div>
          ) : equipo ? (
            <div className="equipo-onefootball">
              {/* Banner superior */}
              <div className="equipo-banner-dark">
                <div className="equipo-banner-inner">
                  <img
                    src={
                      equipo.imagen_url
                        ? (equipo.imagen_url.startsWith('http') ? equipo.imagen_url : `${apiBaseUrl}${equipo.imagen_url}`)
                        : '/assets/equipos/default.png'
                    }
                    alt={equipo.nombre}
                    className="equipo-banner-logo"
                  />
                  <div className="equipo-banner-title">{equipo.nombre}</div>
                  <button className="equipo-banner-follow">★ Seguir</button>
                </div>
              </div>
              {/* Tabs navegación (solo visual) */}
              <div className="equipo-tabs">
                <div className="equipo-tab active">Resumen</div>
                <div className="equipo-tab">Noticias</div>
                <div className="equipo-tab">Partidos</div>
                <div className="equipo-tab">Resultados</div>
                <div className="equipo-tab">Plantilla</div>
                <div className="equipo-tab">Fichajes</div>
                <div className="equipo-tab">Oficial</div>
              </div>
              {/* Resultados y próximos partidos (simulado) */}
              <div className="equipo-main-row">
                <div className="equipo-main-col">
                  <div className="equipo-section-title">Último resultado</div>
                  <div className="equipo-result-card">
                    <div className="equipo-result-row">
                      <div className="equipo-result-team">
                        <img src="/assets/equipos/default.png" alt="FC Fulham" />
                        <span>FC Fulham</span>
                      </div>
                      <div className="equipo-result-score">0</div>
                      <div className="equipo-result-date">25/05/25</div>
                    </div>
                    <div className="equipo-result-row">
                      <div className="equipo-result-team">
                        <img
                          src={
                            equipo.imagen_url
                              ? (equipo.imagen_url.startsWith('http') ? equipo.imagen_url : `${apiBaseUrl}${equipo.imagen_url}`)
                              : '/assets/equipos/default.png'
                          }
                          alt={equipo.nombre}
                        />
                        <span>{equipo.nombre}</span>
                      </div>
                      <div className="equipo-result-score">2</div>
                      <div className="equipo-result-date">Fin del partido</div>
                    </div>
                    <div className="equipo-result-league">Premier League</div>
                  </div>
                  <div className="equipo-link-row">
                    <a href="#" className="equipo-link">Ver todos los resultados <IonIcon icon={chevronForward} /></a>
                  </div>
                </div>
                <div className="equipo-main-col">
                  <div className="equipo-section-title">Siguiente partido</div>
                  <div className="equipo-result-card">
                    <div className="equipo-result-row">
                      <div className="equipo-result-team">
                        <img
                          src={
                            equipo.imagen_url
                              ? (equipo.imagen_url.startsWith('http') ? equipo.imagen_url : `${apiBaseUrl}${equipo.imagen_url}`)
                              : '/assets/equipos/default.png'
                          }
                          alt={equipo.nombre}
                        />
                        <span>{equipo.nombre}</span>
                      </div>
                      <div className="equipo-result-date">18/06/25</div>
                    </div>
                    <div className="equipo-result-row">
                      <div className="equipo-result-team">
                        <img src="/assets/equipos/default.png" alt="Wydad AC" />
                        <span>Wydad AC</span>
                      </div>
                      <div className="equipo-result-date">13:00</div>
                    </div>
                    <div className="equipo-result-league">Copa Mundial de Clubes de la FIFA</div>
                  </div>
                  <div className="equipo-link-row">
                    <a href="#" className="equipo-link">Ver todos los partidos <IonIcon icon={chevronForward} /></a>
                  </div>
                </div>
                <div className="equipo-main-col equipo-videos">
                  <div className="equipo-section-title">VIDEOS</div>
                  <div className="equipo-video-card">
                    <div className="equipo-video-circle">
                      <span className="equipo-video-logo">1.</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Info adicional */}
              <div className="equipo-info-extra">
                <div className="equipo-info-row">
                  <div><strong>País:</strong> {equipo.pais || 'Sin dato'}</div>
                  <div><strong>Ciudad:</strong> {equipo.ciudad || 'Sin dato'}</div>
                  <div><strong>Estadio:</strong> {equipo.estadio_nombre || 'Sin dato'}</div>
                  <div><strong>Capacidad estadio:</strong> {equipo.capacidad_estadio ?? 'Sin dato'}</div>
                  <div><strong>Fundación:</strong> {equipo.fundacion ? new Date(equipo.fundacion).toLocaleDateString() : 'Sin dato'}</div>
                  <div><strong>Valor mercado total:</strong> {equipo.valor_mercado_total ?? 'Sin dato'}</div>
                  <div><strong>Jugadores plantilla:</strong> {equipo.jugadores_plantilla ?? 'Sin dato'}</div>
                  <div><strong>Descripción:</strong> {equipo.descripcion || 'Sin descripción'}</div>
                  {equipo.division && <div><strong>División:</strong> {equipo.division}</div>}
                  {equipo.categoria && <div><strong>Categoría:</strong> {equipo.categoria}</div>}
                  {equipo.liga_id && <div><strong>Liga ID:</strong> {equipo.liga_id}</div>}
                  <div><strong>Creado en:</strong> {equipo.creado_en ? new Date(equipo.creado_en).toLocaleString() : 'Sin dato'}</div>
                </div>
              </div>
            </div>
          ) : (
            // Vista listado por divisiones
            <>
              <div className="hero-section equipos-hero">
                <div className="hero-content">
                  <h1 className="main-title">Divisiones</h1>
                  <p className="hero-subtitle">Descubre las divisiones y sus equipos en FCnoLimit</p>
                  <IonButton color="secondary" size="large" routerLink="/registrar-equipo">
                    Registrar nuevo equipo
                  </IonButton>
                </div>
              </div>
              <div className="equipos-listado">
                {Object.keys(equiposPorDivision).map(division => (
                  <div key={division} className="division-section">
                    <h2>{division}</h2>
                    <div className="equipos-grid">
                      {equiposPorDivision[division].map(eq => (
                        <IonButton
                          key={eq.id}
                          className="equipo-card"
                          onClick={() => history.push(`/equipos/${eq.id}`)}
                          fill="outline"
                        >
                          <img
                            src={
                              eq.imagen_url
                                ? (eq.imagen_url.startsWith('http') ? eq.imagen_url : `${apiBaseUrl}${eq.imagen_url}`)
                                : '/assets/equipos/default.png'
                            }
                            alt={eq.nombre}
                            className="equipo-logo"
                            style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', marginRight: 12, border: '1.5px solid #ff9800', background: '#fafafa' }}
                          />
                          <span>{eq.nombre}</span>
                        </IonButton>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="footer-separator"></div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default EquiposPage;