import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { IonPage, IonContent, IonSpinner } from '@ionic/react';
import NavBar from '../../../components/NavBar';
import Footer from '../../../components/Footer';
import { RenderMatchCard } from '../../../components/RenderMatchCard';
import { startGlobalParticlesEffect } from '../../../effects/globalParticlesEffect';
import './EquipoPartidosPage.css';
import './EquiposPage.css';

const apiBaseUrl = 'https://fcnolimit-back.onrender.com';

const EquipoPartidosPage: React.FC = () => {
  const { id: idParam } = useParams<{ id: string }>();
  const history = useHistory();
  const [partidos, setPartidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [equipo, setEquipo] = useState<any>(null);

  const equipoId = idParam || localStorage.getItem('equipoId') || '';

  useEffect(() => {
    setLoading(true);
    setError(null);
    // Traer datos del equipo
    fetch(`${apiBaseUrl}/api/equipos/${equipoId}`)
      .then(res => res.ok ? res.json() : Promise.reject('Error al cargar equipo'))
      .then(data => setEquipo(data))
      .catch(() => setEquipo(null));
    // Traer partidos
    const endpoint = `/api/partidos/pendientes/equipo/${equipoId}`;
    fetch(`${apiBaseUrl}${endpoint}`)
      .then(res => res.ok ? res.json() : Promise.reject('Error al cargar partidos'))
      .then(data => {
        setPartidos(data);
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudieron cargar los partidos');
        setLoading(false);
      });
  }, [equipoId]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      const pos = `${x * 100}% ${y * 100}%`;
      document.body.style.setProperty('background-position', pos, 'important');
      const ionPages = document.querySelectorAll('ion-page, .IonPage');
      ionPages.forEach(page => {
        (page as HTMLElement).style.setProperty('background-position', pos, 'important');
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Efecto de partículas animadas en el fondo
  useEffect(() => {
    const stopParticles = startGlobalParticlesEffect();
    return () => {
      if (typeof stopParticles === 'function') stopParticles();
    };
  }, []);

  return (
    <IonPage>
      <NavBar />
      <IonContent fullscreen>
        <div className="equipos-content" style={{ maxWidth: 'none', margin: 0, width: '100%', minHeight: '100vh', padding: 0 }}>
          {/* Banner superior igual que EquiposPage */}
          {equipo && (
            <div className="equipo-banner-dark">
              <div className="equipo-banner-inner">
                <img
                  src={
                    equipo.imagen_url
                      ? (equipo.imagen_url.startsWith('http')
                          ? equipo.imagen_url
                          : equipo.imagen_url.startsWith('/equipos/')
                            ? `${apiBaseUrl}${equipo.imagen_url}`
                            : `${apiBaseUrl}/equipos/${equipo.imagen_url.replace(/^\/+/,'')}`)
                      : '/assets/equipos/default.png'
                  }
                  alt={equipo.nombre}
                  className="equipo-banner-logo"
                />
                <div className="equipo-banner-title">{equipo.nombre}</div>
                <button className="equipo-banner-follow">★ Seguir</button>
              </div>
            </div>
          )}
          {/* Tabs navegación */}
          <div className="equipo-tabs">
            <button
              className="equipo-tab"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', fontWeight: 600 }}
              onClick={() => {
                if (equipoId) localStorage.setItem('equipoId', equipoId.toString());
                history.push(`/equipos/${equipoId}`);
              }}
            >
              Resumen
            </button>
            <div className="equipo-tab active">Partidos</div>
            <button
              className="equipo-tab"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', fontWeight: 600 }}
              onClick={() => {
                if (equipoId) localStorage.setItem('equipoId', equipoId.toString());
                history.push(`/equipos/${equipoId}/resultados`);
              }}
            >
              Resultados
            </button>
          </div>
          <div style={{ padding: '24px 12px 48px 12px', maxWidth: '900px', margin: '0 auto' }}>
            <h2 className="equipo-section-title fcnolimit-title" style={{ marginTop: 32, marginBottom: 24, textAlign: 'center', letterSpacing: 1 }}>
              Próximos partidos del equipo
            </h2>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 500 }}>
              <IonSpinner name="crescent" />
            </div>
          ) : error ? (
            <div className="equipos-error">{error}</div>
          ) : partidos.length === 0 ? (
            <div style={{ color: '#bbb', textAlign: 'center', padding: 24, fontSize: '1.1rem' }}>
              No hay partidos pendientes.
            </div>
          ) : (
            <div className="matches-slider">
              {partidos.map((p: any) => (
                <RenderMatchCard
                  key={p.partido_id || p.id}
                  partido={{
                    ...p,
                    logo_local: p.imagen_url_local,
                    logo_visitante: p.imagen_url_visitante
                  }}
                  isJugado={false}
                />
              ))}
            </div>            )}
            <div className="footer-separator"></div>
          </div>
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default EquipoPartidosPage;
