import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonProgressBar,
  IonBadge
} from '@ionic/react';
import { 
  statsChart, 
  trophy, 
  football,
  medal,
  trendingUp,
  timer
} from 'ionicons/icons';

const MobileEstadisticas: React.FC = () => {
  const [segmentValue, setSegmentValue] = useState<string>('general');

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Estadísticas</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Estadísticas</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* Segmento para filtrar estadísticas */}
        <div className="ion-padding-top">
          <IonSegment 
            value={segmentValue} 
            onIonChange={(e) => setSegmentValue(e.detail.value as string)}
          >
            <IonSegmentButton value="general">
              <IonLabel>General</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="equipos">
              <IonLabel>Equipos</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="jugadores">
              <IonLabel>Jugadores</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>

        <div className="ion-padding">
          
          {/* Estadísticas Generales */}
          {segmentValue === 'general' && (
            <>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    <IonIcon icon={statsChart} /> Resumen de la Liga
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonGrid>
                    <IonRow>
                      <IonCol size="6" className="ion-text-center">
                        <h2 style={{ margin: 0, color: 'var(--ion-color-primary)' }}>42</h2>
                        <p style={{ margin: 0, fontSize: '14px' }}>Partidos Jugados</p>
                      </IonCol>
                      <IonCol size="6" className="ion-text-center">
                        <h2 style={{ margin: 0, color: 'var(--ion-color-secondary)' }}>18</h2>
                        <p style={{ margin: 0, fontSize: '14px' }}>Partidos Pendientes</p>
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol size="6" className="ion-text-center">
                        <h2 style={{ margin: 0, color: 'var(--ion-color-success)' }}>16</h2>
                        <p style={{ margin: 0, fontSize: '14px' }}>Equipos Activos</p>
                      </IonCol>
                      <IonCol size="6" className="ion-text-center">
                        <h2 style={{ margin: 0, color: 'var(--ion-color-warning)' }}>3</h2>
                        <p style={{ margin: 0, fontSize: '14px' }}>Divisiones</p>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCardContent>
              </IonCard>

              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    <IonIcon icon={trendingUp} /> Estadísticas de Goles
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span>Promedio de goles por partido</span>
                      <IonBadge color="primary">2.8</IonBadge>
                    </div>
                    <IonProgressBar value={0.7} color="primary"></IonProgressBar>
                  </div>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span>Partidos con más de 3 goles</span>
                      <IonBadge color="secondary">65%</IonBadge>
                    </div>
                    <IonProgressBar value={0.65} color="secondary"></IonProgressBar>
                  </div>
                </IonCardContent>
              </IonCard>
            </>
          )}

          {/* Estadísticas de Equipos */}
          {segmentValue === 'equipos' && (
            <>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    <IonIcon icon={trophy} /> Top Equipos
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <IonBadge color="warning" style={{ marginRight: '10px' }}>1</IonBadge>
                        <span>Equipo Ejemplo 1</span>
                      </div>
                      <IonBadge color="success">15 pts</IonBadge>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <IonBadge color="medium" style={{ marginRight: '10px' }}>2</IonBadge>
                        <span>Equipo Ejemplo 2</span>
                      </div>
                      <IonBadge color="success">12 pts</IonBadge>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <IonBadge color="tertiary" style={{ marginRight: '10px' }}>3</IonBadge>
                        <span>Equipo Ejemplo 3</span>
                      </div>
                      <IonBadge color="success">10 pts</IonBadge>
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>

              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    <IonIcon icon={football} /> Mejor Ataque y Defensa
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <div style={{ marginBottom: '15px' }}>
                    <h4 style={{ color: 'var(--ion-color-success)' }}>🥅 Mejor Ataque</h4>
                    <p>Equipo Ejemplo 1 - 25 goles</p>
                  </div>
                  
                  <div>
                    <h4 style={{ color: 'var(--ion-color-primary)' }}>🛡️ Mejor Defensa</h4>
                    <p>Equipo Ejemplo 2 - 8 goles recibidos</p>
                  </div>
                </IonCardContent>
              </IonCard>
            </>
          )}

          {/* Estadísticas de Jugadores */}
          {segmentValue === 'jugadores' && (
            <>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    <IonIcon icon={medal} /> Top Goleadores
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <IonBadge color="warning" style={{ marginRight: '10px' }}>1</IonBadge>
                        <span>Jugador Ejemplo 1</span>
                      </div>
                      <IonBadge color="success">⚽ 12</IonBadge>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <IonBadge color="medium" style={{ marginRight: '10px' }}>2</IonBadge>
                        <span>Jugador Ejemplo 2</span>
                      </div>
                      <IonBadge color="success">⚽ 9</IonBadge>
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <IonBadge color="tertiary" style={{ marginRight: '10px' }}>3</IonBadge>
                        <span>Jugador Ejemplo 3</span>
                      </div>
                      <IonBadge color="success">⚽ 7</IonBadge>
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>

              <IonCard>
                <IonCardContent>
                  <p style={{ 
                    textAlign: 'center', 
                    color: 'var(--ion-color-medium)',
                    fontStyle: 'italic' 
                  }}>
                    💡 Las estadísticas de jugadores se actualizan después de cada partido
                  </p>
                </IonCardContent>
              </IonCard>
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MobileEstadisticas;
