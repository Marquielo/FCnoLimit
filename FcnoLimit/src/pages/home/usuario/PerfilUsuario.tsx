import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonIcon, IonButton, IonSpinner } from '@ionic/react';
import {
  personCircleOutline,
  mailOutline,
  callOutline,
  locationOutline,
  calendarOutline,
  trophyOutline,
  footballOutline,
  statsChartOutline,
  settingsOutline,
  cameraOutline,
  pencilOutline,
  shieldCheckmarkOutline,
  timeOutline
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import NavBar from '../../../components/NavBar';
import Footer from '../../../components/Footer';
import MobileTabBar from '../../../components/mobile/MobileTabBar';
import './PerfilUsuario.css';

const apiBaseUrl = 'https://fcnolimit-back.onrender.com';

// Hook para detectar si es móvil
function useIsMobile(breakpoint = 991) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);
  return isMobile;
}

interface UsuarioInfo {
  id: number;
  nombre_completo: string;
  email: string;
  telefono?: string;
  fecha_nacimiento?: string;
  ciudad?: string;
  rol: string;
  fecha_registro: string;
  imagen_perfil?: string;
  estadisticas?: {
    partidos_jugados: number;
    goles: number;
    asistencias: number;
    tarjetas_amarillas: number;
    tarjetas_rojas: number;
  };
  equipo_actual?: {
    id: number;
    nombre: string;
    imagen_url?: string;
  };
}

