import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonButton, IonIcon, IonSpinner } from '@ionic/react';
import { calendarOutline } from 'ionicons/icons';
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
}

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

  return (
    <IonPage>
      <NavBar />
      <IonContent fullscreen>
        <div className="hero-section partidos-hero">
          <div className="hero-content">
            <h1 className="main-title">Partidos</h1>
            <p className="hero-subtitle">Consulta los partidos programados y resultados</p>
            <IonButton color="secondary" size="large" routerLink="/crear-partido">
              Crear partido
            </IonButton>
          </div>
        </div>
        <div className="content-container">
          <section className="matches-section">
            <h2 className="section-title">Partidos Pendientes</h2>
            {loading ? (
              <IonSpinner name="crescent" />
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : pendientes.length === 0 ? (
              <p>No hay partidos pendientes.</p>
            ) : (
              <div className="matches-grid">
                {pendientes.map((p) => (
                  <div className="match-card" key={p.partido_id || p.id}>
                    <IonIcon icon={calendarOutline} size="large" />
                    <h3>
                      Local: {p.equipo_local} vs Visitante: {p.equipo_visitante}
                    </h3>
                    <p>Fecha: {new Date(p.fecha).toLocaleString()}</p>
                    {p.estadio && <p>Estadio: {p.estadio}</p>}
                    {p.descripcion && <p>Descripción: {p.descripcion}</p>}
                    <IonButton fill="outline" size="small">Ver detalles</IonButton>
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
              <div className="matches-grid">
                {jugados.map((p) => (
                  <div className="match-card" key={p.partido_id || p.id}>
                    <IonIcon icon={calendarOutline} size="large" />
                    <h3>
                      Local: {p.equipo_local} vs Visitante: {p.equipo_visitante}
                    </h3>
                    <p>Fecha: {new Date(p.fecha).toLocaleString()}</p>
                    {typeof p.goles_local === 'number' && typeof p.goles_visitante === 'number' && (
                      <p>
                        Resultado: {p.goles_local} - {p.goles_visitante}
                      </p>
                    )}
                    {p.estadio && <p>Estadio: {p.estadio}</p>}
                    {p.descripcion && <p>Descripción: {p.descripcion}</p>}
                    <IonButton fill="outline" size="small">Ver detalles</IonButton>
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
