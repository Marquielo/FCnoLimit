import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonSegment,
  IonSegmentButton,
} from '@ionic/react';
import { calendar, time, location, person, checkmarkCircle } from 'ionicons/icons';

// Tipos para nuestros datos
interface Entrenamiento {
  id: number;
  titulo: string;
  fecha: string;
  hora: string;
  lugar: string;
  entrenador: string;
  descripcion: string;
  completado: boolean;
}

const JugadorEntrenamientos: React.FC = () => {
  const [segmento, setSegmento] = useState<'proximos' | 'completados'>('proximos');
  const [entrenamientos, setEntrenamientos] = useState<Entrenamiento[]>([]);

  // Simulamos la carga de datos
  useEffect(() => {
    // Aquí normalmente cargarías los datos desde tu API
    const datosEjemplo: Entrenamiento[] = [
      {
        id: 1,
        titulo: 'Entrenamiento de Resistencia',
        fecha: '24/05/2025',
        hora: '18:00 - 19:30',
        lugar: 'Campo Principal',
        entrenador: 'Carlos Pérez',
        descripcion: 'Ejercicios para mejorar la resistencia y el ritmo de juego.',
        completado: false
      },
      {
        id: 2,
        titulo: 'Táctica Defensiva',
        fecha: '26/05/2025',
        hora: '17:30 - 19:00',
        lugar: 'Campo Auxiliar',
        entrenador: 'María Gómez',
        descripcion: 'Trabajo en equipo para mejorar la coordinación defensiva.',
        completado: false
      },
      {
        id: 3,
        titulo: 'Técnica Individual',
        fecha: '20/05/2025',
        hora: '18:00 - 19:30',
        lugar: 'Gimnasio',
        entrenador: 'Carlos Pérez',
        descripcion: 'Ejercicios para mejorar el control de balón y la precisión en el pase.',
        completado: true
      },
      {
        id: 4,
        titulo: 'Preparación Física',
        fecha: '18/05/2025',
        hora: '17:00 - 18:30',
        lugar: 'Campo Principal',
        entrenador: 'Ana Martínez',
        descripcion: 'Ejercicios de fuerza y acondicionamiento físico general.',
        completado: true
      }
    ];

    setEntrenamientos(datosEjemplo);
  }, []);

  // Filtrar por segmento seleccionado
  const entrenamientosFiltrados = entrenamientos.filter(
    entrenamiento => segmento === 'proximos' ? !entrenamiento.completado : entrenamiento.completado
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Mis Entrenamientos</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        <IonSegment value={segmento} onIonChange={e => setSegmento(e.detail.value as 'proximos' | 'completados')}>
          <IonSegmentButton value="proximos">
            <IonLabel>Próximos</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="completados">
            <IonLabel>Completados</IonLabel>
          </IonSegmentButton>
        </IonSegment>
        
        <IonGrid>
          <IonRow>
            {entrenamientosFiltrados.length === 0 ? (
              <IonCol>
                <IonCard>
                  <IonCardContent className="ion-text-center">
                    {segmento === 'proximos' ? 
                      'No tienes entrenamientos próximos programados' : 
                      'No tienes entrenamientos completados'}
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ) : (
              entrenamientosFiltrados.map(entrenamiento => (
                <IonCol size="12" size-md="6" key={entrenamiento.id}>
                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>{entrenamiento.titulo}</IonCardTitle>
                      {entrenamiento.completado && (
                        <IonBadge color="success" style={{ marginTop: '5px' }}>
                          <IonIcon icon={checkmarkCircle} /> Completado
                        </IonBadge>
                      )}
                    </IonCardHeader>
                    
                    <IonCardContent>
                      <IonList lines="none">
                        <IonItem>
                          <IonIcon icon={calendar} slot="start" color="primary" />
                          <IonLabel>
                            <h3>Fecha</h3>
                            <p>{entrenamiento.fecha}</p>
                          </IonLabel>
                        </IonItem>
                        
                        <IonItem>
                          <IonIcon icon={time} slot="start" color="primary" />
                          <IonLabel>
                            <h3>Hora</h3>
                            <p>{entrenamiento.hora}</p>
                          </IonLabel>
                        </IonItem>
                        
                        <IonItem>
                          <IonIcon icon={location} slot="start" color="primary" />
                          <IonLabel>
                            <h3>Lugar</h3>
                            <p>{entrenamiento.lugar}</p>
                          </IonLabel>
                        </IonItem>
                        
                        <IonItem>
                          <IonIcon icon={person} slot="start" color="primary" />
                          <IonLabel>
                            <h3>Entrenador</h3>
                            <p>{entrenamiento.entrenador}</p>
                          </IonLabel>
                        </IonItem>
                      </IonList>
                      
                      <p style={{ marginTop: '10px' }}>{entrenamiento.descripcion}</p>
                      
                      {!entrenamiento.completado && (
                        <div className="ion-text-end ion-margin-top">
                          <IonButton fill="outline">Ver detalles</IonButton>
                        </div>
                      )}
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              ))
            )}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default JugadorEntrenamientos;