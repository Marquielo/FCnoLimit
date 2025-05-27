import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonList,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonButtons,
  IonButton,
  IonIcon,
  IonText,
  IonBadge,
  IonSkeletonText
} from '@ionic/react';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import { 
  trophyOutline, 
  footballOutline, 
  podiumOutline, 
  peopleOutline, 
  statsChartOutline, 
  personOutline,
  timeOutline,
  arrowUpOutline,
  arrowDownOutline,
  alertCircleOutline,
  listOutline,
  analyticsOutline,
  chevronDownOutline // Añadir este icono
} from 'ionicons/icons';
import NavBar from '../../../../components/NavBar';
import Footer from '../../../../components/Footer';
import './EntrenadorEstadisticas.css';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
);

// Interfaces para nuestros datos
interface Jugador {
  id: number;
  nombre: string;
  posicion: string;
  estadisticas: {
    goles: number;
    asistencias: number;
    tarjetasAmarillas: number;
    tarjetasRojas: number;
    minutosJugados: number;
    partidosJugados: number;
  };
}

interface EquipoEstadisticas {
  victorias: number;
  empates: number;
  derrotas: number;
  golesFavor: number;
  golesContra: number;
  posesionPromedio: number;
  efectividadPases: number;
}

// Opciones comunes para gráficos
const opcionesComunes: ChartOptions<'doughnut'> = {
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#333',
      bodyColor: '#666',
      bodyFont: {
        size: 13
      },
      titleFont: {
        size: 14,
        weight: 'bold'
      },
      padding: 12,
      boxPadding: 6,
      borderColor: 'rgba(0,0,0,0.1)',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
      boxWidth: 10,
      boxHeight: 10,
      usePointStyle: true
    }
  },
  maintainAspectRatio: false
};

