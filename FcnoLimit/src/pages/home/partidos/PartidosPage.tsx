import React from 'react';
import { IonPage, IonContent, IonButton, IonIcon, IonSpinner } from '@ionic/react';
import { locationOutline, arrowForward } from 'ionicons/icons';
import NavBar from '../../../components/NavBar';
import Footer from '../../../components/Footer';
import './PartidosPage.css';
import bannerBg from '../../../assets/banner-fc-bg.png'; // Asegúrate de que la ruta sea correcta
import { usePartidos } from '../../../hooks/usePartidos';
import { RenderMatchCard } from '../../../components/RenderMatchCard';

const apiBaseUrl = 'https://fcnolimit-back.onrender.com';

const PartidosPage: React.FC = () => {
  const { jugados, pendientes, loading, error } = usePartidos();

  return (
    <IonPage>
      <NavBar />
      <IonContent fullscreen>
        {/* Banner personalizado con la imagen proporcionada */}
        <div
          className="partidos-banner"
          style={{
            background: `url(${bannerBg}) center center / contain no-repeat`
          }}
        >
          <div style={{
            color: '#fff',
            fontSize: '2.5rem',
            fontWeight: 800,
            letterSpacing: 2,
            marginLeft: 48,
            textShadow: '2px 2px 8px #000'
          }}>
            Partidos
          </div>
        </div>
        <div className="content-container">
          {/* SECCIÓN DE PARTIDOS PENDIENTES */}
          <section className="matches-section">
            <h2 className="section-title">Próximos Partidos</h2>
            {loading && <IonSpinner name="crescent" />}
            {!loading && error && <div className="error-message">{error}</div>}
            {!loading && !error && pendientes.length === 0 && <p>No hay partidos pendientes.</p>}
            {!loading && !error && pendientes.length > 0 && (
              <div className="matches-slider">
                {pendientes.map(p => <RenderMatchCard key={p.partido_id || p.id} partido={p} isJugado={false} />)}
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
                {jugados.map(p => <RenderMatchCard key={p.partido_id || p.id} partido={p} isJugado={true} />)}
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
