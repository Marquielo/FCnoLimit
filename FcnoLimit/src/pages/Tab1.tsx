import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonItem, IonLabel } from '@ionic/react';
import { useState } from 'react';
import './Tab1.css';

const Tab1: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Email:', email);
    console.log('Password:', password);
    alert('Inicio de sesión exitoso');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Inicio de Sesión</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="login-container">
          <IonItem>
            <IonLabel position="floating">Correo Electrónico</IonLabel>
            <IonInput
              type="email"
              value={email}
              onIonChange={(e) => setEmail(e.detail.value!)}
              required
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Contraseña</IonLabel>
            <IonInput
              type="password"
              value={password}
              onIonChange={(e) => setPassword(e.detail.value!)}
              required
            />
          </IonItem>
          <IonButton expand="block" onClick={handleLogin}>
            Iniciar Sesión
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
