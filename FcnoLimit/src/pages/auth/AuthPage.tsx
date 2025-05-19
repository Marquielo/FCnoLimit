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

// Función temporal para evitar errores si no existe el servicio real
const mockSignInWithGoogle = async () => {
  console.log("Simulando inicio de sesión con Google");
  // Simular un retraso de red
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    user: {
      uid: "mock-uid-123",
      email: "usuario@ejemplo.com",
      displayName: "Usuario Ejemplo",
      photoURL: "https://via.placeholder.com/150"
    },
    token: "mock-token-123"
  };
};

// Intenta importar la función real, pero usa la simulada en caso de error
let signInWithGoogle;
try {
  // Intenta importar la función real
  const module = require('../../firebase/authService');
  signInWithGoogle = module.signInWithGoogle;
} catch (error) {
  console.warn("No se pudo importar el servicio de autenticación, usando versión de prueba");
  signInWithGoogle = mockSignInWithGoogle;
}

const AuthPage: React.FC = () => {
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

  const apiUrl = import.meta.env.VITE_API_URL; // URL del backend desde la variable de entorno

  // Manejador para autenticación con Google
  const handleGoogleSignIn = async () => {
    console.log("Botón Google clickeado");
    try {
      present({ message: 'Iniciando sesión con Google...' });
      console.log("Mostrando loading...");
      
      console.log("Llamando a signInWithGoogle...");
      const result = await signInWithGoogle();
      console.log("Resultado completo:", result);
      
      dismiss();
      
      if (result.success && result.token && result.user) {
        console.log("Login exitoso, guardando datos...");
        // Guardar token y datos del usuario en localStorage
        localStorage.setItem('token', result.token);
        localStorage.setItem('usuario', JSON.stringify(result.user));
        
        // Redirigir a la página de inicio
        window.location.href = '/inicio';
      } else {
        console.error("Error en resultado:", result.error);
        setError(result.error || 'Error al iniciar sesión con Google');
      }
    } catch (err: any) {
      console.error("Error detallado:", err);
      console.error("Stack trace:", err.stack);
      dismiss();
      setError(err.message || 'Error al iniciar sesión con Google');
    }
  };

  // Manejadores de autenticación existentes
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

      dismiss();
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error de autenticación');
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.user));
      window.location.href = '/inicio'; // Redirige a /inicio tras login exitoso
    } catch (err: any) {
      dismiss();
      setError(err.message || 'Correo o contraseña incorrectos');
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
          rol: 'persona_natural' // O el rol que desees permitir desde el registro
        })
      });
      dismiss();
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al registrar');
      setRegisterSuccess('Cuenta creada exitosamente. Ahora puedes iniciar sesión.');
      setShowLogin(true);
    } catch (err: any) {
      dismiss();
      setRegisterError(err.message || 'Error al registrar');
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
                        >
                          <IonIcon icon={logoGoogle}></IonIcon>
                        </IonButton>
                        <IonButton fill="clear" className="social-button facebook">
                          <IonIcon icon={logoFacebook}></IonIcon>
                        </IonButton>
                        <IonButton fill="clear" className="social-button apple">
                          <IonIcon icon={logoApple}></IonIcon>
                        </IonButton>
                      </div>
                      
                      {/* Separador */}
                      <div className="separator">o</div>
                      
                      {/* Campo de Email */}
                      <IonItem className="custom-input">
                        <IonInput
                          type="email"
                          placeholder="Email"
                          value={email}
                          onIonChange={e => setEmail(e.detail.value!)}
                          required
                          className="custom-input-field"
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
                        >
                          <IonIcon icon={logoGoogle}></IonIcon>
                        </IonButton>
                        <IonButton fill="clear" className="social-button facebook">
                          <IonIcon icon={logoFacebook}></IonIcon>
                        </IonButton>
                        <IonButton fill="clear" className="social-button apple">
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