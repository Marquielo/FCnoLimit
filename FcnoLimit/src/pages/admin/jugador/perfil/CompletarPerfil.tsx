import React, { useState, useEffect } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonButton,
  IonLoading,
  IonAlert
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import NavBar from '../../../../components/NavBar';
import Footer from '../../../../components/Footer';

const CompletarPerfilJugador: React.FC = () => {
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
      <NavBar />
      <IonContent fullscreen>
        <div className="perfil-wrapper">
          <div className="perfil-container">
            <div className="perfil-header">
              <div className="avatar-container">
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(usuario?.nombre_completo || "Jugador")}&background=0D8ABC&color=fff&size=128`} 
                  alt="Avatar" 
                  className="perfil-avatar" 
                />
              </div>
              <div className="perfil-title">
                <h1>Completa tu perfil de jugador</h1>
                <p className="subtitle">Hola, {usuario?.nombre_completo || 'Jugador'}. Completa la siguiente información para personalizar tu perfil.</p>
              </div>
            </div>
            
            <div className="form-sections">
              {/* Aquí irían los campos del formulario organizados en secciones */}
              <div className="form-section">
                <div className="section-header">
                  <h2>Datos personales</h2>
                </div>
                <div className="form-container">
                  {/* Formulario de datos personales, estadísticas, posición, etc. */}
                </div>
              </div>
              
              {/* Ejemplo de otra sección */}
              <div className="form-section">
                <div className="section-header">
                  <h2>Características de juego</h2>
                </div>
                <div className="form-row">
                  {/* Campos específicos para características de juego */}
                </div>
              </div>
              
              <div className="form-actions">
                <IonButton 
                  expand="block" 
                  onClick={handleCompletarPerfil} 
                  className="save-button"
                >
                  Guardar Perfil
                </IonButton>
                <p className="disclaimer">
                  <small>Todos los campos son importantes para crear tu perfil completo</small>
                </p>
              </div>
            </div>
          </div>

          <IonLoading
            isOpen={showLoading}
            message={'Guardando información...'}
            spinner="crescent"
          />
          
          <IonAlert
            isOpen={showAlert}
            header={'¡Perfil actualizado!'}
            message={'Tu información se ha guardado correctamente.'}
            buttons={[{
              text: 'Continuar',
              handler: () => {
                history.push('/jugador/perfil');
              }
            }]}
            onDidDismiss={() => setShowAlert(false)}
          />
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default CompletarPerfilJugador;