const EntrenadorEstadisticas: React.FC = () => {
  const [segmento, setSegmento] = useState<'equipo' | 'jugadores'>('equipo');
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [equipoStats, setEquipoStats] = useState<EquipoEstadisticas | null>(null);
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState<number | null>(null);
  const [filtro, setFiltro] = useState<'todos' | 'goles' | 'asistencias' | 'minutos'>('todos');
  const [cargando, setCargando] = useState<boolean>(true);
  const [acordeonAbierto, setAcordeonAbierto] = useState<number | null>(null); // Añadir este estado
  
  // Agregar esta función para controlar el acordeón
  const toggleAcordeon = (id: number) => {
    if (acordeonAbierto === id) {
      setAcordeonAbierto(null);
    } else {
      setAcordeonAbierto(id);
    }
  };
  
  // Carga simulada de datos
  useEffect(() => {
    setCargando(true);
    // Aquí normalmente cargarías los datos desde tu API
    setTimeout(() => {
      const jugadoresEjemplo: Jugador[] = [
        {
          id: 1,
          nombre: 'Juan Pérez',
          posicion: 'Delantero',
          estadisticas: {
            goles: 15,
            asistencias: 7,
            tarjetasAmarillas: 3,
            tarjetasRojas: 0,
            minutosJugados: 1520,
            partidosJugados: 18
          }
        },
        {
          id: 2,
          nombre: 'Carlos Gómez',
          posicion: 'Mediocampista',
          estadisticas: {
            goles: 5,
            asistencias: 12,
            tarjetasAmarillas: 4,
            tarjetasRojas: 1,
            minutosJugados: 1620,
            partidosJugados: 19
          }
        },
        {
          id: 3,
          nombre: 'Miguel Rodríguez',
          posicion: 'Defensa',
          estadisticas: {
            goles: 2,
            asistencias: 3,
            tarjetasAmarillas: 5,
            tarjetasRojas: 0,
            minutosJugados: 1700,
            partidosJugados: 20
          }
        },
        {
          id: 4,
          nombre: 'Fernando Sánchez',
          posicion: 'Portero',
          estadisticas: {
            goles: 0,
            asistencias: 0,
            tarjetasAmarillas: 0,
            tarjetasRojas: 0,
            minutosJugados: 1800,
            partidosJugados: 20
          }
        },
        {
          id: 5,
          nombre: 'Luis Martínez',
          posicion: 'Mediocampista',
          estadisticas: {
            goles: 8,
            asistencias: 6,
            tarjetasAmarillas: 6,
            tarjetasRojas: 0,
            minutosJugados: 1450,
            partidosJugados: 17
          }
        }
      ];

      const equipoStatsEjemplo: EquipoEstadisticas = {
        victorias: 12,
        empates: 5,
        derrotas: 3,
        golesFavor: 35,
        golesContra: 15,
        posesionPromedio: 58.5,
        efectividadPases: 87.2
      };

      setJugadores(jugadoresEjemplo);
      setEquipoStats(equipoStatsEjemplo);
      setJugadorSeleccionado(jugadoresEjemplo[0].id);
      setCargando(false);
    }, 1000);
  }, []);

  // Filtrar jugadores según el criterio seleccionado
  const jugadoresFiltrados = React.useMemo(() => {
    if (filtro === 'todos') return jugadores;
    
    return [...jugadores].sort((a, b) => {
      if (filtro === 'goles') return b.estadisticas.goles - a.estadisticas.goles;
      if (filtro === 'asistencias') return b.estadisticas.asistencias - a.estadisticas.asistencias;
      if (filtro === 'minutos') return b.estadisticas.minutosJugados - a.estadisticas.minutosJugados;
      return 0;
    });
  }, [jugadores, filtro]);

  // Datos para la gráfica de resultados del equipo
  const datosResultados = {
    labels: ['Victorias', 'Empates', 'Derrotas'],
    datasets: [
      {
        label: 'Resultados',
        data: equipoStats ? [equipoStats.victorias, equipoStats.empates, equipoStats.derrotas] : [],
        backgroundColor: [
          'rgba(46, 204, 113, 0.8)',
          'rgba(241, 196, 15, 0.8)',
          'rgba(231, 76, 60, 0.8)',
        ],
        borderColor: [
          'rgba(46, 204, 113, 1)',
          'rgba(241, 196, 15, 1)',
          'rgba(231, 76, 60, 1)',
        ],
        borderWidth: 2,
        hoverOffset: 10
      },
    ],
  };

  // Datos para la gráfica de goles del equipo
  const datosGoles = {
    labels: ['Goles a favor', 'Goles en contra'],
    datasets: [
      {
        label: 'Goles',
        data: equipoStats ? [equipoStats.golesFavor, equipoStats.golesContra] : [],
        backgroundColor: [
          'rgba(52, 152, 219, 0.8)',
          'rgba(231, 76, 60, 0.8)',
        ],
        borderColor: [
          'rgba(52, 152, 219, 1)',
          'rgba(231, 76, 60, 1)',
        ],
        borderWidth: 2,
        borderRadius: 6,
        hoverBorderWidth: 3
      },
    ],
  };

  // Datos para la gráfica de rendimiento de jugadores
  const datosJugadores = {
    labels: jugadores.map(j => j.nombre),
    datasets: [
      {
        label: 'Goles',
        data: jugadores.map(j => j.estadisticas.goles),
        backgroundColor: 'rgba(52, 152, 219, 0.7)',
        borderColor: 'rgba(52, 152, 219, 1)',
        borderWidth: 2,
        borderRadius: 4,
        hoverBackgroundColor: 'rgba(52, 152, 219, 0.9)',
      },
      {
        label: 'Asistencias',
        data: jugadores.map(j => j.estadisticas.asistencias),
        backgroundColor: 'rgba(46, 204, 113, 0.7)',
        borderColor: 'rgba(46, 204, 113, 1)',
        borderWidth: 2,
        borderRadius: 4,
        hoverBackgroundColor: 'rgba(46, 204, 113, 0.9)',
      }
    ],
  };

  // Datos para la gráfica individual de jugador
  const obtenerDatosJugadorSeleccionado = (): ChartData<'doughnut', number[], string> => {
    const jugador = jugadores.find(j => j.id === jugadorSeleccionado);
    
    if (!jugador) {
      // Devolver un objeto ChartData válido pero vacío
      return {
        labels: [],
        datasets: [{
          label: 'Sin datos',
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1
        }]
      };
    }

    return {
      labels: ['Goles', 'Asistencias', 'Tarjetas Amarillas', 'Tarjetas Rojas'],
      datasets: [
        {
          label: 'Estadísticas',
          data: [
            jugador.estadisticas.goles,
            jugador.estadisticas.asistencias,
            jugador.estadisticas.tarjetasAmarillas,
            jugador.estadisticas.tarjetasRojas
          ],
          backgroundColor: [
            'rgba(52, 152, 219, 0.8)',
            'rgba(46, 204, 113, 0.8)',
            'rgba(241, 196, 15, 0.8)',
            'rgba(231, 76, 60, 0.8)'
          ],
          borderColor: [
            'rgba(52, 152, 219, 1)',
            'rgba(46, 204, 113, 1)',
            'rgba(241, 196, 15, 1)',
            'rgba(231, 76, 60, 1)'
          ],
          borderWidth: 2,
          hoverOffset: 10
        },
      ],
    };
  };
  
  return (
    <IonPage className="estadisticas-page">
      <NavBar />
      
      <IonContent className="estadisticas-content">
        {/* Hero section para estadísticas */}
        <div className="estadisticas-hero">
          <div className="estadisticas-hero-overlay"></div>
          <div className="estadisticas-hero-content">
            <h1 className="hero-title">
              <span>Rendimiento del</span>
              Equipo
            </h1>
            <p className="hero-subtitle">
              Análisis detallado de estadísticas individuales y colectivas
            </p>
          </div>
        </div>
        
        {/* Filtros y segmentos */}
        <div className="estadisticas-filtros-container">
          <IonSegment 
            value={segmento} 
            onIonChange={e => setSegmento(e.detail.value as 'equipo' | 'jugadores')}
            className="filtro-segment"
            mode="ios"
          >
            <IonSegmentButton value="equipo" className="segment-btn">
              <IonLabel>
                <IonIcon icon={trophyOutline} />
                <span>Equipo</span>
              </IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="jugadores" className="segment-btn">
              <IonLabel>
                <IonIcon icon={peopleOutline} />
                <span>Jugadores</span>
              </IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>
        
        {/* Contenido principal - Equipo */}
        {segmento === 'equipo' && (
          <div className="estadisticas-contenido">
            {cargando ? (
              <>
                <div className="skeleton-card">
                  <div className="skeleton-header">
                    <IonSkeletonText animated style={{ width: '40%', height: '24px' }}></IonSkeletonText>
                  </div>
                  <div className="skeleton-content">
                    <div className="skeleton-chart"></div>
                  </div>
                </div>
                <div className="skeleton-card">
                  <div className="skeleton-header">
                    <IonSkeletonText animated style={{ width: '50%', height: '24px' }}></IonSkeletonText>
                  </div>
                  <div className="skeleton-content">
                    <div className="skeleton-grid">
                      {Array(6).fill(0).map((_, i) => (
                        <div className="skeleton-grid-item" key={i}>
                          <IonSkeletonText animated style={{ width: '80%', height: '16px' }}></IonSkeletonText>
                          <IonSkeletonText animated style={{ width: '40%', height: '16px' }}></IonSkeletonText>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : equipoStats && (
              <>
                {/* Tarjetas de resumen */}
                <div className="resumen-tarjetas">
                  <div className="resumen-tarjeta victorias">
                    <div className="tarjeta-icono">
                      <IonIcon icon={trophyOutline} />
                    </div>
                    <div className="tarjeta-contenido">
                      <div className="tarjeta-valor">{equipoStats.victorias}</div>
                      <div className="tarjeta-etiqueta">Victorias</div>
                    </div>
                  </div>
                  
                  <div className="resumen-tarjeta empates">
                    <div className="tarjeta-icono">
                      <IonIcon icon={analyticsOutline} />
                    </div>
                    <div className="tarjeta-contenido">
                      <div className="tarjeta-valor">{equipoStats.empates}</div>
                      <div className="tarjeta-etiqueta">Empates</div>
                    </div>
                  </div>
                  
                  <div className="resumen-tarjeta derrotas">
                    <div className="tarjeta-icono">
                      <IonIcon icon={alertCircleOutline} />
                    </div>
                    <div className="tarjeta-contenido">
                      <div className="tarjeta-valor">{equipoStats.derrotas}</div>
                      <div className="tarjeta-etiqueta">Derrotas</div>
                    </div>
                  </div>
                  
                  <div className="resumen-tarjeta goles">
                    <div className="tarjeta-icono">
                      <IonIcon icon={footballOutline} />
                    </div>
                    <div className="tarjeta-contenido">
                      <div className="tarjeta-valor">{equipoStats.golesFavor}</div>
                      <div className="tarjeta-etiqueta">Goles a favor</div>
                    </div>
                  </div>
                </div>
                
                {/* Gráfica de resultados */}
                <div className="estadisticas-card">
                  <div className="card-header">
                    <div className="card-titulo">
                      <IonIcon icon={podiumOutline} />
                      <h2>Resultados del equipo</h2>
                    </div>
                    <div className="card-acciones">
                      <span className="card-info">Total: {equipoStats.victorias + equipoStats.empates + equipoStats.derrotas} partidos</span>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="grafica-container">
                      <Doughnut data={datosResultados} options={opcionesComunes as any} />
                    </div>
                    
                    <div className="estadisticas-resumen">
                      <div className="resumen-item victoria">
                        <div className="resumen-etiqueta">Victorias</div>
                        <div className="resumen-valor">{equipoStats.victorias}</div>
                        <div className="resumen-porcentaje">
                          {((equipoStats.victorias / (equipoStats.victorias + equipoStats.empates + equipoStats.derrotas)) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="resumen-item empate">
                        <div className="resumen-etiqueta">Empates</div>
                        <div className="resumen-valor">{equipoStats.empates}</div>
                        <div className="resumen-porcentaje">
                          {((equipoStats.empates / (equipoStats.victorias + equipoStats.empates + equipoStats.derrotas)) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="resumen-item derrota">
                        <div className="resumen-etiqueta">Derrotas</div>
                        <div className="resumen-valor">{equipoStats.derrotas}</div>
                        <div className="resumen-porcentaje">
                          {((equipoStats.derrotas / (equipoStats.victorias + equipoStats.empates + equipoStats.derrotas)) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Gráfica de goles */}
                <div className="estadisticas-card">
                  <div className="card-header">
                    <div className="card-titulo">
                      <IonIcon icon={footballOutline} />
                      <h2>Balance de goles</h2>
                    </div>
                    <div className="card-acciones">
                      <span className="card-info">Diferencia: {equipoStats.golesFavor - equipoStats.golesContra}</span>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="grafica-container">
                      <Bar 
                        data={datosGoles} 
                        options={{
                          ...opcionesComunes,
                          scales: {
                            y: {
                              beginAtZero: true,
                              grid: {
                                display: true,
                                color: 'rgba(0, 0, 0, 0.05)'
                              }
                            },
                            x: {
                              grid: {
                                display: false
                              }
                            }
                          }
                        } as any} 
                      />
                    </div>
                    
                    <div className="estadisticas-resumen goles-resumen">
                      <div className="resumen-item goles-favor">
                        <div className="resumen-etiqueta">Goles a favor</div>
                        <div className="resumen-valor">{equipoStats.golesFavor}</div>
                        <div className="resumen-extra">
                          {(equipoStats.golesFavor / (equipoStats.victorias + equipoStats.empates + equipoStats.derrotas)).toFixed(2)} por partido
                        </div>
                      </div>
                      <div className="resumen-item goles-contra">
                        <div className="resumen-etiqueta">Goles en contra</div>
                        <div className="resumen-valor">{equipoStats.golesContra}</div>
                        <div className="resumen-extra">
                          {(equipoStats.golesContra / (equipoStats.victorias + equipoStats.empates + equipoStats.derrotas)).toFixed(2)} por partido
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Estadísticas adicionales */}
                <div className="estadisticas-card">
                  <div className="card-header">
                    <div className="card-titulo">
                      <IonIcon icon={statsChartOutline} />
                      <h2>Indicadores de rendimiento</h2>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="indicadores-rendimiento">
                      <div className="indicador">
                        <div className="indicador-info">
                          <div className="indicador-titulo">Posesión</div>
                          <div className="indicador-valor">{equipoStats.posesionPromedio}%</div>
                        </div>
                        <div className="indicador-barra-container">
                          <div className="indicador-barra posesion" style={{ width: `${equipoStats.posesionPromedio}%` }}></div>
                        </div>
                      </div>
                      
                      <div className="indicador">
                        <div className="indicador-info">
                          <div className="indicador-titulo">Efectividad en pases</div>
                          <div className="indicador-valor">{equipoStats.efectividadPases}%</div>
                        </div>
                        <div className="indicador-barra-container">
                          <div className="indicador-barra pases" style={{ width: `${equipoStats.efectividadPases}%` }}></div>
                        </div>
                      </div>
                      
                      <div className="indicador">
                        <div className="indicador-info">
                          <div className="indicador-titulo">Porcentaje de victorias</div>
                          <div className="indicador-valor">
                            {((equipoStats.victorias / (equipoStats.victorias + equipoStats.empates + equipoStats.derrotas)) * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div className="indicador-barra-container">
                          <div 
                            className="indicador-barra victorias" 
                            style={{ 
                              width: `${((equipoStats.victorias / (equipoStats.victorias + equipoStats.empates + equipoStats.derrotas)) * 100).toFixed(1)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        
        {/* Contenido principal - Jugadores */}
        {segmento === 'jugadores' && (
          <div className="estadisticas-contenido">
            {cargando ? (
              <>
                <div className="skeleton-card">
                  <div className="skeleton-header">
                    <IonSkeletonText animated style={{ width: '40%', height: '24px' }}></IonSkeletonText>
                  </div>
                  <div className="skeleton-content">
                    <div className="skeleton-chart"></div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Filtro para jugadores */}
                <div className="filtro-jugadores">
                  <IonSelect 
                    value={filtro} 
                    onIonChange={e => setFiltro(e.detail.value)} 
                    interface="popover"
                    className="filtro-select"
                    placeholder="Filtrar jugadores"
                  >
                    <IonSelectOption value="todos">Todos los jugadores</IonSelectOption>
                    <IonSelectOption value="goles">Goles (mayor a menor)</IonSelectOption>
                    <IonSelectOption value="asistencias">Asistencias (mayor a menor)</IonSelectOption>
                    <IonSelectOption value="minutos">Minutos jugados (mayor a menor)</IonSelectOption>
                  </IonSelect>
                </div>
                
                {/* Comparativa de jugadores */}
                <div className="estadisticas-card">
                  <div className="card-header">
                    <div className="card-titulo">
                      <IonIcon icon={peopleOutline} />
                      <h2>Comparativa de jugadores</h2>
                    </div>
                    <div className="card-acciones">
                      <span className="card-info">{jugadores.length} jugadores</span>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="grafica-container">
                      <Bar 
                        data={datosJugadores}
                        options={{ 
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                              }
                            },
                            x: {
                              grid: {
                                display: false
                              }
                            }
                          },
                          plugins: {
                            legend: {
                              position: 'top',
                              labels: {
                                usePointStyle: true,
                                padding: 20
                              }
                            }
                          }
                        } as any} 
                      />
                    </div>
                  </div>
                </div>
                
                {/* Listado de jugadores */}
                <div className="estadisticas-card">
                  <div className="card-header">
                    <div className="card-titulo">
                      <IonIcon icon={listOutline} />
                      <h2>Listado de jugadores</h2>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="jugadores-tabla desktop-only">
                      <div className="tabla-header">
                        <div className="col-jugador">Jugador</div>
                        <div className="col-posicion">Posición</div>
                        <div className="col-estadistica">PJ</div>
                        <div className="col-estadistica">Goles</div>
                        <div className="col-estadistica">Asis.</div>
                        <div className="col-acciones"></div>
                      </div>
                      
                      {jugadoresFiltrados.map((jugador) => (
                        <div 
                          className={`tabla-fila ${jugadorSeleccionado === jugador.id ? 'fila-seleccionada' : ''}`} 
                          key={jugador.id}
                          onClick={() => setJugadorSeleccionado(jugador.id)}
                        >
                          <div className="col-jugador">
                            <div className="jugador-info">
                              <div className="jugador-avatar">
                                <IonIcon icon={personOutline} />
                              </div>
                              <div className="jugador-nombre">{jugador.nombre}</div>
                            </div>
                          </div>
                          <div className="col-posicion">{jugador.posicion}</div>
                          <div className="col-estadistica">{jugador.estadisticas.partidosJugados}</div>
                          <div className="col-estadistica">{jugador.estadisticas.goles}</div>
                          <div className="col-estadistica">{jugador.estadisticas.asistencias}</div>
                          <div className="col-acciones">
                            <IonButton 
                              fill="clear"
                              size="small"
                              className="ver-detalles-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setJugadorSeleccionado(jugador.id);
                              }}
                            >
                              Ver detalles
                            </IonButton>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Acordeón para móviles */}
                    <div className="jugadores-acordeon mobile-only">
                      {jugadoresFiltrados.map((jugador) => (
                        <div 
                          key={jugador.id} 
                          className={`acordeon-item ${jugadorSeleccionado === jugador.id ? 'acordeon-seleccionado' : ''} ${acordeonAbierto === jugador.id ? 'acordeon-abierto' : ''}`}
                          data-id={jugador.id}
                        >
                          <div 
                            className="acordeon-header" 
                            onClick={() => toggleAcordeon(jugador.id)}
                          >
                            <div className="acordeon-jugador-info">
                              <div className="acordeon-avatar">
                                <IonIcon icon={personOutline} />
                              </div>
                              <div className="acordeon-detalles">
                                <div className="acordeon-nombre">{jugador.nombre}</div>
                                <div className="acordeon-posicion">{jugador.posicion}</div>
                              </div>
                            </div>
                            
                            <div className="acordeon-datos-rapidos">
                              <div className="dato-rapido">
                                <span className="dato-valor">{jugador.estadisticas.goles}</span>
                                <span className="dato-etiqueta">Goles</span>
                              </div>
                              <div className="acordeon-indicador">
                                <IonIcon icon={chevronDownOutline} />
                              </div>
                            </div>
                          </div>
                          
                          <div className="acordeon-contenido">
                            {/* Estadísticas destacadas */}
                            <div className="destacados-grid">
                              <div className="destacado-item">
                                <div className="destacado-icono partidos">
                                  <IonIcon icon={podiumOutline} />
                                </div>
                                <div className="destacado-valor">{jugador.estadisticas.partidosJugados}</div>
                                <div className="destacado-label">Partidos</div>
                              </div>
                              
                              <div className="destacado-item">
                                <div className="destacado-icono minutos">
                                  <IonIcon icon={timeOutline} />
                                </div>
                                <div className="destacado-valor">{jugador.estadisticas.minutosJugados}</div>
                                <div className="destacado-label">Minutos</div>
                              </div>
                              
                              <div className="destacado-item">
                                <div className="destacado-icono goles">
                                  <IonIcon icon={footballOutline} />
                                </div>
                                <div className="destacado-valor">{jugador.estadisticas.goles}</div>
                                <div className="destacado-label">Goles</div>
                              </div>
                              
                              <div className="destacado-item">
                                <div className="destacado-icono asistencias">
                                  <IonIcon icon={peopleOutline} />
                                </div>
                                <div className="destacado-valor">{jugador.estadisticas.asistencias}</div>
                                <div className="destacado-label">Asistencias</div>
                              </div>
                            </div>
                            
                            {/* Rendimiento y tarjetas */}
                            <div className="acordeon-seccion">
                              <div className="seccion-titulo">
                                <div className="linea-titulo"></div>
                                <h4>Rendimiento</h4>
                                <div className="linea-titulo"></div>
                              </div>
                              
                              <div className="rendimiento-lista">
                                <div className="rendimiento-item">
                                  <div className="item-info">
                                    <div className="item-icono">
                                      <IonIcon icon={statsChartOutline} />
                                    </div>
                                    <div className="item-texto">
                                      <div className="item-titulo">Goles por partido</div>
                                      <div className="item-valor">{(jugador.estadisticas.goles / jugador.estadisticas.partidosJugados).toFixed(2)}</div>
                                    </div>
                                  </div>
                                  <div className="barra-progreso-container">
                                    <div className="barra-fondo"></div>
                                    <div 
                                      className="barra-progreso goles" 
                                      style={{ 
                                        width: `${Math.min((jugador.estadisticas.goles / jugador.estadisticas.partidosJugados) * 100, 100)}%` 
                                      }}
                                    ></div>
                                  </div>
                                </div>
                                
                                <div className="rendimiento-item">
                                  <div className="item-info">
                                    <div className="item-icono">
                                      <IonIcon icon={timeOutline} />
                                    </div>
                                    <div className="item-texto">
                                      <div className="item-titulo">Minutos por partido</div>
                                      <div className="item-valor">{(jugador.estadisticas.minutosJugados / jugador.estadisticas.partidosJugados).toFixed(0)} min</div>
                                    </div>
                                  </div>
                                  <div className="barra-progreso-container">
                                    <div className="barra-fondo"></div>
                                    <div 
                                      className="barra-progreso minutos" 
                                      style={{ 
                                        width: `${Math.min((jugador.estadisticas.minutosJugados / jugador.estadisticas.partidosJugados / 90) * 100, 100)}%` 
                                      }}
                                    ></div>
                                  </div>
                                </div>
                                
                                <div className="rendimiento-item">
                                  <div className="item-info">
                                    <div className="item-icono">
                                      <IonIcon icon={alertCircleOutline} />
                                    </div>
                                    <div className="item-texto">
                                      <div className="item-titulo">Tarjetas</div>
                                      <div className="tarjetas-container">
                                        <div className="tarjeta amarilla">
                                          <span>{jugador.estadisticas.tarjetasAmarillas}</span>
                                        </div>
                                        <div className="tarjeta roja">
                                          <span>{jugador.estadisticas.tarjetasRojas}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="acordeon-acciones">
                              <IonButton 
                                expand="block" 
                                className="acordeon-btn"
                                onClick={() => {
                                  setJugadorSeleccionado(jugador.id);
                                  
                                  // Desplazarse suavemente a la sección de estadísticas individuales
                                  const estadisticasIndividuales = document.getElementById('estadisticas-individuales');
                                  if (estadisticasIndividuales) {
                                    estadisticasIndividuales.scrollIntoView({ behavior: 'smooth' });
                                  }
                                }}
                              >
                                <IonIcon icon={statsChartOutline} slot="start" />
                                Ver análisis completo
                              </IonButton>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Estadísticas individuales */}
                    <div className="estadisticas-card" id="estadisticas-individuales">
                      <div className="card-header">
                        <div className="card-titulo">
                          <IonIcon icon={personOutline} />
                          <h2>Estadísticas individuales</h2>
                        </div>
                        <div className="card-acciones">
                          <IonSelect 
                            value={jugadorSeleccionado} 
                            onIonChange={e => setJugadorSeleccionado(e.detail.value)} 
                            interface="popover"
                            className="jugador-select"
                          >
                            {jugadores.map((jugador) => (
                              <IonSelectOption key={jugador.id} value={jugador.id}>{jugador.nombre}</IonSelectOption>
                            ))}
                          </IonSelect>
                        </div>
                      </div>
                      <div className="card-content">
                        {(() => {
                          const jugador = jugadores.find(j => j.id === jugadorSeleccionado);
                          if (!jugador) return null;
                          
                          return (
                            <div className="perfil-jugador">
                              <div className="perfil-header">
                                <div className="perfil-avatar">
                                  <IonIcon icon={personOutline} />
                                </div>
                                <div className="perfil-info">
                                  <h3 className="perfil-nombre">{jugador.nombre}</h3>
                                  <div className="perfil-posicion">{jugador.posicion}</div>
                                </div>
                              </div>
                              
                              <div className="perfil-contenido">
                                <div className="perfil-grafica">
                                  <Doughnut 
                                    data={obtenerDatosJugadorSeleccionado()} 
                                    options={opcionesComunes} 
                                  />
                                </div>
                                
                                <div className="perfil-estadisticas">
                                  <div className="estadistica-item">
                                    <div className="estadistica-icono partidos">
                                      <IonIcon icon={podiumOutline} />
                                    </div>
                                    <div className="estadistica-info">
                                      <div className="estadistica-valor">{jugador.estadisticas.partidosJugados}</div>
                                      <div className="estadistica-etiqueta">Partidos</div>
                                    </div>
                                  </div>
                                  
                                  <div className="estadistica-item">
                                    <div className="estadistica-icono minutos">
                                      <IonIcon icon={timeOutline} />
                                    </div>
                                    <div className="estadistica-info">
                                      <div className="estadistica-valor">{jugador.estadisticas.minutosJugados}</div>
                                      <div className="estadistica-etiqueta">Minutos</div>
                                    </div>
                                  </div>
                                  
                                  <div className="estadistica-item">
                                    <div className="estadistica-icono goles">
                                      <IonIcon icon={footballOutline} />
                                    </div>
                                    <div className="estadistica-info">
                                      <div className="estadistica-valor">{jugador.estadisticas.goles}</div>
                                      <div className="estadistica-etiqueta">Goles</div>
                                    </div>
                                  </div>
                                  
                                  <div className="estadistica-item">
                                    <div className="estadistica-icono asistencias">
                                      <IonIcon icon={peopleOutline} />
                                    </div>
                                    <div className="estadistica-info">
                                      <div className="estadistica-valor">{jugador.estadisticas.asistencias}</div>
                                      <div className="estadistica-etiqueta">Asistencias</div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="perfil-metricas">
                                  <div className="metrica">
                                    <div className="metrica-titulo">
                                      <span>Minutos por partido</span>
                                      <span className="metrica-valor">
                                        {(jugador.estadisticas.minutosJugados / jugador.estadisticas.partidosJugados).toFixed(1)}
                                      </span>
                                    </div>
                                    <div className="metrica-barra-container">
                                      <div 
                                        className="metrica-barra" 
                                        style={{ 
                                          width: `${((jugador.estadisticas.minutosJugados / jugador.estadisticas.partidosJugados) / 90) * 100}%` 
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                  
                                  <div className="metrica">
                                    <div className="metrica-titulo">
                                      <span>Goles por partido</span>
                                      <span className="metrica-valor">
                                        {(jugador.estadisticas.goles / jugador.estadisticas.partidosJugados).toFixed(2)}
                                      </span>
                                    </div>
                                    <div className="metrica-barra-container">
                                      <div 
                                        className="metrica-barra" 
                                        style={{ 
                                          width: `${(jugador.estadisticas.goles / jugador.estadisticas.partidosJugados) * 100}%` 
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                  
                                  <div className="metrica">
                                    <div className="metrica-titulo">
                                      <span>Tarjetas amarillas</span>
                                      <span className="metrica-valor">
                                        {jugador.estadisticas.tarjetasAmarillas}
                                      </span>
                                    </div>
                                    <div className="metrica-barra-container">
                                      <div 
                                        className="metrica-barra tarjetas" 
                                        style={{ 
                                          width: `${(jugador.estadisticas.tarjetasAmarillas / 10) * 100}%` 
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
                
                <Footer />
              </>
            )}
          </div>
        )}
        
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default EntrenadorEstadisticas;