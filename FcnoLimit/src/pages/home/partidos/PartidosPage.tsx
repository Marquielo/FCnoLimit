import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonButton, IonIcon, IonSpinner } from '@ionic/react';
import { calendarOutline, locationOutline, arrowForward } from 'ionicons/icons';
import NavBar from '../../../components/NavBar';
import Footer from '../../../components/Footer';
import './PartidosPage.css';

const apiBaseUrl = 'https://fcnolimit-back.onrender.com';

interface PartidoVista {
  partido_id?: number;
  id?: number; // Usado como fallback para key si partido_id no está
  equipo_local: string;
  equipo_visitante: string;
  goles_local?: number | null;
  goles_visitante?: number | null;
  fecha: string;
  estadio?: string;
  estado?: string;
  descripcion?: string;
  logo_local?: string | null;
  logo_visitante?: string | null;
}

const defaultLogo = '/assets/equipos/default.png';

const PartidosPage: React.FC = () => {
  const [jugados, setJugados] = useState<PartidoVista[]>([]);
  const [pendientes, setPendientes] = useState<PartidoVista[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartidos = async () => {
      setLoading(true);
      setError(null);
      try {
        const [resJugados, resPendientes] = await Promise.all([
          fetch(`${apiBaseUrl}/api/partidos/jugados`, { cache: 'no-store' }),
          fetch(`${apiBaseUrl}/api/partidos/pendientes`, { cache: 'no-store' }),
        ]);

        if (!resJugados.ok) {
          throw new Error(`Error al cargar partidos jugados: ${resJugados.statusText}`);
        }
        if (!resPendientes.ok) {
          throw new Error(`Error al cargar partidos pendientes: ${resPendientes.statusText}`);
        }

        const dataJugados = await resJugados.json();
        const dataPendientes = await resPendientes.json();

        setJugados(Array.isArray(dataJugados) ? dataJugados : []);
        setPendientes(Array.isArray(dataPendientes) ? dataPendientes : []);
      } catch (err: any) {
        setError(err.message || 'No se pudieron cargar los partidos');
        setJugados([]); // Limpiar en caso de error
        setPendientes([]); // Limpiar en caso de error
      } finally {
        setLoading(false);
      }
    };
    fetchPartidos();
  }, []);

  const formatFecha = (fecha: string) => {
    try {
      const date = new Date(fecha);
      if (isNaN(date.getTime())) {
        return 'Fecha inválida';
      }
      return `${date.toLocaleDateString()} • ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch (e) {
      return 'Fecha inválida';
    }
  };

  const renderMatchCard = (p: PartidoVista, isJugado: boolean) => (
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
            {p.equipo_local || "Equipo Local"} {/* Texto de fallback por si acaso */}
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
            {p.equipo_visitante || "Equipo Visitante"} {/* Texto de fallback */}
          </div>
        </div>
      </div>
      <div className="match-info">
        <div className="match-info-item stadium"> {/* Clase adicional para posible estilo específico */}
          <IonIcon icon={locationOutline} />
          <span>{p.estadio || 'Por definir'}</span>
        </div>
        {isJugado && (
          <div className="match-info-item result"> {/* Clase adicional */}
            <strong>
              {typeof p.goles_local === 'number' && typeof p.goles_visitante === 'number'
                ? `${p.goles_local} - ${p.goles_visitante}`
                : 'S/R'} {/* Más corto */}
            </strong>
          </div>
        )}
        {/* El botón de detalles ahora se manejará con flex para posicionarlo */}
        <IonButton className="match-details-btn" fill="clear" size="small" routerLink={`/partidos/${p.partido_id || p.id}`}>
          Detalles <IonIcon icon={arrowForward} />
        </IonButton>
      </div>
    </div>
  );

  return (
    <IonPage>
      <NavBar />
      <IonContent fullscreen>
        <div className="content-container">
          {/* SECCIÓN DE PARTIDOS PENDIENTES */}
          <section className="matches-section">
            <h2 className="section-title">Próximos Partidos</h2>
            {loading && <IonSpinner name="crescent" />}
            {!loading && error && <div className="error-message">{error}</div>}
            {!loading && !error && pendientes.length === 0 && <p>No hay partidos pendientes.</p>}
            {!loading && !error && pendientes.length > 0 && (
              <div className="matches-slider">
                {pendientes.map(p => renderMatchCard(p, false))}
              </div>
            )}
          </section>

          {/* SECCIÓN DE PARTIDOS JUGADOS */}
          <section className="matches-section">
            <h2 className="section-title">Partidos Jugados</h2>
            {loading && <IonSpinner name="crescent" />}
            {!loading && error && <div className="error-message">{error}</div>}
            {!loading && !error && jugados.length === 0 && <p>No hay partidos jugados.</p>}
            {!loading && !error && jugados.length > 0 && (
              <div className="matches-slider">
                {jugados.map(p => renderMatchCard(p, true))}
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
