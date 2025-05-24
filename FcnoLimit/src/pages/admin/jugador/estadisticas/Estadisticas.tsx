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
  IonGrid,
  IonRow,
  IonCol,
  IonLoading,
  IonBadge,
  IonItem,
  IonLabel,
  IonChip,
  IonIcon,
  IonToast
} from '@ionic/react';
import { 
  footballOutline, 
  statsChartOutline, 
  trophyOutline,
  timeOutline,
  warningOutline,
  pulseOutline
} from 'ionicons/icons';
import './Estadisticas.css';

interface EstadisticasJugador {
  partidos_jugados: number;
  goles: number;
  asistencias: number;
  tarjetas_amarillas: number;
  tarjetas_rojas: number;
  minutos_jugados: number;
  porcentaje_titularidad: number;
  efectividad_goleadora: number;
  ultimos_partidos: Array<{
    fecha: string;
    rival: string;
    goles: number;
    asistencias: number;
    minutos: number;
    resultado: 'victoria' | 'derrota' | 'empate';
  }>;
}

const JugadorEstadisticas: React.FC = () => {
  const [estadisticas, setEstadisticas] = useState<EstadisticasJugador | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState('danger');

  useEffect(() => {
    fetchEstadisticas();
  }, []);

  const fetchEstadisticas = async () => {
    setLoading(true);
    try {
      const userJSON = localStorage.getItem('usuario');
      if (!userJSON) throw new Error('No se encontró la sesión del usuario');
      
      const user = JSON.parse(userJSON);
      
      // En un entorno real, aquí haríamos la llamada a la API
      // const response = await fetch(`https://fcnolimit-back.onrender.com/api/jugadores/${user.id}/estadisticas`);
      // const data = await response.json();
      // setEstadisticas(data);
      
      // Simulamos datos para desarrollo
      setTimeout(() => {
        setEstadisticas({
          partidos_jugados: 24,
          goles: 12,
          asistencias: 8,
          tarjetas_amarillas: 3,
          tarjetas_rojas: 0,
          minutos_jugados: 1850,
          porcentaje_titularidad: 85,
          efectividad_goleadora: 0.5, // goles por partido
          ultimos_partidos: [
            {
              fecha: '2023-05-12',
              rival: 'Equipo Azul',
              goles: 2,
              asistencias: 1,
              minutos: 90,
              resultado: 'victoria'
            },
            {
              fecha: '2023-05-05',
              rival: 'Equipo Rojo',
              goles: 0,
              asistencias: 2,
              minutos: 90,
              resultado: 'empate'
            },
            {
              fecha: '2023-04-28',
              rival: 'Equipo Verde',
              goles: 1,
              asistencias: 0,
              minutos: 70,
              resultado: 'victoria'
            },
            {
              fecha: '2023-04-21',
              rival: 'Equipo Negro',
              goles: 0,
              asistencias: 0,
              minutos: 45,
              resultado: 'derrota'
            }
          ]
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error al cargar estadísticas del jugador:', error);
      setToastMessage('Error al cargar los datos. Intente nuevamente.');
      setToastColor('danger');
      setShowToast(true);
      setLoading(false);
    }
  };

  const getResultadoBadgeColor = (resultado: string) => {
    switch (resultado) {
      case 'victoria': return 'success';
      case 'empate': return 'warning';
      case 'derrota': return 'danger';
      default: return 'medium';
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mis Estadísticas</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        <IonLoading isOpen={loading} message={'Cargando estadísticas...'} />
        
        {estadisticas && (
          <>
            <IonGrid>
              <IonRow>
                <IonCol sizeMd="6" size="12">
                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>
                        <IonIcon icon={statsChartOutline} className="ion-margin-end" /> 
                        Resumen Temporada
                      </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <div className="stats-grid">
                        <div className="stat-item">
                          <div className="stat-value">{estadisticas.partidos_jugados}</div>
                          <div className="stat-label">Partidos</div>
                        </div>
                        <div className="stat-item highlight">
                          <div className="stat-value">{estadisticas.goles}</div>
                          <div className="stat-label">Goles</div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-value">{estadisticas.asistencias}</div>
                          <div className="stat-label">Asistencias</div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-value">{Math.round(estadisticas.minutos_jugados / 60)}</div>
                          <div className="stat-label">Horas jugadas</div>
                        </div>
                        <div className="stat-item warning">
                          <div className="stat-value">{estadisticas.tarjetas_amarillas}</div>
                          <div className="stat-label">T. Amarillas</div>
                        </div>
                        <div className="stat-item danger">
                          <div className="stat-value">{estadisticas.tarjetas_rojas}</div>
                          <div className="stat-label">T. Rojas</div>
                        </div>
                      </div>
                    </IonCardContent>
                  </IonCard>

                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>
                        <IonIcon icon={pulseOutline} className="ion-margin-end" />
                        Rendimiento
                      </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <IonItem lines="full">
                        <IonLabel>Titularidad</IonLabel>
                        <IonChip color="primary">{estadisticas.porcentaje_titularidad}%</IonChip>
                      </IonItem>
                      <IonItem lines="full">
                        <IonLabel>Efectividad goleadora</IonLabel>
                        <IonChip color="success">{estadisticas.efectividad_goleadora} goles/partido</IonChip>
                      </IonItem>
                      <IonItem>
                        <IonLabel>Promedio minutos</IonLabel>
                        <IonChip color="tertiary">
                          {Math.round(estadisticas.minutos_jugados / estadisticas.partidos_jugados)} min/partido
                        </IonChip>
                      </IonItem>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
                
                <IonCol sizeMd="6" size="12">
                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>
                        <IonIcon icon={footballOutline} className="ion-margin-end" />
                        Últimos Partidos
                      </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      {estadisticas.ultimos_partidos.map((partido, index) => (
                        <div key={index} className="partido-item">
                          <div className="partido-header">
                            <div className="partido-fecha">
                              <IonIcon icon={timeOutline} />
                              {new Date(partido.fecha).toLocaleDateString()}
                            </div>
                            <IonBadge color={getResultadoBadgeColor(partido.resultado)}>
                              {partido.resultado === 'victoria' ? 'Victoria' : 
                                partido.resultado === 'empate' ? 'Empate' : 'Derrota'}
                            </IonBadge>
                          </div>
                          <div className="partido-rival">vs {partido.rival}</div>
                          <div className="partido-stats">
                            <div className="partido-stat">
                              <span className="partido-stat-value">{partido.goles}</span>
                              <span className="partido-stat-label">Goles</span>
                            </div>
                            <div className="partido-stat">
                              <span className="partido-stat-value">{partido.asistencias}</span>
                              <span className="partido-stat-label">Asistencias</span>
                            </div>
                            <div className="partido-stat">
                              <span className="partido-stat-value">{partido.minutos}'</span>
                              <span className="partido-stat-label">Minutos</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>
            </IonGrid>
          </>
        )}

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          color={toastColor}
        />
      </IonContent>
    </IonPage>
  );
};

export default JugadorEstadisticas;