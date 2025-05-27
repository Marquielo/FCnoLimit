import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonAvatar,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonSearchbar,
  IonChip,
  IonIcon,
  IonBadge,
  IonSelect,
  IonSelectOption,
  IonModal,
  IonButtons,
  IonButton as IonButtonImport,
  IonList,
  IonText,
  IonSkeletonText,
  IonProgressBar,
  IonSegment,
  IonSegmentButton,
  IonFab,
  IonFabButton,
} from '@ionic/react';
import { 
  peopleCircleOutline, 
  footballOutline, 
  alertCircleOutline, 
  fitnessOutline, 
  trophyOutline, 
  personAddOutline,
  starOutline,
  checkmarkOutline,
  closeOutline,
  calendarOutline,
  timeOutline,
  arrowForward,
  podiumOutline,
  medicalOutline,
  statsChartOutline,
  addOutline,
  chevronForward,
  ribbonOutline,
  heart,
  flash,
  speedometer,
  layers,
  thumbsUp,
  options,
  close,
  create
} from 'ionicons/icons';
import NavBar from '../../../../components/NavBar';
import Footer from '../../../../components/Footer';

// Interfaces para datos
interface Jugador {
  id: number;
  nombre: string;
  posicion: string;
  edad: number;
  numero: number;
  imagen: string;
  estado: 'disponible' | 'lesionado' | 'sancionado';
  estadisticas: {
    partidos: number;
    goles: number;
    asistencias: number;
    tarjetasAmarillas: number;
    tarjetasRojas: number;
  };
}

