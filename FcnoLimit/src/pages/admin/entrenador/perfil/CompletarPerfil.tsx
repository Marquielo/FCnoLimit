import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonLoading,
  IonAlert,
  IonIcon,
  IonChip,
  IonLabel
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { 
  personCircleOutline, 
  trophyOutline, 
  documentTextOutline, 
  schoolOutline,
  saveOutline
} from 'ionicons/icons';
import NavBar from '../../../../components/NavBar';
import Footer from "../../../../components/Footer";
import '../entrenador.css'; // Crearemos este archivo de estilos

const CompletarPerfilEntrenador: React.FC = () => {
  const history = useHistory();
  const [usuario, setUsuario] = useState<any>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  
  // Estados para los campos del formulario
  const [experiencia, setExperiencia] = useState<number | undefined>();
  const [especializacion, setEspecializacion] = useState<string>('');
  const [certificaciones, setCertificaciones] = useState<string>('');
  const [biografia, setBiografia] = useState<string>('');
  const [formValid, setFormValid] = useState<boolean>(false);

  useEffect(() => {
    const userJSON = localStorage.getItem('usuario');
    if (userJSON) {
      setUsuario(JSON.parse(userJSON));
    }
  }, []);

  // Validar formulario cuando cambien los campos
  useEffect(() => {
    const isValid = 
      experiencia !== undefined && 
      experiencia > 0 && 
      especializacion !== '' && 
      certificaciones.trim() !== '' && 
      biografia.trim() !== '';
    
    setFormValid(isValid);
  }, [experiencia, especializacion, certificaciones, biografia]);

  const handleCompletarPerfil = () => {
    if (!formValid) return;
    
    setShowLoading(true);
    // Aquí iría la lógica para guardar los datos del perfil
    const datosEntrenador = {
      experiencia,
      especializacion,
      certificaciones,
      biografia,
      userId: usuario?.id
    };
    
    console.log("Enviando datos:", datosEntrenador);
    
    // Simulación de envío al servidor
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
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(usuario?.nombre_completo || "Entrenador")}&background=0D8ABC&color=fff&size=128`} 
                  alt="Avatar" 
                  className="perfil-avatar" 
                />
              </div>
              <div className="perfil-title">
                <h1>Completa tu perfil de entrenador</h1>
                <p className="subtitle">Hola, {usuario?.nombre_completo || 'Entrenador'}. Completa la siguiente información para personalizar tu perfil.</p>
              </div>
            </div>
            
            <div className="form-sections">
              {/* Sección 1: Información profesional */}
              <div className="form-section">
                <div className="section-header">
                  <IonIcon icon={personCircleOutline} className="section-icon" />
                  <h2>Información profesional</h2>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="experiencia">Años de experiencia <span className="required">*</span></label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="experiencia" 
                      placeholder="Ej: 5" 
                      value={experiencia || ''} 
                      onChange={(e) => setExperiencia(e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="especializacion">Especialización <span className="required">*</span></label>
                    <select 
                      className="form-select" 
                      id="especializacion" 
                      value={especializacion} 
                      onChange={(e) => setEspecializacion(e.target.value)}
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="tactico">Entrenador táctico</option>
                      <option value="preparador">Preparador físico</option>
                      <option value="porteros">Entrenador de porteros</option>
                      <option value="juvenil">Entrenador juvenil</option>
                      <option value="analista">Analista deportivo</option>
                      <option value="general">Entrenador general</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Sección 2: Formación y certificaciones */}
              <div className="form-section">
                <div className="section-header">
                  <IonIcon icon={schoolOutline} className="section-icon" />
                  <h2>Formación y certificaciones</h2>
                </div>
                
                <div className="form-group">
                  <label htmlFor="certificaciones">Certificaciones y títulos <span className="required">*</span></label>
                  <textarea 
                    className="form-control" 
                    id="certificaciones" 
                    rows={3} 
                    placeholder="Ej: Licencia UEFA B (2019), Curso de preparación física en fútbol (2020)..."
                    value={certificaciones}
                    onChange={(e) => setCertificaciones(e.target.value)}
                  ></textarea>
                  <small className="form-text text-muted">
                    Incluye tus principales certificaciones, cursos o títulos relacionados con el entrenamiento deportivo.
                  </small>
                </div>
              </div>
              
              {/* Sección 3: Biografía profesional */}
              <div className="form-section">
                <div className="section-header">
                  <IonIcon icon={documentTextOutline} className="section-icon" />
                  <h2>Biografía profesional</h2>
                </div>
                
                <div className="form-group">
                  <label htmlFor="biografia">Acerca de ti <span className="required">*</span></label>
                  <textarea 
                    className="form-control" 
                    id="biografia" 
                    rows={5} 
                    placeholder="Cuéntanos sobre tu trayectoria, filosofía de entrenamiento, logros destacados..."
                    value={biografia}
                    onChange={(e) => setBiografia(e.target.value)}
                  ></textarea>
                  <small className="form-text text-muted">
                    Esta información será visible in tu perfil público y ayudará a los equipos a conocerte mejor.
                  </small>
                </div>
              </div>
              
              {/* Sección 4: Logros */}
              <div className="form-section">
                <div className="section-header">
                  <IonIcon icon={trophyOutline} className="section-icon" />
                  <h2>Logros destacados (opcional)</h2>
                </div>
                
                <div className="chips-container">
                  <IonChip color="success">
                    <IonLabel>Campeón regional</IonLabel>
                  </IonChip>
                  <IonChip color="primary">
                    <IonLabel>Ascenso a primera</IonLabel>
                  </IonChip>
                  <IonChip color="tertiary">
                    <IonLabel>Formador de talento</IonLabel>
                  </IonChip>
                  <IonChip outline color="medium">
                    <IonLabel>+ Añadir logro</IonLabel>
                  </IonChip>
                </div>
                <small className="form-text text-muted mt-2">
                  Selecciona o añade tus logros más importantes como entrenador.
                </small>
              </div>
              
              <div className="form-actions">
                <IonButton 
                  expand="block" 
                  disabled={!formValid}
                  onClick={handleCompletarPerfil} 
                  className="save-button"
                >
                  <IonIcon slot="start" icon={saveOutline} />
                  Guardar Perfil
                </IonButton>
                <p className="disclaimer">
                  <small>Los campos marcados con <span className="required">*</span> son obligatorios</small>
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
                history.push('/entrenador/perfil');
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

export default CompletarPerfilEntrenador;