import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonButton, IonIcon, IonSpinner } from '@ionic/react';
import { trophyOutline } from 'ionicons/icons';
import NavBar from '../../../components/NavBar';
import Footer from '../../../components/Footer';
import bannerBg from '../../../assets/banner-fc-bg.png'; // Ajusta la ruta si es necesario
import './CampeonatoPage.css';

const apiBaseUrl = 'https://fcnolimit-back.onrender.com'; // Igual que en AuthPage

const CampeonatoPage: React.FC = () => {
  const [campeonatos, setCampeonatos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tablaPosiciones, setTablaPosiciones] = useState<any[]>([]);
  const [loadingTabla, setLoadingTabla] = useState(true);
  const [errorTabla, setErrorTabla] = useState<string | null>(null);
  const [equipos, setEquipos] = useState<any[]>([]);

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

  useEffect(() => {
    const fetchTabla = async () => {
      try {
        // Puedes cambiar estos valores por los que necesites filtrar
        const division_id = 6;
        const division_equipo_id = 1;
        const res = await fetch(`${apiBaseUrl}/api/vistas/tabla-posiciones/division-equipo?division_id=${division_id}&division_equipo_id=${division_equipo_id}`);
        if (!res.ok) throw new Error('Error al cargar la tabla de posiciones');
        const data = await res.json();
        setTablaPosiciones(Array.isArray(data) ? data : []);
        setLoadingTabla(false);
      } catch (err) {
        setErrorTabla('No se pudo cargar la tabla de posiciones');
        setLoadingTabla(false);
      }
    };
    fetchTabla();
  }, []);

  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/equipos`);
        if (!res.ok) throw new Error('Error al cargar equipos');
        const data = await res.json();
        setEquipos(Array.isArray(data) ? data : []);
      } catch {
        setEquipos([]);
      }
    };
    fetchEquipos();
  }, []);

  const colorForma = (f: string) => {
    if (f === 'G') return { background: '#4caf50', color: '#fff' }; // verde
    if (f === 'E') return { background: '#ffc107', color: '#fff' }; // amarillo
    if (f === 'P') return { background: '#f44336', color: '#fff' }; // rojo
    return {};
  };

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
                {loadingTabla ? (
                  <tr><td colSpan={11} style={{textAlign:'center'}}><IonSpinner name="crescent" /></td></tr>
                ) : errorTabla ? (
                  <tr><td colSpan={11} style={{color:'red',textAlign:'center'}}>{errorTabla}</td></tr>
                ) : tablaPosiciones.length === 0 ? (
                  <tr><td colSpan={11} style={{textAlign:'center'}}>No hay datos de posiciones.</td></tr>
                ) : (
                  tablaPosiciones.map((row, idx) => {
                    let logoUrl = "/assets/equipos/default.png";
                    const equipo = equipos.find(eq => eq.id === row.equipo_id);
                    if (equipo && equipo.imagen_url) {
                      // Si la imagen_url ya es absoluta, úsala tal cual. Si no, prepende el dominio backend
                      logoUrl = equipo.imagen_url.startsWith("http")
                        ? equipo.imagen_url
                        : `${apiBaseUrl}${equipo.imagen_url.startsWith("/") ? equipo.imagen_url : "/" + equipo.imagen_url}`;
                    }
                    return (
                      <tr key={row.id} className={idx < 2 ? "tabla-top-row" : ""}>
                        <td>{idx + 1}</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <img src={logoUrl} alt={row.equipo_nombre} style={{ width: 36, height: 36, borderRadius: "50%", background: "#fff", border: "2px solid #eee" }} />
                            <span>{row.equipo_nombre}</span>
                          </div>
                        </td>
                        <td>{row.partidos_jugados}</td>
                        <td>{row.ganados}</td>
                        <td>{row.empatados}</td>
                        <td>{row.perdidos}</td>
                        <td>{row.goles_favor}</td>
                        <td>{row.goles_contra}</td>
                        <td>{row.diferencia_goles}</td>
                        <td style={{ fontWeight: 700 }}>{row.puntos}</td>
                        <td>
                          <div style={{ display: "flex", gap: 6 }}>
                            -
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
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