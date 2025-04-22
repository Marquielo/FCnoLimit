import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import './ComparativaPage.css';

const ComparativasPage: React.FC = () => (
  <IonPage>
    <div className="page-container">
      <IonContent fullscreen>
        <h1>Comparativas</h1>
        <p>Compara estadísticas entre equipos y jugadores.</p>
      </IonContent>
    </div>
  </IonPage>
);

export default ComparativasPage;