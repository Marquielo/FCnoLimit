import { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonLabel, IonInput } from '@ionic/react';

const AuthPage: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirm, setRegisterConfirm] = useState('');

  const handleLogin = () => {
    alert('Inicio de sesión exitoso');
  };

  const handleRegister = () => {
    if (registerPassword !== registerConfirm) {
      alert('Las contraseñas no coinciden');
      return;
    }
    alert('Cuenta creada exitosamente');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{showLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 32 }}>
          <IonButton fill={showLogin ? 'solid' : 'outline'} onClick={() => setShowLogin(true)}>
            Iniciar Sesión
          </IonButton>
          <IonButton fill={!showLogin ? 'solid' : 'outline'} onClick={() => setShowLogin(false)}>
            Crear Cuenta
          </IonButton>
        </div>
        {showLogin ? (
          <form onSubmit={e => { e.preventDefault(); handleLogin(); }}>
            <IonItem>
              <IonLabel position="floating">Correo Electrónico</IonLabel>
              <IonInput
                type="email"
                value={email}
                onIonChange={e => setEmail(e.detail.value!)}
                required
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Contraseña</IonLabel>
              <IonInput
                type="password"
                value={password}
                onIonChange={e => setPassword(e.detail.value!)}
                required
              />
            </IonItem>
            <IonButton expand="block" type="submit" style={{ marginTop: 16 }}>
              Iniciar Sesión
            </IonButton>
          </form>
        ) : (
          <form onSubmit={e => { e.preventDefault(); handleRegister(); }}>
            <IonItem>
              <IonLabel position="floating">Correo Electrónico</IonLabel>
              <IonInput
                type="email"
                value={registerEmail}
                onIonChange={e => setRegisterEmail(e.detail.value!)}
                required
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Contraseña</IonLabel>
              <IonInput
                type="password"
                value={registerPassword}
                onIonChange={e => setRegisterPassword(e.detail.value!)}
                required
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Confirmar Contraseña</IonLabel>
              <IonInput
                type="password"
                value={registerConfirm}
                onIonChange={e => setRegisterConfirm(e.detail.value!)}
                required
              />
            </IonItem>
            <IonButton expand="block" type="submit" style={{ marginTop: 16 }}>
              Crear Cuenta
            </IonButton>
          </form>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AuthPage;