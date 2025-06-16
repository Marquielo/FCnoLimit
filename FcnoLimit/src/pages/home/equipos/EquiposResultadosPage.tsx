import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IonPage, IonContent, IonSpinner } from '@ionic/react';
import NavBar from '../../../components/NavBar';
import Footer from '../../../components/Footer';
import { RenderMatchCard } from '../../../components/RenderMatchCard';
import './EquiposResultadosPage.css';

const apiBaseUrl = 'https://fcnolimit-back.onrender.com';

const EquiposResultadosPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const equipoId = id || localStorage.getItem('equipoId') || '';
  const [partidos, setPartidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    // Traer todos los partidos jugados por el equipo
    fetch(`${apiBaseUrl}/api/partidos/jugados`)
      .then(res => res.ok ? res.json() : Promise.reject('Error al cargar resultados'))
      .then(data => {
        // Filtrar por el equipo
        const filtered = Array.isArray(data)
          ? data.filter((p: any) => p.equipo_local_id == equipoId || p.equipo_visitante_id == equipoId)
          : [];
        setPartidos(filtered);
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudieron cargar los resultados');
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
            Resultados del equipo
          </h2>
          {loading ? (
            <IonSpinner name="crescent" />
          ) : error ? (
            <div className="equipos-error">{error}</div>
          ) : partidos.length === 0 ? (
            <div style={{ color: '#bbb', textAlign: 'center', padding: 12 }}>
              No hay partidos jugados.
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
                  <RenderMatchCard key={p.partido_id || p.id} partido={partidoConImagenes} isJugado={true} />
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

export default EquiposResultadosPage;
