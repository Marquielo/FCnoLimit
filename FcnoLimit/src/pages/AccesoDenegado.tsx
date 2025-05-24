import React from 'react';
import { 
  IonPage, 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle,
  IonButton,
  IonIcon
} from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

const AccesoDenegado: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Acceso Denegado</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Acceso Denegado</h2>
          <p>No tienes permisos para acceder a esta página.</p>
          <p>Si crees que esto es un error, contacta al administrador del sistema.</p>
          <IonButton 
            expand="block" 
            onClick={() => history.push('/inicio')}
            className="mt-4"
          >
            <IonIcon icon={arrowBackOutline} slot="start" />
            Volver al inicio
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AccesoDenegado;