const EntrenadorEquipo: React.FC = () => {
  const [busqueda, setBusqueda] = useState<string>('');
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [filtro, setFiltro] = useState<string>('todos');
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState<Jugador | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [vistaActual, setVistaActual] = useState<string>('tarjetas');
  const [loading, setLoading] = useState<boolean>(true);

  // Datos de ejemplo
  useEffect(() => {
    // Simular carga de datos
    setLoading(true);
    
    // Aquí cargarías los datos desde tu API
    setTimeout(() => {
      const datosEjemplo: Jugador[] = [
        {
          id: 1,
          nombre: 'Carlos Martínez',
          posicion: 'Delantero',
          edad: 24,
          numero: 9,
          imagen: 'https://ionicframework.com/docs/img/demos/avatar.svg',
          estado: 'disponible',
          estadisticas: {
            partidos: 15,
            goles: 12,
            asistencias: 5,
            tarjetasAmarillas: 2,
            tarjetasRojas: 0
          }
        },
        {
          id: 2,
          nombre: 'Juan Pérez',
          posicion: 'Mediocampista',
          edad: 22,
          numero: 8,
          imagen: 'https://ionicframework.com/docs/img/demos/avatar.svg',
          estado: 'lesionado',
          estadisticas: {
            partidos: 14,
            goles: 3,
            asistencias: 10,
            tarjetasAmarillas: 4,
            tarjetasRojas: 0
          }
        },
        {
          id: 3,
          nombre: 'Miguel López',
          posicion: 'Defensa',
          edad: 26,
          numero: 4,
          imagen: 'https://ionicframework.com/docs/img/demos/avatar.svg',
          estado: 'disponible',
          estadisticas: {
            partidos: 16,
            goles: 1,
            asistencias: 2,
            tarjetasAmarillas: 3,
            tarjetasRojas: 1
          }
        },
        {
          id: 4,
          nombre: 'Andrés Silva',
          posicion: 'Portero',
          edad: 29,
          numero: 1,
          imagen: 'https://ionicframework.com/docs/img/demos/avatar.svg',
          estado: 'sancionado',
          estadisticas: {
            partidos: 16,
            goles: 0,
            asistencias: 0,
            tarjetasAmarillas: 1,
            tarjetasRojas: 0
          }
        }
      ];
  
      setJugadores(datosEjemplo);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtrar jugadores según búsqueda y filtro
  const jugadoresFiltrados = jugadores.filter(jugador => {
    const coincideBusqueda = jugador.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideFiltro = 
      filtro === 'todos' || 
      (filtro === 'disponibles' && jugador.estado === 'disponible') ||
      (filtro === 'lesionados' && jugador.estado === 'lesionado') ||
      (filtro === 'sancionados' && jugador.estado === 'sancionado');
    
    return coincideBusqueda && coincideFiltro;
  });

  // Mostrar detalles del jugador
  const verDetalles = (jugador: Jugador) => {
    setJugadorSeleccionado(jugador);
    setShowModal(true);
  };

  // Obtener color según posición
  const getColorPosicion = (posicion: string) => {
    switch(posicion) {
      case 'Portero': return 'amarillo';
      case 'Defensa': return 'azul';
      case 'Mediocampista': return 'verde';
      case 'Delantero': return 'rojo';
      default: return 'gris';
    }
  };

  // Obtener color y texto según estado
  const getEstadoInfo = (estado: string) => {
    switch(estado) {
      case 'disponible': 
        return { color: 'success', texto: 'Disponible', icon: checkmarkOutline };
      case 'lesionado': 
        return { color: 'warning', texto: 'Lesionado', icon: medicalOutline };
      case 'sancionado': 
        return { color: 'danger', texto: 'Sancionado', icon: closeOutline };
      default: 
        return { color: 'medium', texto: 'Desconocido', icon: alertCircleOutline };
    }
  };

  return (
    <IonPage className="equipo-page">
      <NavBar />
      
      {/* Hero section mejorada */}
      <IonContent fullscreen className="equipo-content">
        <div className="equipo-hero">
          <div className="equipo-hero-overlay"></div>
          <div className="equipo-hero-content">
            <h1 className="main-title">
              <span>Gestión del</span>
              Equipo
            </h1>
            <p className="hero-subtitle">
              Administra tu plantilla, revisa estadísticas y gestiona el estado de cada jugador.
            </p>
            
            <div className="hero-badges">
              <div className="hero-badge">
                <IonIcon icon={peopleCircleOutline} />
                <div className="badge-count">{jugadores.length}</div>
                <div className="badge-label">Jugadores</div>
              </div>
              <div className="hero-badge">
                <IonIcon icon={footballOutline} />
                <div className="badge-count">{jugadores.filter(j => j.estado === 'disponible').length}</div>
                <div className="badge-label">Disponibles</div>
              </div>
              <div className="hero-badge">
                <IonIcon icon={fitnessOutline} />
                <div className="badge-count">{jugadores.filter(j => j.estado === 'lesionado').length}</div>
                <div className="badge-label">Lesionados</div>
              </div>
              <div className="hero-badge">
                <IonIcon icon={alertCircleOutline} />
                <div className="badge-count">{jugadores.filter(j => j.estado === 'sancionado').length}</div>
                <div className="badge-label">Sancionados</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Filtros y búsqueda */}
        <div className="equipo-filtros-container">
          <div className="filtros-header">
            <IonSearchbar
              value={busqueda}
              onIonChange={e => setBusqueda(e.detail.value || '')}
              placeholder="Buscar jugador..."
              className="equipo-searchbar"
            />
            
            <IonButton 
              className="agregar-jugador-btn primary-btn" 
              onClick={() => console.log('Agregar jugador')}
            >
              <IonIcon slot="start" icon={personAddOutline} />
              Agregar Jugador
            </IonButton>
          </div>
          
          <div className="filtro-segment-container">
            <IonSegment value={filtro} onIonChange={e => setFiltro(e.detail.value?.toString() || 'todos')} mode="ios" className="filtro-segment">
              <IonSegmentButton value="todos" className="segment-button-custom">
                <IonLabel>
                  Todos
                  <span className="segment-button-counter">{jugadores.length}</span>
                </IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="disponibles" className="segment-button-custom">
                <IonLabel>
                  Disponibles
                  <span className="segment-button-counter">{jugadores.filter(j => j.estado === 'disponible').length}</span>
                </IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="lesionados" className="segment-button-custom">
                <IonLabel>
                  Lesionados
                  <span className="segment-button-counter">{jugadores.filter(j => j.estado === 'lesionado').length}</span>
                </IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="sancionados" className="segment-button-custom">
                <IonLabel>
                  Sancionados
                  <span className="segment-button-counter">{jugadores.filter(j => j.estado === 'sancionado').length}</span>
                </IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </div>
          
          <div className="vista-selector">
            <IonSegment value={vistaActual} onIonChange={e => setVistaActual(e.detail.value?.toString() || 'tarjetas')}>
              <IonSegmentButton value="tarjetas">
                <IonIcon icon={layers} />
              </IonSegmentButton>
              <IonSegmentButton value="lista">
                <IonIcon icon={options} />
              </IonSegmentButton>
            </IonSegment>
          </div>
        </div>

        {/* Estado de carga */}
        {loading ? (
          <div className="loading-container">
            <IonProgressBar type="indeterminate" color="primary"></IonProgressBar>
            <div className="skeleton-cards">
              {[...Array(4)].map((_, i) => (
                <div className="skeleton-card" key={i}>
                  <div className="skeleton-header">
                    <div className="skeleton-avatar"></div>
                    <div className="skeleton-details">
                      <IonSkeletonText animated style={{ width: '70%', height: '16px' }}></IonSkeletonText>
                      <IonSkeletonText animated style={{ width: '40%', height: '12px' }}></IonSkeletonText>
                    </div>
                  </div>
                  <div className="skeleton-content">
                    <IonSkeletonText animated style={{ width: '90%', height: '12px' }}></IonSkeletonText>
                    <IonSkeletonText animated style={{ width: '60%', height: '12px' }}></IonSkeletonText>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Vista de tarjetas */}
            {vistaActual === 'tarjetas' && (
              <div className="jugadores-grid">
                {jugadoresFiltrados.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <IonIcon icon={peopleCircleOutline} />
                    </div>
                    <h3 className="empty-state-title">No se encontraron jugadores</h3>
                    <p className="empty-state-text">Intenta cambiar los filtros o añade nuevos jugadores al equipo.</p>
                    <IonButton className="empty-state-action">
                      <IonIcon slot="start" icon={personAddOutline} />
                      Añadir Jugador
                    </IonButton>
                  </div>
                ) : (
                  jugadoresFiltrados.map((jugador, index) => (
                    <div 
                      className={`jugador-card animate-on-enter ${index % 3 === 0 ? 'animate-delay-1' : index % 3 === 1 ? 'animate-delay-2' : 'animate-delay-3'} show`}
                      key={jugador.id}
                      onClick={() => verDetalles(jugador)}
                    >
                      <div className={`card-indicator ${getEstadoInfo(jugador.estado).color}`}></div>
                      <div className="card-header">
                        <div className="card-numero">{jugador.numero}</div>
                        <div className={`card-posicion-badge ${getColorPosicion(jugador.posicion)}`}>
                          {jugador.posicion}
                        </div>
                      </div>
                      <div className="card-avatar">
                        <img src={jugador.imagen} alt={jugador.nombre} />
                        <div className={`estado-indicador ${getEstadoInfo(jugador.estado).color}`}>
                          <IonIcon icon={getEstadoInfo(jugador.estado).icon} />
                        </div>
                      </div>
                      <div className="card-info">
                        <h3 className="card-nombre">{jugador.nombre}</h3>
                        <div className="card-stats">
                          <div className="stat-item">
                            <div className="stat-value">{jugador.estadisticas.partidos}</div>
                            <div className="stat-label">PJ</div>
                          </div>
                          <div className="stat-item">
                            <div className="stat-value">{jugador.estadisticas.goles}</div>
                            <div className="stat-label">Goles</div>
                          </div>
                          <div className="stat-item">
                            <div className="stat-value">{jugador.estadisticas.asistencias}</div>
                            <div className="stat-label">Asis.</div>
                          </div>
                        </div>
                        <div className="card-footer">
                          <div className="card-age">
                            <IonIcon icon={calendarOutline} />
                            {jugador.edad} años
                          </div>
                          <div className="card-action">
                            Ver Detalles
                            <IonIcon icon={chevronForward} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Vista de lista */}
            {vistaActual === 'lista' && (
              <div className="jugadores-lista">
                {jugadoresFiltrados.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <IonIcon icon={peopleCircleOutline} />
                    </div>
                    <h3 className="empty-state-title">No se encontraron jugadores</h3>
                    <p className="empty-state-text">Intenta cambiar los filtros o añade nuevos jugadores al equipo.</p>
                    <IonButton className="empty-state-action">
                      <IonIcon slot="start" icon={personAddOutline} />
                      Añadir Jugador
                    </IonButton>
                  </div>
                ) : (
                  <IonList className="lista-jugadores">
                    {jugadoresFiltrados.map((jugador, index) => (
                      <IonItem 
                        key={jugador.id} 
                        className={`lista-item animate-on-enter ${index % 3 === 0 ? 'animate-delay-1' : index % 3 === 1 ? 'animate-delay-2' : 'animate-delay-3'} show`}
                        onClick={() => verDetalles(jugador)}
                        detail={true}
                      >
                        <div className={`item-numero ${getColorPosicion(jugador.posicion)}`} slot="start">
                          {jugador.numero}
                        </div>
                        <IonAvatar slot="start">
                          <img src={jugador.imagen} alt={jugador.nombre} />
                        </IonAvatar>
                        <IonLabel>
                          <h2>{jugador.nombre}</h2>
                          <p>{jugador.posicion} • {jugador.edad} años</p>
                          <div className="item-stats">
                            <span className="mini-stat">
                              <IonIcon icon={footballOutline} /> {jugador.estadisticas.goles}
                            </span>
                            <span className="mini-stat">
                              <IonIcon icon={peopleCircleOutline} /> {jugador.estadisticas.asistencias}
                            </span>
                            <span className="mini-stat">
                              <IonIcon icon={trophyOutline} /> {jugador.estadisticas.partidos}
                            </span>
                          </div>
                        </IonLabel>
                        <IonChip 
                          slot="end" 
                          color={getEstadoInfo(jugador.estado).color}
                          className="estado-chip"
                        >
                          <IonIcon icon={getEstadoInfo(jugador.estado).icon} />
                          <IonLabel>{getEstadoInfo(jugador.estado).texto}</IonLabel>
                        </IonChip>
                      </IonItem>
                    ))}
                  </IonList>
                )}
              </div>
            )}
          </>
        )}

        {/* Modal de detalles del jugador */}
        <IonModal 
          isOpen={showModal} 
          onDidDismiss={() => setShowModal(false)}
          className="jugador-modal"
        >
          {jugadorSeleccionado && (
            <IonPage>
              <IonHeader>
                <IonToolbar color="primary" className="modal-header">
                  <IonButtons slot="start">
                    <IonButton onClick={() => setShowModal(false)}>
                      <IonIcon slot="icon-only" icon={close} />
                    </IonButton>
                  </IonButtons>
                  <IonTitle>Perfil de Jugador</IonTitle>
                </IonToolbar>
              </IonHeader>
              
              <IonContent className="jugador-detalles-content">
                {/* Cabecera del perfil */}
                <div className="jugador-profile-header">
                  <div className="profile-header-overlay"></div>
                  <div className="profile-content">
                    <div className="profile-avatar-container">
                      <img src={jugadorSeleccionado.imagen} alt={jugadorSeleccionado.nombre} className="profile-avatar" />
                      <div className={`profile-number ${getColorPosicion(jugadorSeleccionado.posicion)}`}>
                        {jugadorSeleccionado.numero}
                      </div>
                    </div>
                    
                    <h1 className="profile-name">{jugadorSeleccionado.nombre}</h1>
                    
                    <div className="profile-badges">
                      <div className={`profile-position ${getColorPosicion(jugadorSeleccionado.posicion)}-light`}>
                        {jugadorSeleccionado.posicion}
                      </div>
                      <div className={`profile-status ${getEstadoInfo(jugadorSeleccionado.estado).color}`}>
                        <IonIcon icon={getEstadoInfo(jugadorSeleccionado.estado).icon} />
                        {getEstadoInfo(jugadorSeleccionado.estado).texto}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Sección de estadísticas */}
                <div className="profile-section">
                  <div className="section-header">
                    <h2 className="section-title">
                      <IonIcon icon={statsChartOutline} />
                      Estadísticas
                    </h2>
                  </div>
                  
                  <div className="stats-grid">
                    <div className="stat-box">
                      <div className="stat-icon">
                        <IonIcon icon={trophyOutline} />
                      </div>
                      <div className="stat-value">{jugadorSeleccionado.estadisticas.partidos}</div>
                      <div className="stat-name">Partidos</div>
                    </div>
                    
                    <div className="stat-box">
                      <div className="stat-icon">
                        <IonIcon icon={footballOutline} />
                      </div>
                      <div className="stat-value">{jugadorSeleccionado.estadisticas.goles}</div>
                      <div className="stat-name">Goles</div>
                    </div>
                    
                    <div className="stat-box">
                      <div className="stat-icon">
                        <IonIcon icon={peopleCircleOutline} />
                      </div>
                      <div className="stat-value">{jugadorSeleccionado.estadisticas.asistencias}</div>
                      <div className="stat-name">Asistencias</div>
                    </div>
                    
                    <div className="stat-box">
                      <div className="stat-icon warning">
                        <IonIcon icon={alertCircleOutline} />
                      </div>
                      <div className="stat-value">{jugadorSeleccionado.estadisticas.tarjetasAmarillas}</div>
                      <div className="stat-name">T. Amarillas</div>
                    </div>
                    
                    <div className="stat-box">
                      <div className="stat-icon danger">
                        <IonIcon icon={alertCircleOutline} />
                      </div>
                      <div className="stat-value">{jugadorSeleccionado.estadisticas.tarjetasRojas}</div>
                      <div className="stat-name">T. Rojas</div>
                    </div>
                  </div>
                </div>
                
                {/* Sección de atributos */}
                <div className="profile-section">
                  <div className="section-header">
                    <h2 className="section-title">
                      <IonIcon icon={ribbonOutline} />
                      Atributos
                    </h2>
                  </div>
                  
                  <div className="attributes-container">
                    <div className="attribute-item">
                      <div className="attribute-name">
                        <IonIcon icon={speedometer} />
                        <span>Velocidad</span>
                      </div>
                      <div className="attribute-bar-container">
                        <div className="attribute-bar" style={{ width: '85%' }}></div>
                      </div>
                      <div className="attribute-value">85</div>
                    </div>
                    
                    <div className="attribute-item">
                      <div className="attribute-name">
                        <IonIcon icon={flash} />
                        <span>Resistencia</span>
                      </div>
                      <div className="attribute-bar-container">
                        <div className="attribute-bar" style={{ width: '78%' }}></div>
                      </div>
                      <div className="attribute-value">78</div>
                    </div>
                    
                    <div className="attribute-item">
                      <div className="attribute-name">
                        <IonIcon icon={footballOutline} />
                        <span>Técnica</span>
                      </div>
                      <div className="attribute-bar-container">
                        <div className="attribute-bar" style={{ width: '92%' }}></div>
                      </div>
                      <div className="attribute-value">92</div>
                    </div>
                    
                    <div className="attribute-item">
                      <div className="attribute-name">
                        <IonIcon icon={layers} />
                        <span>Táctica</span>
                      </div>
                      <div className="attribute-bar-container">
                        <div className="attribute-bar" style={{ width: '70%' }}></div>
                      </div>
                      <div className="attribute-value">70</div>
                    </div>
                  </div>
                </div>
                
                {/* Sección de información personal */}
                <div className="profile-section">
                  <div className="section-header">
                    <h2 className="section-title">
                      <IonIcon icon={peopleCircleOutline} />
                      Información Personal
                    </h2>
                  </div>
                  
                  <div className="personal-info-grid">
                    <div className="info-item">
                      <div className="info-label">Edad</div>
                      <div className="info-value">{jugadorSeleccionado.edad} años</div>
                    </div>
                    
                    <div className="info-item">
                      <div className="info-label">Número</div>
                      <div className="info-value">{jugadorSeleccionado.numero}</div>
                    </div>
                    
                    <div className="info-item">
                      <div className="info-label">Posición</div>
                      <div className="info-value">{jugadorSeleccionado.posicion}</div>
                    </div>
                    
                    <div className="info-item">
                      <div className="info-label">Estado</div>
                      <div className={`info-value estado-${jugadorSeleccionado.estado}`}>
                        {getEstadoInfo(jugadorSeleccionado.estado).texto}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Botones de acción */}
                <div className="profile-actions">
                  <IonButton 
                    expand="block"
                    color="primary"
                    className="action-button"
                  >
                    <IonIcon slot="start" icon={create} />
                    Editar Información
                  </IonButton>
                  
                  <IonButton 
                    expand="block" 
                    color={jugadorSeleccionado.estado === 'disponible' ? 'warning' : 'success'}
                    className="action-button"
                  >
                    <IonIcon slot="start" icon={jugadorSeleccionado.estado === 'disponible' ? alertCircleOutline : checkmarkOutline} />
                    {jugadorSeleccionado.estado === 'disponible' ? 'Marcar como No Disponible' : 'Marcar como Disponible'}
                  </IonButton>
                </div>
              </IonContent>
            </IonPage>
          )}
        </IonModal>
        
        {/* FAB Button para añadir jugadores */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed" className="fab-container">
          <IonFabButton className="fab-button-custom">
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>
        
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default EntrenadorEquipo;