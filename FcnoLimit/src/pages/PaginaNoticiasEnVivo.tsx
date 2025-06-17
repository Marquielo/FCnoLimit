import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonSegment, IonSegmentButton, IonLabel } from '@ionic/react';
import NoticiasEnVivo from '../components/NoticiasEnVivo';
import NoticiasGeneradasIA from '../components/NoticiasGeneradasIA';
import NoticiasRealesAPI from '../components/NoticiasRealesAPI';
import { getLiveEvents } from '../services/apiFootball';
import './PaginaNoticiasEnVivo.css';

const PaginaNoticiasEnVivo: React.FC = () => {
  const [segmentActivo, setSegmentActivo] = useState<string>('en-vivo');
  const [partidosData, setPartidosData] = useState<any[]>([]);

  useEffect(() => {
    const cargarPartidos = async () => {
      const partidos = await getLiveEvents();
      setPartidosData(partidos);
    };
    cargarPartidos();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Noticias Deportivas</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div style={{background: 'red', color: 'white', padding: 20, fontWeight: 'bold', fontSize: 18}}>
          DEBUG PÁGINA: PaginaNoticiasEnVivo se está renderizando
        </div>
        
        <IonSegment 
          value={segmentActivo} 
          onIonChange={e => setSegmentActivo(e.detail.value as string)}
          style={{ margin: '1rem' }}
        >
          <IonSegmentButton value="en-vivo">
            <IonLabel>Partidos en Vivo</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="noticias-ia">
            <IonLabel>Noticias IA</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="noticias-reales">
            <IonLabel>Noticias Reales</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {segmentActivo === 'en-vivo' && <NoticiasEnVivo />}
        {segmentActivo === 'noticias-ia' && <NoticiasGeneradasIA partidosData={partidosData} />}
        {segmentActivo === 'noticias-reales' && <NoticiasRealesAPI />}
      </IonContent>
    </IonPage>
  );
};

export default PaginaNoticiasEnVivo;
