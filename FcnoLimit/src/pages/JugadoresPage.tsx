import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import './JugadoresPage.css';

const JugadoresPage: React.FC = () => (
  <IonPage>
    <div className="page-container">
      <IonContent fullscreen>
        <h1>Jugadores</h1>
        <p>Consulta información y estadísticas de los jugadores.</p>
      </IonContent>
    </div>
  </IonPage>
);

export default JugadoresPage;