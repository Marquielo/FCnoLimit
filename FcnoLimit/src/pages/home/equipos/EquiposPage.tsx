import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonButton, IonIcon, IonSpinner } from '@ionic/react';
import { peopleOutline, footballOutline } from 'ionicons/icons';
import NavBar from '../../../components/NavBar';
import Footer from '../../../components/Footer';
import './EquiposPage.css';

const apiBaseUrl = 'https://fcnolimit-back.onrender.com';

interface Equipo {
  id: number;
  nombre: string;
  descripcion: string;
  logo?: string;
  division: string;
}

const EquiposPage: React.FC = () => {
  const [equiposPorDivision, setEquiposPorDivision] = useState<{ [division: string]: Equipo[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/divisiones/equipos`);
        if (!res.ok) throw new Error('Error al cargar equipos');
        const data: Equipo[] = await res.json();
        // Agrupar equipos por división
        const agrupados: { [division: string]: Equipo[] } = {};
        data.forEach(eq => {
          if (!agrupados[eq.division]) agrupados[eq.division] = [];
          agrupados[eq.division].push(eq);
        });
        setEquiposPorDivision(agrupados);
        setLoading(false);
      } catch (err: any) {
        setError('No se pudieron cargar los equipos');
        setLoading(false);
      }
    };
    fetchEquipos();
  }, []);

  return (
    <IonPage>
      <NavBar />
      <IonContent fullscreen>
        <div className="hero-section equipos-hero">
          <div className="hero-content">
            <h1 className="main-title">Divisiones</h1>
            <p className="hero-subtitle">Descubre las divisiones y sus equipos en FCnoLimit</p>
            <IonButton color="secondary" size="large" routerLink="/registrar-equipo">
              Registrar nuevo equipo
            </IonButton>
          </div>
        </div>
        <div className="content-container">
          {loading ? (
            <IonSpinner name="crescent" />
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : Object.keys(equiposPorDivision).length === 0 ? (
            <p>No hay divisiones registradas.</p>
          ) : (
            Object.entries(equiposPorDivision).map(([division, equipos]) => (
              <section className="teams-section" key={division}>
                <h2 className="section-title">{division}</h2>
                <div className="teams-grid">
                  {equipos.map((eq) => (
                    <div className="team-card" key={eq.id}>
                      <img src={eq.logo || '/assets/equipos/default.png'} alt={eq.nombre} className="team-logo"/>
                      <h3>{eq.nombre}</h3>
                      <p>{eq.descripcion}</p>
                      <IonButton fill="outline" size="small">
                        <IonIcon icon={peopleOutline} slot="start" />
                        Ver detalles
                      </IonButton>
                    </div>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default EquiposPage;