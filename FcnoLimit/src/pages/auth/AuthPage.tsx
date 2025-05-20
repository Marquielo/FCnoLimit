import { useState } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonButton, 
  IonItem, 
  IonInput,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  useIonLoading
} from '@ionic/react';
import { 
  footballOutline, 
  eyeOutline, 
  eyeOffOutline,
  logoGoogle,
  logoFacebook,
  logoApple
} from 'ionicons/icons';
import './AuthPage.css';
import NavBar from '../../components/NavBar';
import { useHistory } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const history = useHistory();
  
  console.log("Renderizando AuthPage");
  
  const [showLogin, setShowLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
  const [registerName, setRegisterName] = useState('');
  const [error, setError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [present, dismiss] = useIonLoading();

  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) {
    console.warn('VITE_API_URL no está definida. Verifica tu archivo .env y el build.');
  }

  // Elimina Google SignIn simulado y su botón funcional
  // Si quieres dejar el botón, puedes deshabilitarlo así:
  const handleGoogleSignIn = () => {
    setError('Inicio de sesión con Google no disponible.');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      present({ message: 'Iniciando sesión...' });

      const res = await fetch(`${apiUrl}/api/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email, contraseña: password }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      dismiss();
      if (!res.ok) throw new Error(data.error || 'Error de autenticación');
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.user));
      history.push('/inicio'); // <--- Usa el router en vez de window.location.href
    } catch (err: any) {
      dismiss();
      setError(err.message === 'Failed to fetch'
        ? 'No se pudo conectar con el servidor. Intenta de nuevo en unos segundos.'
        : err.message || 'Correo o contraseña incorrectos');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');
    if (registerPassword !== registerConfirmPassword) {
      setRegisterError('Las contraseñas no coinciden');
      return;
    }
    try {
      present({ message: 'Creando cuenta...' });
      const res = await fetch(`${apiUrl}/api/usuarios/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_completo: registerName || registerEmail.split('@')[0],
          correo: registerEmail,
          contraseña: registerPassword,
          rol: 'persona_natural'
        })
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      dismiss();
      if (!res.ok) throw new Error(data.error || 'Error al registrar');
      setRegisterSuccess('Cuenta creada exitosamente. Ahora puedes iniciar sesión.');
      setShowLogin(true);
    } catch (err: any) {
      dismiss();
      setRegisterError(err.message === 'Failed to fetch'
        ? 'No se pudo conectar con el servidor. Intenta de nuevo en unos segundos.'
        : err.message || 'Error al registrar');
    }
  };

  return (
    <IonPage className="auth-page">
      <NavBar />
      <IonContent className="ion-padding">
        <IonGrid className="auth-grid">
          <IonRow>
            {/* Columna izquierda - Con logo y fondo de fútbol */}
            <IonCol size="12" sizeSm="5" sizeMd="5" sizeXl="4" className="left-column">
              <div className="football-bg"></div>
              <div className="left-container">
                <div className="logo-container">
                  <IonIcon icon={footballOutline} className="logo-icon" />
                  <div className="logo-text">
                    FCnoLim<span className="logo-text-highlight">it</span>
                  </div>
                </div>
                
                <h1 className="left-title">¿No tienes una cuenta?</h1>
                <p className="left-description">
                  Únete a la mejor plataforma de fútbol amateur y descubre nuevas oportunidades para tu pasión deportiva.
                </p>
                <IonButton 
                  className="sign-up-button" 
                  expand="block" 
                  fill="outline"
                  onClick={() => setShowLogin(false)}
                >
                  REGÍSTRATE
                </IonButton>
              </div>
            </IonCol>
            
            {/* Columna derecha - Formulario rediseñado */}
            <IonCol size="12" sizeSm="7" sizeMd="7" sizeXl="8" className="right-column">
              <div className="form-container">
                {showLogin ? (
                  <>
                    <h2 className="form-title">Iniciar Sesión</h2>
                    <form onSubmit={handleLogin} className="auth-form">
                      {/* Botones de login social */}
                      <div className="social-buttons">
                        <IonButton 
                          fill="clear" 
                          className="social-button google"
                          onClick={handleGoogleSignIn}
                          type="button"
                          disabled
                        >
                          <IonIcon icon={logoGoogle}></IonIcon>
                        </IonButton>
                        <IonButton fill="clear" className="social-button facebook" disabled>
                          <IonIcon icon={logoFacebook}></IonIcon>
                        </IonButton>
                        <IonButton fill="clear" className="social-button apple" disabled>
                          <IonIcon icon={logoApple}></IonIcon>
                        </IonButton>
                      </div>
                      
                      {/* Separador */}
                      <div className="separator">o</div>
                      
                      {/* Campo de Email */}
                      <IonItem className="custom-input" lines="full">
                        <IonInput
                          className="custom-input-field"
                          type="email"
                          placeholder="Email"
                          value={email}
                          onIonChange={e => setEmail(e.detail.value!)}
                          required
                          clearInput={false}
                          mode="ios"
                        ></IonInput>
                      </IonItem>
                      
                      {/* Campo de Password con botón para mostrar/ocultar */}
                      <div className="password-container">
                        <IonItem className="custom-input">
                          <IonInput
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Contraseña"
                            value={password}
                            onIonChange={e => setPassword(e.detail.value!)}
                            required
                            className="custom-input-field"
                          ></IonInput>
                        </IonItem>
                        <button 
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                        >
                          <IonIcon icon={showPassword ? eyeOutline : eyeOffOutline}></IonIcon>
                        </button>
                      </div>
                      
                      <div className="forgot-password">
                        <a href="#">¿Olvidaste tu contraseña?</a>
                      </div>
                      
                      {error && <div className="error-message">{error}</div>}
                      
                      <IonButton expand="block" type="submit" className="submit-button">
                        Iniciar Sesión
                      </IonButton>
                      
                      <div className="auth-footer">
                        <p>
                          ¿Nuevo en FCnoLimit? <a href="#" onClick={(e) => {
                            e.preventDefault();
                            setShowLogin(false);
                          }}>Crear cuenta</a>
                        </p>
                      </div>
                    </form>
                  </>
                ) : (
                  <>
                  <div className="crear-cuenta">
                    <h2 className="form-title">Crear Cuenta</h2>
                    <form onSubmit={handleRegister} className="auth-form">
                      {/* Botones de registro social */}
                      <div className="social-buttons">
                        <IonButton 
                          fill="clear" 
                          className="social-button google"
                          onClick={handleGoogleSignIn}
                          type="button"
                          disabled
                        >
                          <IonIcon icon={logoGoogle}></IonIcon>
                        </IonButton>
                        <IonButton fill="clear" className="social-button facebook" disabled>
                          <IonIcon icon={logoFacebook}></IonIcon>
                        </IonButton>
                        <IonButton fill="clear" className="social-button apple" disabled>
                          <IonIcon icon={logoApple}></IonIcon>
                        </IonButton>
                      </div>
                      
                      {/* Separador */}
                      <div className="separator">o</div>
                      
                      {/* Campo de Nombre */}
                      <IonItem className="custom-input">
                        <IonInput
                          type="text"
                          placeholder="Nombre Completo"
                          value={registerName}
                          onIonChange={e => setRegisterName(e.detail.value!)}
                          required
                          className="custom-input-field"
                        ></IonInput>
                      </IonItem>
                      
                      {/* Campo de Email */}
                      <IonItem className="custom-input">
                        <IonInput
                          type="email"
                          placeholder="Email"
                          value={registerEmail}
                          onIonChange={e => setRegisterEmail(e.detail.value!)}
                          required
                          className="custom-input-field"
                        ></IonInput>
                      </IonItem>
                      
                      {/* Campo de Password con botón para mostrar/ocultar */}
                      <div className="password-container">
                        <IonItem className="custom-input">
                          <IonInput
                            type={showRegisterPassword ? 'text' : 'password'}
                            placeholder="Contraseña"
                            value={registerPassword}
                            onIonChange={e => setRegisterPassword(e.detail.value!)}
                            required
                            className="custom-input-field"
                          ></IonInput>
                        </IonItem>
                        <button 
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                          tabIndex={-1}
                        >
                          <IonIcon icon={showRegisterPassword ? eyeOutline : eyeOffOutline}></IonIcon>
                        </button>
                      </div>
                      
                      {/* Campo de Confirmar Password con botón para mostrar/ocultar */}
                      <div className="password-container">
                        <IonItem className="custom-input">
                          <IonInput
                            type={showRegisterConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirmar Contraseña"
                            value={registerConfirmPassword}
                            onIonChange={e => setRegisterConfirmPassword(e.detail.value!)}
                            required
                            className="custom-input-field"
                          ></IonInput>
                        </IonItem>
                        <button 
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                          tabIndex={-1}
                        >
                          <IonIcon icon={showRegisterConfirmPassword ? eyeOutline : eyeOffOutline}></IonIcon>
                        </button>
                      </div>
                      
                      {registerError && <div className="error-message">{registerError}</div>}
                      {registerSuccess && <div className="success-message">{registerSuccess}</div>}
                      
                      <IonButton expand="block" type="submit" className="submit-button">
                        Crear Cuenta
                      </IonButton>
                      
                      <div className="auth-footer">
                        <p>
                          ¿Ya tienes una cuenta? <a href="#" onClick={(e) => {
                            e.preventDefault();
                            setShowLogin(true);
                          }}>Iniciar Sesión</a>
                        </p>
                      </div>
                    </form>
                  </div>
                  </>
                )}
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default AuthPage;