import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import './ClasificacionesPage.css';

const ClasificacionesPage: React.FC = () => (
  <IonPage>
    <div className="page-container">
      <IonContent fullscreen>
        <h1>Clasificaciones</h1>
        <p>Revisa las tablas de posiciones de ligas y torneos.</p>
      </IonContent>
    </div>
  </IonPage>
);

export default ClasificacionesPage;