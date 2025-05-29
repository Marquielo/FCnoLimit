import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonButton, IonIcon, IonSpinner } from '@ionic/react';
import { calendarOutline, footballOutline } from 'ionicons/icons';
import NavBar from '../../../components/NavBar';
import Footer from '../../../components/Footer';
import './PartidosPage.css';

const apiBaseUrl = 'https://fcnolimit-back.onrender.com';

interface Partido {
  id: number;
  equipo_local_id: number;
  equipo_visitante_id: number;
  goles_local: number | null;
  goles_visitante: number | null;
  fecha: string;
  estadio: string;
  liga_id: number;
  estado: string;
  descripcion?: string;
}

const PartidosPage: React.FC = () => {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartidos = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/partidos`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Error al cargar partidos');
        const data = await res.json();
        setPartidos(Array.isArray(data) ? data : []);
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
            <h2 className="section-title">Todos los Partidos</h2>
            {loading ? (
              <IonSpinner name="crescent" />
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : partidos.length === 0 ? (
              <p>No hay partidos registrados.</p>
            ) : (
              <div className="matches-grid">
                {partidos.map((p) => (
                  <div className="match-card" key={p.id}>
                    <IonIcon icon={calendarOutline} size="large" />
                    <h3>
                      Local: {p.equipo_local_id} vs Visitante: {p.equipo_visitante_id}
                    </h3>
                    <p>Fecha: {new Date(p.fecha).toLocaleString()}</p>
                    <p>Estadio: {p.estadio}</p>
                    <p>Estado: {p.estado}</p>
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
