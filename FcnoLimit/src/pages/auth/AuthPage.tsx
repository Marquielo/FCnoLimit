import { useState } from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButton, 
  IonItem, 
  IonLabel, 
  IonInput,
  IonIcon,
  IonText
} from '@ionic/react';
import {
  footballOutline,
  mailOutline, 
  lockClosedOutline, 
  logInOutline, 
  personAddOutline 
} from 'ionicons/icons';
import './AuthPage.css';

const AuthPage: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirm, setRegisterConfirm] = useState('');
  const [error, setError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

  // LOGIN REAL
  const handleLogin = async () => {
    setError('');
    try {
      const res = await fetch('http://localhost:3001/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email, contraseña: password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error de autenticación');
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.user));
      window.location.href = '/inicio'; // Redirige a /jugadores tras login exitoso
    } catch (err: any) {
      setError(err.message || 'Correo o contraseña incorrectos');
    }
  };

  // REGISTRO REAL
  const handleRegister = async () => {
    setRegisterError('');
    setRegisterSuccess('');
    if (registerPassword !== registerConfirm) {
      setRegisterError('Las contraseñas no coinciden');
      return;
    }
    try {
      const res = await fetch('http://localhost:3001/api/usuarios/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_completo: registerEmail.split('@')[0], // Puedes pedir nombre real si quieres
          correo: registerEmail,
          contraseña: registerPassword,
          rol: 'persona_natural' // O el rol que desees permitir desde el registro
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al registrar');
      setRegisterSuccess('Cuenta creada exitosamente. Ahora puedes iniciar sesión.');
      setShowLogin(true);
    } catch (err: any) {
      setRegisterError(err.message || 'Error al registrar');
    }
  };

  return (
    <IonPage className="auth-page">
      <IonHeader className="ion-no-border">
        <IonToolbar color="transparent">
          <IonTitle className="ion-text-center custom-title">
            {showLogin ? 'Bienvenido de Vuelta' : 'Únete a Nosotros'}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="auth-container">
          <div className="logo-container">
            <div className="logo-icon-container">
              <IonIcon icon={footballOutline} className="logo-icon" />
            </div>
            <h1 className="brand-title">
              FCnoLimit
            </h1>
            <p className="brand-subtitle">
              Tu camino hacia el éxito deportivo
            </p>
          </div>
          
          <div className="auth-toggle-buttons">
            <IonButton 
              fill={showLogin ? 'solid' : 'outline'} 
              onClick={() => setShowLogin(true)}
              color="secondary"
            >
              Iniciar Sesión
            </IonButton>
            <IonButton 
              fill={!showLogin ? 'solid' : 'outline'} 
              onClick={() => setShowLogin(false)}
              color="secondary"
            >
              Crear Cuenta
            </IonButton>
          </div>
          
          <div className="auth-form">
            {showLogin ? (
              <form onSubmit={e => { e.preventDefault(); handleLogin(); }} className="slide-in">
                <IonItem className="custom-input">
                  <IonLabel position="floating">
                    <IonIcon icon={mailOutline} />
                    Correo Electrónico
                  </IonLabel>
                  <IonInput
                    type="email"
                    value={email}
                    onIonChange={e => setEmail(e.detail.value!)}
                    required
                    className="custom-input-field"
                    placeholder="ejemplo@correo.com"
                  />
                </IonItem>
                
                <IonItem className="custom-input">
                  <IonLabel position="floating">
                    <IonIcon icon={lockClosedOutline} />
                    Contraseña
                  </IonLabel>
                  <IonInput
                    type="password"
                    value={password}
                    onIonChange={e => setPassword(e.detail.value!)}
                    required
                    className="custom-input-field"
                    placeholder="••••••••"
                  />
                </IonItem>
                {error && <IonText color="danger">{error}</IonText>}
                <IonButton expand="block" type="submit" className="submit-button">
                  <IonIcon icon={logInOutline} slot="start" />
                  Iniciar Sesión
                </IonButton>
              </form>
            ) : (
              <form onSubmit={e => { e.preventDefault(); handleRegister(); }} className="slide-in">
                <IonItem className="custom-input">
                  <IonLabel position="floating">
                    <IonIcon icon={mailOutline} />
                    Correo Electrónico
                  </IonLabel>
                  <IonInput
                    type="email"
                    value={registerEmail}
                    onIonChange={e => setRegisterEmail(e.detail.value!)}
                    required
                    className="custom-input-field"
                    placeholder="ejemplo@correo.com"
                  />
                </IonItem>
                
                <IonItem className="custom-input">
                  <IonLabel position="floating">
                    <IonIcon icon={lockClosedOutline} />
                    Contraseña
                  </IonLabel>
                  <IonInput
                    type="password"
                    value={registerPassword}
                    onIonChange={e => setRegisterPassword(e.detail.value!)}
                    required
                    className="custom-input-field"
                    placeholder="••••••••"
                  />
                </IonItem>
                
                <IonItem className="custom-input">
                  <IonLabel position="floating">
                    <IonIcon icon={lockClosedOutline} />
                    Confirmar Contraseña
                  </IonLabel>
                  <IonInput
                    type="password"
                    value={registerConfirm}
                    onIonChange={e => setRegisterConfirm(e.detail.value!)}
                    required
                    className="custom-input-field"
                    placeholder="••••••••"
                  />
                </IonItem>
                {registerError && <IonText color="danger">{registerError}</IonText>}
                {registerSuccess && <IonText color="success">{registerSuccess}</IonText>}
                <IonButton expand="block" type="submit" className="submit-button">
                  <IonIcon icon={personAddOutline} slot="start" />
                  Crear Cuenta
                </IonButton>
              </form>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AuthPage;