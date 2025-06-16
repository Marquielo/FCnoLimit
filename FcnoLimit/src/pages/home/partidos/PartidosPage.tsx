import React, { useEffect } from 'react';
import { IonPage, IonContent, IonButton, IonIcon, IonSpinner } from '@ionic/react';
import { locationOutline, arrowForward } from 'ionicons/icons';
import NavBar from '../../../components/NavBar';
import Footer from '../../../components/Footer';
import './PartidosPage.css';
import bannerBg from '../../../assets/banner-fc-bg.png'; // Asegúrate de que la ruta sea correcta
import { usePartidos } from '../../../hooks/usePartidos';
import { RenderMatchCard } from '../../../components/RenderMatchCard';
import { startGlobalParticlesEffect } from '../../../effects/globalParticlesEffect';

const apiBaseUrl = 'https://fcnolimit-back.onrender.com';

const PartidosPage: React.FC = () => {
  const divisiones = [
    { id: 1, nombre: 'Primera Adulto' },
    { id: 2, nombre: 'Segunda Adulto' },
    { id: 3, nombre: 'Tercera Adulto' },
    { id: 4, nombre: 'Seniors' },
    { id: 5, nombre: 'Juvenil' },
    { id: 6, nombre: 'Primera Infantil' },
    { id: 7, nombre: 'Segunda Infantil' },
    { id: 8, nombre: 'Tercera Infantil' },
  ];
  const divisionEquipos = [
    { id: 1, nombre: '1A' },
    { id: 2, nombre: '1B' },
  ];
  const [selectedDivision, setSelectedDivision] = React.useState<number>(6);
  const [selectedDivisionEquipo, setSelectedDivisionEquipo] = React.useState<number>(1);

  const { jugados, pendientes, loading, error } = usePartidos(selectedDivision, selectedDivisionEquipo);

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
          <div className="tabla-selectores" style={{ display: 'flex', gap: 12, alignItems: 'center', margin: '16px 0' }}>
            <select
              className="tabla-select"
              value={selectedDivision}
              onChange={e => setSelectedDivision(Number(e.target.value))}
              style={{
                padding: '8px 16px',
                border: '2px solid #ffe600',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 16,
                background: '#ff9800',
                color: '#fff',
                outline: 'none',
                boxShadow: '0 2px 8px #0002',
                minWidth: 180
              }}
            >
              {divisiones.map(d => (
                <option key={d.id} value={d.id}>{d.nombre}</option>
              ))}
            </select>
            <select
              className="tabla-select"
              value={selectedDivisionEquipo}
              onChange={e => setSelectedDivisionEquipo(Number(e.target.value))}
              style={{
                padding: '8px 16px',
                border: '2px solid #ffe600',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 16,
                background: '#ff9800',
                color: '#fff',
                outline: 'none',
                boxShadow: '0 2px 8px #0002',
                minWidth: 100
              }}
            >
              {divisionEquipos.map(de => (
                <option key={de.id} value={de.id}>{de.nombre}</option>
              ))}
            </select>
          </div>
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
