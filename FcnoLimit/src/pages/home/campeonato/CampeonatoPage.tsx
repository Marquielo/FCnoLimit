import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonButton, IonIcon, IonSpinner } from '@ionic/react';
import { trophyOutline } from 'ionicons/icons';
import NavBar from '../../../components/NavBar';
import Footer from '../../../components/Footer';
import './CampeonatoPage.css';

const apiBaseUrl = 'https://fcnolimit-back.onrender.com'; // Igual que en AuthPage

const CampeonatosPage: React.FC = () => {
  const [campeonatos, setCampeonatos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampeonatos = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/campeonatos/vista`);
        if (!res.ok) throw new Error('Error al cargar campeonatos');
        const data = await res.json();
        setCampeonatos(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err: any) {
        setError('No se pudieron cargar los campeonatos');
        setLoading(false);
      }
    };
    fetchCampeonatos();
  }, []);

  return (
    <IonPage>
      <NavBar />
      <IonContent fullscreen>
        <div className="hero-section campeonatos-hero">
          <div className="hero-content">
            <h1 className="main-title">Campeonatos</h1>
            <p className="hero-subtitle">Participa y sigue los campeonatos más importantes</p>
            <IonButton color="secondary" size="large" routerLink="/crear-campeonato">
              Crear campeonato
            </IonButton>
          </div>
        </div>

        <div className="content-container">
          <section className="championships-section">
            <h2 className="section-title">Listado de Campeonatos</h2>
            <div className="championships-grid">
              {loading ? (
                <IonSpinner name="crescent" />
              ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
              ) : campeonatos.length === 0 ? (
                <p>No hay campeonatos registrados.</p>
              ) : (
                campeonatos.map((c: any) => (
                  <div className="championship-card" key={c.id}>
                    <IonIcon icon={trophyOutline} size="large" />
                    <h3>{c.nombre}</h3>
                    <p>{c.descripcion}</p>
                    <p>
                      <b>Fecha inicio:</b> {c.fecha_inicio ? c.fecha_inicio : 'Sin definir'}<br />
                      <b>Fecha fin:</b> {c.fecha_fin ? c.fecha_fin : 'Sin definir'}
                    </p>
                    <IonButton fill="outline" size="small">
                      Ver detalles
                    </IonButton>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default CampeonatosPage;