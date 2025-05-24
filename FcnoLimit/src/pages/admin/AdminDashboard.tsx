import React from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonButton,
  IonIcon
} from '@ionic/react';
import { 
  peopleOutline, 
  footballOutline, 
  calendarOutline, 
  trophyOutline, 
  newspaperOutline, 
  settingsOutline 
} from 'ionicons/icons';

const AdminDashboard: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Panel de Administración</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h1>Bienvenido, Administrador</h1>
        <p>Gestiona todos los aspectos de FCnoLimit desde este panel.</p>

        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="6" sizeLg="4">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Gestión de Usuarios</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>Administra jugadores, entrenadores y otros usuarios del sistema.</p>
                  <IonButton expand="block" fill="outline">
                    <IonIcon slot="start" icon={peopleOutline} />
                    Gestionar Usuarios
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="6" sizeLg="4">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Gestión de Equipos</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>Administra los equipos, sus plantillas y configuraciones.</p>
                  <IonButton expand="block" fill="outline">
                    <IonIcon slot="start" icon={footballOutline} />
                    Gestionar Equipos
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="6" sizeLg="4">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Gestión de Partidos</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>Programa, edita y revisa los resultados de los partidos.</p>
                  <IonButton expand="block" fill="outline">
                    <IonIcon slot="start" icon={calendarOutline} />
                    Gestionar Partidos
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="6" sizeLg="4">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Gestión de Campeonatos</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>Configura y administra los campeonatos y torneos.</p>
                  <IonButton expand="block" fill="outline">
                    <IonIcon slot="start" icon={trophyOutline} />
                    Gestionar Campeonatos
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="6" sizeLg="4">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Gestión de Noticias</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>Publica y edita noticias relacionadas con el club.</p>
                  <IonButton expand="block" fill="outline">
                    <IonIcon slot="start" icon={newspaperOutline} />
                    Gestionar Noticias
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="6" sizeLg="4">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Configuración del Sistema</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>Ajusta la configuración general del sistema.</p>
                  <IonButton expand="block" fill="outline">
                    <IonIcon slot="start" icon={settingsOutline} />
                    Configuración
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default AdminDashboard;