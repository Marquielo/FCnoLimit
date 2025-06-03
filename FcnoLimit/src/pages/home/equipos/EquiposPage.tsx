import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonButton, IonIcon, IonSpinner } from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { peopleOutline, footballOutline } from 'ionicons/icons';
import NavBar from '../../../components/NavBar';
import Footer from '../../../components/Footer';
import './EquiposPage.css';

const apiBaseUrl = 'https://fcnolimit-back.onrender.com';

interface Equipo {
  id: number;
  nombre: string;
  categoria?: string | null;
  liga_id?: number | null;
  imagen_url?: string | null;
  creado_en?: string | null;
  pais?: string | null;
  ciudad?: string | null;
  fundacion?: string | null;
  estadio_nombre?: string | null;
  capacidad_estadio?: number | null;
  valor_mercado_total?: number | null;
  jugadores_plantilla?: number | null;
  descripcion?: string | null;
  division?: string | null;
  logo?: string | null;
}

const EquiposPage: React.FC = () => {
  // useParams te permite obtener el id de la URL, por ejemplo /equipos/5
  const { id } = useParams<{ id?: string }>();
  const history = useHistory();
  const [equiposPorDivision, setEquiposPorDivision] = useState<{ [division: string]: Equipo[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [equipo, setEquipo] = useState<Equipo | null>(null);

  useEffect(() => {
    if (id) {
      // Si hay id en la URL, busca la info de ese equipo
      setLoading(true);
      fetch(`${apiBaseUrl}/api/equipos/${id}`)
        .then(res => {
          if (!res.ok) throw new Error('No se pudo cargar el equipo');
          return res.json();
        })
        .then(data => {
          setEquipo(data);
          setLoading(false);
        })
        .catch(() => {
          setError('No se pudo cargar el equipo');
          setLoading(false);
        });
    } else {
      // Si no hay id, muestra el listado de equipos por división
      setEquipo(null);
      setLoading(true);
      fetch(`${apiBaseUrl}/api/divisiones/equipos`, { cache: 'no-store' })
        .then(res => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then((data: Equipo[]) => {
          const agrupados: { [division: string]: Equipo[] } = {};
          data.forEach(eq => {
            if (!agrupados[eq.division || 'Sin división']) agrupados[eq.division || 'Sin división'] = [];
            agrupados[eq.division || 'Sin división'].push(eq);
          });
          setEquiposPorDivision(agrupados);
          setLoading(false);
        })
        .catch(() => {
          setError('No se pudieron cargar los equipos');
          setLoading(false);
        });
    }
  }, [id]);

  return (
    <IonPage>
      <NavBar />
      <IonContent fullscreen>
        <div className="equipos-content">
          {loading ? (
            <div className="equipos-loading">
              <IonSpinner name="crescent" />
            </div>
          ) : error ? (
            <div className="equipos-error">{error}</div>
          ) : equipo ? (
            // Vista detalle de equipo
            <div className="equipo-detalle">
              <IonButton fill="clear" onClick={() => history.push('/equipos')}>
                ← Volver a divisiones
              </IonButton>
              <div className="equipo-header">
                <img
                  src={
                    equipo.imagen_url
                      ? (equipo.imagen_url.startsWith('http') ? equipo.imagen_url : `${apiBaseUrl}${equipo.imagen_url}`)
                      : '/assets/equipos/default.png'
                  }
                  alt={equipo.nombre}
                  className="equipo-logo"
                  style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ff9800', background: '#fafafa' }}
                />
                <h1>{equipo.nombre}</h1>
              </div>
              <div className="equipo-info">
                <p><strong>País:</strong> {equipo.pais || 'Sin dato'}</p>
                <p><strong>Ciudad:</strong> {equipo.ciudad || 'Sin dato'}</p>
                <p><strong>Estadio:</strong> {equipo.estadio_nombre || 'Sin dato'}</p>
                <p><strong>Capacidad estadio:</strong> {equipo.capacidad_estadio ?? 'Sin dato'}</p>
                <p><strong>Fundación:</strong> {equipo.fundacion ? new Date(equipo.fundacion).toLocaleDateString() : 'Sin dato'}</p>
                <p><strong>Valor mercado total:</strong> {equipo.valor_mercado_total ?? 'Sin dato'}</p>
                <p><strong>Jugadores plantilla:</strong> {equipo.jugadores_plantilla ?? 'Sin dato'}</p>
                <p><strong>Descripción:</strong> {equipo.descripcion || 'Sin descripción'}</p>
                {equipo.division && <p><strong>División:</strong> {equipo.division}</p>}
                {equipo.categoria && <p><strong>Categoría:</strong> {equipo.categoria}</p>}
                {equipo.liga_id && <p><strong>Liga ID:</strong> {equipo.liga_id}</p>}
                <p><strong>Creado en:</strong> {equipo.creado_en ? new Date(equipo.creado_en).toLocaleString() : 'Sin dato'}</p>
              </div>
            </div>
          ) : (
            // Vista listado por divisiones
            <>
              <div className="hero-section equipos-hero">
                <div className="hero-content">
                  <h1 className="main-title">Divisiones</h1>
                  <p className="hero-subtitle">Descubre las divisiones y sus equipos en FCnoLimit</p>
                  <IonButton color="secondary" size="large" routerLink="/registrar-equipo">
                    Registrar nuevo equipo
                  </IonButton>
                </div>
              </div>
              <div className="equipos-listado">
                {Object.keys(equiposPorDivision).map(division => (
                  <div key={division} className="division-section">
                    <h2>{division}</h2>
                    <div className="equipos-grid">
                      {equiposPorDivision[division].map(eq => (
                        <IonButton
                          key={eq.id}
                          className="equipo-card"
                          onClick={() => history.push(`/equipos/${eq.id}`)}
                          fill="outline"
                        >
                          <img
                            src={
                              eq.imagen_url
                                ? (eq.imagen_url.startsWith('http') ? eq.imagen_url : `${apiBaseUrl}${eq.imagen_url}`)
                                : '/assets/equipos/default.png'
                            }
                            alt={eq.nombre}
                            className="equipo-logo"
                            style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', marginRight: 12, border: '1.5px solid #ff9800', background: '#fafafa' }}
                          />
                          <span>{eq.nombre}</span>
                        </IonButton>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default EquiposPage;