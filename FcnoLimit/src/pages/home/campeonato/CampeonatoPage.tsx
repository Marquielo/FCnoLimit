import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonButton, IonIcon, IonSpinner } from '@ionic/react';
import { trophyOutline } from 'ionicons/icons';
import NavBar from '../../../components/NavBar';
import Footer from '../../../components/Footer';
import bannerBg from '../../../assets/banner-fc-bg.png'; // Ajusta la ruta si es necesario
import './CampeonatoPage.css';

const apiBaseUrl = 'https://fcnolimit-back.onrender.com'; // Igual que en AuthPage

const tablaEjemplo = [
  {
    pos: 1,
    logo: '/assets/equipos/man_city.png',
    nombre: 'Manchester City',
    pj: 10, g: 8, e: 1, p: 1, gf: 24, gc: 8, dg: '+16', pts: 25, forma: ['G', 'G', 'G', 'G', 'E']
  },
  {
    pos: 2,
    logo: '/assets/equipos/inter_milan.png',
    nombre: 'Inter Milan',
    pj: 10, g: 6, e: 3, p: 1, gf: 18, gc: 9, dg: '+9', pts: 21, forma: ['G', 'E', 'G', 'G', 'E']
  },
  {
    pos: 3,
    logo: '/assets/equipos/barcelona.png',
    nombre: 'FC Barcelona',
    pj: 10, g: 6, e: 2, p: 2, gf: 20, gc: 12, dg: '+8', pts: 20, forma: ['P', 'G', 'G', 'G', 'E']
  },
  {
    pos: 4,
    logo: '/assets/equipos/man_united.png',
    nombre: 'Manchester United',
    pj: 10, g: 5, e: 3, p: 2, gf: 15, gc: 10, dg: '+5', pts: 18, forma: ['G', 'G', 'E', 'P', 'E']
  },
  {
    pos: 5,
    logo: '/assets/equipos/chelsea.png',
    nombre: 'Chelsea',
    pj: 10, g: 4, e: 3, p: 3, gf: 14, gc: 12, dg: '+2', pts: 15, forma: ['G', 'E', 'G', 'E', 'P']
  }
];

const colorForma = (f: string) => {
  if (f === 'G') return { background: '#4caf50', color: '#fff' }; // verde
  if (f === 'E') return { background: '#ffc107', color: '#fff' }; // amarillo
  if (f === 'P') return { background: '#f44336', color: '#fff' }; // rojo
  return {};
};

const CampeonatoPage: React.FC = () => {
  const [campeonatos, setCampeonatos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampeonatos = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/campeonatos/vista`, {
          cache: 'no-store'
        });
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
        {/* Banner igual al de equipos */}
        <div
          className="equipo-banner-dark"
          style={{
            background: `linear-gradient(120deg, #232323 60%, #181818 100%), url(${bannerBg})`,
            backgroundImage: `url(${bannerBg}), linear-gradient(120deg, #232323 60%, #181818 100%)`,
            backgroundSize: '100% 100%, cover',
            backgroundRepeat: 'no-repeat, no-repeat',
            backgroundPosition: 'center center, center center',
            padding: '48px 0 32px 0',
            minHeight: 180,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-start',
            borderBottom: '5px solid #ffe600'
          }}
        >
          <div className="equipo-banner-inner">
            <img
              src="/assets/equipos/default.png"
              alt="Competición"
              className="equipo-banner-logo"
            />
            <div className="equipo-banner-title">Competición</div>
          </div>
        </div>
        {/* Tabla de clasificación */}
        <div className="tabla-clasificacion-container">
          <div className="tabla-header-row">
            <h2 className="tabla-title">
              <span style={{ color: "#ff9800", marginRight: 8, fontSize: 28, verticalAlign: "middle" }}>📊</span>
              Clasificación <span style={{ color: "#ff9800" }}>actual</span>
            </h2>
            <a href="#" className="tabla-ver-completa">Ver completa &rarr;</a>
          </div>
          <div className="tabla-tabs">
            <button className="tabla-tab tabla-tab-active">Liga Amateur</button>
            <button className="tabla-tab">Copa FCnoLimit</button>
            <button className="tabla-tab">Torneo Verano</button>
          </div>
          <div className="tabla-scroll">
            <table className="tabla-clasificacion">
              <thead>
                <tr>
                  <th>Pos</th>
                  <th>Equipo</th>
                  <th>PJ</th>
                  <th>G</th>
                  <th>E</th>
                  <th>P</th>
                  <th>GF</th>
                  <th>GC</th>
                  <th>DG</th>
                  <th>Pts</th>
                  <th>Forma</th>
                </tr>
              </thead>
              <tbody>
                {tablaEjemplo.map((row, idx) => (
                  <tr key={row.pos} className={idx < 2 ? "tabla-top-row" : ""}>
                    <td>{row.pos}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <img src={row.logo} alt={row.nombre} style={{
                          width: 36, height: 36, borderRadius: "50%", background: "#fff", border: "2px solid #eee"
                        }} />
                        <span>{row.nombre}</span>
                      </div>
                    </td>
                    <td>{row.pj}</td>
                    <td>{row.g}</td>
                    <td>{row.e}</td>
                    <td>{row.p}</td>
                    <td>{row.gf}</td>
                    <td>{row.gc}</td>
                    <td>{row.dg}</td>
                    <td style={{ fontWeight: 700 }}>{row.pts}</td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        {row.forma.map((f, i) => (
                          <span
                            key={i}
                            style={{
                              ...colorForma(f),
                              borderRadius: "50%",
                              width: 26,
                              height: 26,
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              fontSize: 15
                            }}
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

export default CampeonatoPage;