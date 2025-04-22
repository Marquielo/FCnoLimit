import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import './EquiposPage.css';

const EquiposPage: React.FC = () => (
  <IonPage>
    <div className="page-container">
      <IonContent fullscreen>
        <h1>Equipos</h1>
        <p>Consulta información y estadísticas de los equipos.</p>
      </IonContent>
    </div>
  </IonPage>
);

export default EquiposPage;