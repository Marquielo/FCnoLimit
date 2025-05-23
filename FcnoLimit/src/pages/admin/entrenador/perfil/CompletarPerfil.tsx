import React, { useState, useEffect } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle,
  IonButton,
  IonLoading,
  IonAlert
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

const CompletarPerfilEntrenador: React.FC = () => {
  const history = useHistory();
  const [usuario, setUsuario] = useState<any>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const userJSON = localStorage.getItem('usuario');
    if (userJSON) {
      setUsuario(JSON.parse(userJSON));
    }
  }, []);

  const handleCompletarPerfil = () => {
    setShowLoading(true);
    // Aquí iría la lógica para guardar los datos del perfil
    setTimeout(() => {
      setShowLoading(false);
      setShowAlert(true);
    }, 1500);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Completar Perfil de Entrenador</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>Bienvenido, {usuario?.nombre_completo || 'Entrenador'}!</h2>
        <p>Para completar tu registro, necesitamos algunos datos adicionales.</p>
        
        {/* Aquí irían los campos del formulario */}
        <div className="form-container">
          {/* Formulario de experiencia, especialización, certificaciones, etc. */}
        </div>
        
        <IonButton expand="block" onClick={handleCompletarPerfil}>
          Guardar Perfil
        </IonButton>
        
        <IonLoading
          isOpen={showLoading}
          message={'Guardando información...'}
        />
        
        <IonAlert
          isOpen={showAlert}
          header={'¡Perfil actualizado!'}
          message={'Tu información se ha guardado correctamente.'}
          buttons={[{
            text: 'Continuar',
            handler: () => {
              history.push('/entrenador/perfil');
            }
          }]}
          onDidDismiss={() => setShowAlert(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default CompletarPerfilEntrenador;