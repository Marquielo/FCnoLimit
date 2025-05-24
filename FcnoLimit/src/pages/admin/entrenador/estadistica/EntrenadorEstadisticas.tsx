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
  ChartData 
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

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

const EntrenadorEstadisticas: React.FC = () => {
  const [segmento, setSegmento] = useState<'equipo' | 'jugadores'>('equipo');
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [equipoStats, setEquipoStats] = useState<EquipoEstadisticas | null>(null);
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState<number | null>(null);
  const [filtro, setFiltro] = useState<'todos' | 'goles' | 'asistencias' | 'minutos'>('todos');
  const [pieData, setPieData] = useState<ChartData<'pie', number[], string>>({
    labels: [],
    datasets: [{
      label: 'Sin datos',
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 1
    }]
  });

  // Carga simulada de datos
  useEffect(() => {
    // Aquí normalmente cargarías los datos desde tu API
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
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
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
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
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
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Asistencias',
        data: jugadores.map(j => j.estadisticas.asistencias),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      }
    ],
  };

  // Datos para la gráfica individual de jugador
  const obtenerDatosJugadorSeleccionado = (): ChartData<'pie', number[], string> => {
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
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(255, 99, 132, 0.6)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1,
        },
      ],
    };
  };
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Estadísticas</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonSegment value={segmento} onIonChange={e => setSegmento(e.detail.value as 'equipo' | 'jugadores')}>
          <IonSegmentButton value="equipo">
            <IonLabel>Equipo</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="jugadores">
            <IonLabel>Jugadores</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {segmento === 'equipo' && equipoStats && (
          <div className="ion-padding">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Resultados del equipo</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div style={{ height: '250px' }}>
                  <Pie data={datosResultados} options={{ maintainAspectRatio: false }} />
                </div>
              </IonCardContent>
            </IonCard>

            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Estadísticas generales</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonGrid>
                  <IonRow>
                    <IonCol size="6">
                      <strong>Partidos jugados:</strong> {equipoStats.victorias + equipoStats.empates + equipoStats.derrotas}
                    </IonCol>
                    <IonCol size="6">
                      <strong>Victorias:</strong> {equipoStats.victorias}
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol size="6">
                      <strong>Empates:</strong> {equipoStats.empates}
                    </IonCol>
                    <IonCol size="6">
                      <strong>Derrotas:</strong> {equipoStats.derrotas}
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol size="6">
                      <strong>Goles a favor:</strong> {equipoStats.golesFavor}
                    </IonCol>
                    <IonCol size="6">
                      <strong>Goles en contra:</strong> {equipoStats.golesContra}
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol size="6">
                      <strong>Posesión promedio:</strong> {equipoStats.posesionPromedio}%
                    </IonCol>
                    <IonCol size="6">
                      <strong>Efectividad en pases:</strong> {equipoStats.efectividadPases}%
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCardContent>
            </IonCard>

            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Balance de goles</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div style={{ height: '250px' }}>
                  <Bar 
                    data={datosGoles} 
                    options={{ 
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }} 
                  />
                </div>
              </IonCardContent>
            </IonCard>
          </div>
        )}

        {segmento === 'jugadores' && (
          <div className="ion-padding">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Comparativa de jugadores</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonItem>
                  <IonLabel>Filtrar por:</IonLabel>
                  <IonSelect value={filtro} onIonChange={e => setFiltro(e.detail.value)} interface="popover">
                    <IonSelectOption value="todos">Todos</IonSelectOption>
                    <IonSelectOption value="goles">Goles (mayor a menor)</IonSelectOption>
                    <IonSelectOption value="asistencias">Asistencias (mayor a menor)</IonSelectOption>
                    <IonSelectOption value="minutos">Minutos jugados (mayor a menor)</IonSelectOption>
                  </IonSelect>
                </IonItem>
                
                <div style={{ height: '300px', marginTop: '15px' }}>
                  <Bar 
                    data={datosJugadores}
                    options={{ 
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }} 
                  />
                </div>
              </IonCardContent>
            </IonCard>

            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Estadísticas individuales</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonItem>
                  <IonLabel>Selecciona un jugador:</IonLabel>
                  <IonSelect value={jugadorSeleccionado} onIonChange={e => setJugadorSeleccionado(e.detail.value)} interface="popover">
                    {jugadores.map((jugador) => (
                      <IonSelectOption key={jugador.id} value={jugador.id}>{jugador.nombre}</IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
                
                {jugadorSeleccionado && (
                  <>
                    <div style={{ height: '250px', marginTop: '15px' }}>
                      <Pie 
                        data={obtenerDatosJugadorSeleccionado() as ChartData<'pie', number[], string>} 
                        options={{ maintainAspectRatio: false }} 
                      />
                    </div>
                    
                    {(() => {
                      const jugador = jugadores.find(j => j.id === jugadorSeleccionado);
                      if (!jugador) return null;
                      
                      return (
                        <IonGrid className="ion-margin-top">
                          <IonRow>
                            <IonCol size="12">
                              <h4>{jugador.nombre} - {jugador.posicion}</h4>
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size="6">
                              <strong>Partidos jugados:</strong> {jugador.estadisticas.partidosJugados}
                            </IonCol>
                            <IonCol size="6">
                              <strong>Minutos jugados:</strong> {jugador.estadisticas.minutosJugados}
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size="6">
                              <strong>Goles:</strong> {jugador.estadisticas.goles}
                            </IonCol>
                            <IonCol size="6">
                              <strong>Asistencias:</strong> {jugador.estadisticas.asistencias}
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size="6">
                              <strong>Tarjetas amarillas:</strong> {jugador.estadisticas.tarjetasAmarillas}
                            </IonCol>
                            <IonCol size="6">
                              <strong>Tarjetas rojas:</strong> {jugador.estadisticas.tarjetasRojas}
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size="6">
                              <strong>Promedio min/partido:</strong> {(jugador.estadisticas.minutosJugados / jugador.estadisticas.partidosJugados).toFixed(1)}
                            </IonCol>
                            <IonCol size="6">
                              <strong>Goles por partido:</strong> {(jugador.estadisticas.goles / jugador.estadisticas.partidosJugados).toFixed(2)}
                            </IonCol>
                          </IonRow>
                        </IonGrid>
                      );
                    })()}
                  </>
                )}
              </IonCardContent>
            </IonCard>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default EntrenadorEstadisticas;