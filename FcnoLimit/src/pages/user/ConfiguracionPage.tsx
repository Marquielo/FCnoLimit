import React, { useState, useEffect } from 'react';
import { 
  IonContent, 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle,
  IonCard, 
  IonCardHeader, 
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonToggle,
  IonButton,
  IonList,
  IonSelect,
  IonSelectOption
} from '@ionic/react';

const ConfiguracionPage: React.FC = () => {
  const [notificaciones, setNotificaciones] = useState(true);
  const [tema, setTema] = useState('claro');
  const [idioma, setIdioma] = useState('es');

  const guardarConfiguracion = () => {
    // Aquí iría la lógica para guardar la configuración
    console.log('Configuración guardada:', { notificaciones, tema, idioma });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Configuración</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonTitle size="large">Preferencias de usuario</IonTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem>
                <IonLabel>Notificaciones</IonLabel>
                <IonToggle 
                  checked={notificaciones} 
                  onIonChange={e => setNotificaciones(e.detail.checked)}
                />
              </IonItem>
              
              <IonItem>
                <IonLabel>Tema</IonLabel>
                <IonSelect value={tema} onIonChange={e => setTema(e.detail.value)}>
                  <IonSelectOption value="claro">Claro</IonSelectOption>
                  <IonSelectOption value="oscuro">Oscuro</IonSelectOption>
                </IonSelect>
              </IonItem>
              
              <IonItem>
                <IonLabel>Idioma</IonLabel>
                <IonSelect value={idioma} onIonChange={e => setIdioma(e.detail.value)}>
                  <IonSelectOption value="es">Español</IonSelectOption>
                  <IonSelectOption value="en">Inglés</IonSelectOption>
                </IonSelect>
              </IonItem>
            </IonList>

            <div className="ion-padding-top">
              <IonButton expand="block" onClick={guardarConfiguracion}>
                Guardar configuración
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default ConfiguracionPage;