import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import './PartidosPage.css';

const PartidosPage: React.FC = () => (
  <IonPage>
    <div className="page-container">
      <IonContent fullscreen>
        <h1>Partidos</h1>
        <p>Consulta información y estadísticas de los partidos.</p>
      </IonContent>
    </div>
  </IonPage>
);

export default PartidosPage;
