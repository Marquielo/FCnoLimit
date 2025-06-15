import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { IonPage, IonContent, IonSpinner } from '@ionic/react';
import NavBar from '../../../components/NavBar';
import Footer from '../../../components/Footer';
import { RenderMatchCard } from '../../../components/RenderMatchCard';

const apiBaseUrl = 'https://fcnolimit-back.onrender.com';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const EquipoPartidosPage: React.FC = () => {
  const { id: idParam } = useParams<{ id: string }>();
  const location = useLocation();
  const query = useQuery();
  const [partidos, setPartidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const equipoId = idParam || localStorage.getItem('equipoId') || '';

  useEffect(() => {
    setLoading(true);
    setError(null);
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

  const normalizaUrl = (img: string | null | undefined) => {
    if (!img) return '/assets/equipos/default.png';
    return img.startsWith('http') ? img : `${apiBaseUrl}/equipos/${img}`;
  };

  return (
    <IonPage>
      <NavBar />
      <IonContent fullscreen>
        <div className="equipos-content">
          <h2 style={{marginTop: 24, marginBottom: 16, color: '#ff9800'}}>
            Próximos partidos del equipo
          </h2>
          {loading ? (
            <IonSpinner name="crescent" />
          ) : error ? (
            <div className="equipos-error">{error}</div>
          ) : partidos.length === 0 ? (
            <div style={{ color: '#bbb', textAlign: 'center', padding: 12 }}>
              No hay partidos pendientes.
            </div>
          ) : (
            <div className="matches-slider">
              {partidos.map((p: any) => {
                const partidoConImagenes = {
                  ...p,
                  logo_local: normalizaUrl(p.imagen_url_local),
                  logo_visitante: normalizaUrl(p.imagen_url_visitante),
                };
                return (
                  <RenderMatchCard key={p.partido_id || p.id} partido={partidoConImagenes} isJugado={false} />
                );
              })}
            </div>
          )}
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default EquipoPartidosPage;