const PerfilUsuario: React.FC = () => {
  const history = useHistory();
  const isMobile = useIsMobile();
  const [usuario, setUsuario] = useState<UsuarioInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchPerfilUsuario = async () => {
      try {
        // Obtener datos del usuario del localStorage
        const usuarioLocalString = localStorage.getItem("usuario");
        const usuarioLocal = usuarioLocalString ? JSON.parse(usuarioLocalString) : null;

        if (!usuarioLocal?.id) {
          history.push('/auth');
          return;
        }

        // Simular datos del usuario por ahora
        const datosUsuario: UsuarioInfo = {
          id: usuarioLocal.id,
          nombre_completo: usuarioLocal.nombre_completo || 'Usuario FCnoLimit',
          email: usuarioLocal.email || 'usuario@fcnolimit.com',
          telefono: '+56 9 1234 5678',
          fecha_nacimiento: '1995-03-15',
          ciudad: 'Santiago, Chile',
          rol: usuarioLocal.rol || 'jugador',
          fecha_registro: '2024-01-15',
          imagen_perfil: `https://ui-avatars.com/api/?name=${encodeURIComponent(usuarioLocal.nombre_completo || "U")}&background=ff9800&color=fff&size=200`,
          estadisticas: usuarioLocal.rol === 'jugador' ? {
            partidos_jugados: 15,
            goles: 8,
            asistencias: 5,
            tarjetas_amarillas: 2,
            tarjetas_rojas: 0
          } : undefined,
          equipo_actual: usuarioLocal.rol === 'jugador' ? {
            id: 1,
            nombre: 'Guillermo Rivera',
            imagen_url: '/equipos/gmo_rivera.png'
          } : undefined
        };

        setUsuario(datosUsuario);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar el perfil del usuario');
        setLoading(false);
      }
    };

    fetchPerfilUsuario();
  }, [history]);

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calcularEdad = (fechaNacimiento: string) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const getRolTexto = (rol: string) => {
    switch (rol) {
      case 'administrador': return 'Administrador';
      case 'jugador': return 'Jugador';
      case 'entrenador': return 'Entrenador';
      case 'persona_natural': return 'Aficionado';
      default: return 'Usuario';
    }
  };

  if (loading) {
    return (
      <IonPage>
        <NavBar />
        <IonContent fullscreen>
          <div className="loading-container">
            <IonSpinner name="crescent" />
            <p>Cargando perfil...</p>
          </div>
        </IonContent>
        {isMobile && <MobileTabBar />}
      </IonPage>
    );
  }

  if (error || !usuario) {
    return (
      <IonPage>
        <NavBar />
        <IonContent fullscreen>
          <div className="error-container">
            <p>{error || 'Error al cargar el perfil'}</p>
            <IonButton onClick={() => history.push('/inicio')}>
              Volver al inicio
            </IonButton>
          </div>
        </IonContent>
        {isMobile && <MobileTabBar />}
      </IonPage>
    );
  }

  return (
    <IonPage className="perfil-usuario-page">
      <NavBar />
      <IonContent fullscreen>
        {/* Banner del perfil */}
        <div className="perfil-banner">
          <div className="perfil-banner-overlay">
            <div className="perfil-avatar-container">
              <div className="perfil-avatar">
                <img
                  src={usuario.imagen_perfil}
                  alt={usuario.nombre_completo}
                  className="perfil-avatar-img"
                />
                <button className="perfil-avatar-edit" onClick={() => {}}>
                  <IonIcon icon={cameraOutline} />
                </button>
              </div>
              <div className="perfil-info-principal">
                <h1 className="perfil-nombre">{usuario.nombre_completo}</h1>
                <div className="perfil-rol">
                  <IonIcon icon={shieldCheckmarkOutline} />
                  {getRolTexto(usuario.rol)}
                </div>
                {usuario.equipo_actual && (
                  <div className="perfil-equipo">
                    <img
                      src={`${apiBaseUrl}${usuario.equipo_actual.imagen_url}`}
                      alt={usuario.equipo_actual.nombre}
                      className="perfil-equipo-logo"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.equipo_actual?.nombre.charAt(0) || "E")}&background=ff9800&color=fff&size=32`;
                      }}
                    />
                    <span>{usuario.equipo_actual.nombre}</span>
                  </div>
                )}
              </div>
              <div className="perfil-acciones">
                <IonButton
                  fill="outline"
                  color="light"
                  onClick={() => setEditMode(!editMode)}
                >
                  <IonIcon icon={pencilOutline} slot="start" />
                  Editar
                </IonButton>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="perfil-content">
          <div className="perfil-grid">
            {/* Información personal */}
            <div className="perfil-card">
              <div className="perfil-card-header">
                <h3>
                  <IonIcon icon={personCircleOutline} />
                  Información Personal
                </h3>
              </div>
              <div className="perfil-card-content">
                <div className="perfil-info-item">
                  <IonIcon icon={mailOutline} />
                  <div>
                    <label>Email</label>
                    <span>{usuario.email}</span>
                  </div>
                </div>
                <div className="perfil-info-item">
                  <IonIcon icon={callOutline} />
                  <div>
                    <label>Teléfono</label>
                    <span>{usuario.telefono || 'No especificado'}</span>
                  </div>
                </div>
                <div className="perfil-info-item">
                  <IonIcon icon={calendarOutline} />
                  <div>
                    <label>Fecha de nacimiento</label>
                    <span>
                      {usuario.fecha_nacimiento 
                        ? `${formatearFecha(usuario.fecha_nacimiento)} (${calcularEdad(usuario.fecha_nacimiento)} años)`
                        : 'No especificado'
                      }
                    </span>
                  </div>
                </div>
                <div className="perfil-info-item">
                  <IonIcon icon={locationOutline} />
                  <div>
                    <label>Ciudad</label>
                    <span>{usuario.ciudad || 'No especificado'}</span>
                  </div>
                </div>
                <div className="perfil-info-item">
                  <IonIcon icon={timeOutline} />
                  <div>
                    <label>Miembro desde</label>
                    <span>{formatearFecha(usuario.fecha_registro)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Estadísticas (solo para jugadores) */}
            {usuario.rol === 'jugador' && usuario.estadisticas && (
              <div className="perfil-card">
                <div className="perfil-card-header">
                  <h3>
                    <IonIcon icon={statsChartOutline} />
                    Estadísticas
                  </h3>
                </div>
                <div className="perfil-card-content">
                  <div className="estadisticas-grid">
                    <div className="estadistica-item">
                      <div className="estadistica-valor">{usuario.estadisticas.partidos_jugados}</div>
                      <div className="estadistica-label">Partidos</div>
                    </div>
                    <div className="estadistica-item">
                      <div className="estadistica-valor">{usuario.estadisticas.goles}</div>
                      <div className="estadistica-label">Goles</div>
                    </div>
                    <div className="estadistica-item">
                      <div className="estadistica-valor">{usuario.estadisticas.asistencias}</div>
                      <div className="estadistica-label">Asistencias</div>
                    </div>
                    <div className="estadistica-item">
                      <div className="estadistica-valor" style={{color: '#ffc107'}}>
                        {usuario.estadisticas.tarjetas_amarillas}
                      </div>
                      <div className="estadistica-label">T. Amarillas</div>
                    </div>
                    <div className="estadistica-item">
                      <div className="estadistica-valor" style={{color: '#f44336'}}>
                        {usuario.estadisticas.tarjetas_rojas}
                      </div>
                      <div className="estadistica-label">T. Rojas</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Acciones rápidas */}
            <div className="perfil-card">
              <div className="perfil-card-header">
                <h3>
                  <IonIcon icon={trophyOutline} />
                  Acciones Rápidas
                </h3>
              </div>
              <div className="perfil-card-content">
                <div className="acciones-grid">
                  <button 
                    className="accion-btn"
                    onClick={() => history.push('/partidos')}
                  >
                    <IonIcon icon={footballOutline} />
                    <span>Ver Partidos</span>
                  </button>
                  <button 
                    className="accion-btn"
                    onClick={() => history.push('/campeonatos')}
                  >
                    <IonIcon icon={trophyOutline} />
                    <span>Competiciones</span>
                  </button>
                  <button 
                    className="accion-btn"
                    onClick={() => history.push('/equipos')}
                  >
                    <IonIcon icon={personCircleOutline} />
                    <span>Equipos</span>
                  </button>
                  {usuario.rol === 'jugador' && (
                    <button 
                      className="accion-btn"
                      onClick={() => history.push('/jugador/estadisticas')}
                    >
                      <IonIcon icon={statsChartOutline} />
                      <span>Mis Estadísticas</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </IonContent>

      {/* Footer solo en web */}
      {!isMobile && <Footer />}
      
      {/* TabBar solo en móvil */}
      {isMobile && <MobileTabBar />}
    </IonPage>
  );
};

export default PerfilUsuario;
