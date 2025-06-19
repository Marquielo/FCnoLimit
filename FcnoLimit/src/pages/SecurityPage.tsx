import React from 'react';
import { 
  IonContent, 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle,
  IonCard, 
  IonCardHeader, 
  IonCardContent,
  IonIcon
} from '@ionic/react';
import { shieldCheckmarkOutline } from 'ionicons/icons';
import NavBar from '../components/NavBar';
import SessionManager from '../components/SessionManager';
import TokenNotification from '../components/TokenNotification';

const SecurityPage: React.FC = () => {
  return (
    <IonPage>
      <NavBar />
      <IonHeader>
        <IonToolbar>
          <IonTitle>Seguridad y Sesiones</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        <TokenNotification />
        
        <IonCard>
          <IonCardHeader>
            <h2>
              <IonIcon icon={shieldCheckmarkOutline} /> 
              Centro de Seguridad
            </h2>
          </IonCardHeader>
          <IonCardContent>
            <p>
              Gestiona tu seguridad y privacidad. Aquí puedes ver tus sesiones activas, 
              cerrar sesiones en dispositivos que ya no uses, y monitorear la actividad de tu cuenta.
            </p>
          </IonCardContent>
        </IonCard>

        <SessionManager />
      </IonContent>
    </IonPage>
  );
};

export default SecurityPage;
