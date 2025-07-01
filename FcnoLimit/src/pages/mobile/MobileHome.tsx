import React from 'react';
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
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonButton,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail
} from '@ionic/react';
import { football, trophy, calendar, time, statsChart, bug } from 'ionicons/icons';

const MobileHome: React.FC = () => {
  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    setTimeout(() => {
      event.detail.complete();
    }, 2000);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>FCnoLimit</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">FCnoLimit</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="ion-padding">
          {/* Tarjeta de bienvenida */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle color="primary">🏆 Bienvenido a FCnoLimit</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              Tu aplicación de gestión de fútbol favorita. Mantente al día con todos los partidos, equipos y estadísticas.
            </IonCardContent>
          </IonCard>

          {/* Grid de acciones rápidas */}
          <IonGrid>
            <IonRow>
              <IonCol size="6">
                <IonCard button routerLink="/mobile/partidos" className="ion-activatable">
                  <IonCardContent className="ion-text-center">
                    <IonIcon icon={football} size="large" color="primary" />
                    <h3>Partidos</h3>
                    <p>Ver todos los partidos</p>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              <IonCol size="6">
                <IonCard button routerLink="/mobile/equipos" className="ion-activatable">
                  <IonCardContent className="ion-text-center">
                    <IonIcon icon={trophy} size="large" color="secondary" />
                    <h3>Equipos</h3>
                    <p>Explorar equipos</p>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="6">
                <IonCard button routerLink="/mobile/estadisticas" className="ion-activatable">
                  <IonCardContent className="ion-text-center">
                    <IonIcon icon={statsChart} size="large" color="tertiary" />
                    <h3>Estadísticas</h3>
                    <p>Ver estadísticas</p>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              <IonCol size="6">
                <IonCard button routerLink="/mobile/calendario" className="ion-activatable">
                  <IonCardContent className="ion-text-center">
                    <IonIcon icon={calendar} size="large" color="success" />
                    <h3>Calendario</h3>
                    <p>Ver calendario</p>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>

          {/* Información de partidos próximos */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>⚽ Partidos Destacados</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <IonIcon icon={time} color="medium" style={{ marginRight: '8px' }} />
                <span>Próximos partidos disponibles en la sección de partidos</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <IonIcon icon={calendar} color="medium" style={{ marginRight: '8px' }} />
                <span>Consulta el calendario completo de la liga</span>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Botón de acción principal */}
          <div className="ion-text-center ion-margin-top">
            <IonButton expand="block" routerLink="/mobile/partidos" fill="solid" color="primary">
              <IonIcon icon={football} slot="start" />
              Ver Todos los Partidos
            </IonButton>
            
            {/* Botón de debug */}
            <IonButton expand="block" routerLink="/mobile/debug" fill="outline" color="medium" className="ion-margin-top">
              <IonIcon icon={bug} slot="start" />
              Debug Info (Dev)
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MobileHome;
