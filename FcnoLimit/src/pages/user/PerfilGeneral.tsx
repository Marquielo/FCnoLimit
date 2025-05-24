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
  IonAvatar,
  IonItem,
  IonLabel,
  IonList,
  IonButton,
  IonIcon,
  IonRow,
  IonCol
} from '@ionic/react';
import { pencil, camera, mailOutline, callOutline, calendarOutline } from 'ionicons/icons';

const PerfilGeneral: React.FC = () => {
  const [usuario, setUsuario] = useState({
    id: 1,
    nombre: 'Juan Pérez',
    email: 'juan.perez@example.com',
    telefono: '+123456789',
    fechaNacimiento: '15/05/1995',
    avatar: 'https://ionicframework.com/docs/img/demos/avatar.svg',
    rol: 'jugador'
  });

  // Simula obtener los datos del usuario
  useEffect(() => {
    // Aquí iría una llamada a la API para obtener los datos del usuario
    // setUsuario(datosDelUsuario);
  }, []);

  const editarPerfil = () => {
    // Lógica para editar el perfil
    console.log('Editando perfil...');
  };

  const cambiarFoto = () => {
    // Lógica para cambiar la foto
    console.log('Cambiando foto...');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mi Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent>
            <IonRow className="ion-align-items-center">
              <IonCol size="4" className="ion-text-center">
                <div style={{ position: 'relative' }}>
                  <IonAvatar style={{ width: '100px', height: '100px', margin: '0 auto' }}>
                    <img alt="Profile" src={usuario.avatar} />
                  </IonAvatar>
                  <IonButton 
                    fill="clear" 
                    size="small" 
                    onClick={cambiarFoto}
                    style={{ 
                      position: 'absolute', 
                      bottom: '0', 
                      right: '20%', 
                      '--border-radius': '50%',
                      '--background': 'rgba(0,0,0,0.6)',
                      '--padding-start': '8px',
                      '--padding-end': '8px'
                    }}
                  >
                    <IonIcon icon={camera} />
                  </IonButton>
                </div>
              </IonCol>
              <IonCol size="8">
                <h2>{usuario.nombre}</h2>
                <p>Rol: {usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1)}</p>
                <IonButton size="small" onClick={editarPerfil}>
                  <IonIcon slot="start" icon={pencil} />
                  Editar Perfil
                </IonButton>
              </IonCol>
            </IonRow>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonTitle size="small">Información personal</IonTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem>
                <IonIcon icon={mailOutline} slot="start" />
                <IonLabel>
                  <h3>Correo electrónico</h3>
                  <p>{usuario.email}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon icon={callOutline} slot="start" />
                <IonLabel>
                  <h3>Teléfono</h3>
                  <p>{usuario.telefono}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon icon={calendarOutline} slot="start" />
                <IonLabel>
                  <h3>Fecha de nacimiento</h3>
                  <p>{usuario.fechaNacimiento}</p>
                </IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* Dependiendo del rol, se pueden mostrar secciones específicas */}
        {usuario.rol === 'jugador' && (
          <IonCard>
            <IonCardHeader>
              <IonTitle size="large">Resumen de jugador</IonTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList>
                <IonItem>
                  <IonLabel>
                    <h3>Partidos jugados</h3>
                    <p>15</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <h3>Goles</h3>
                    <p>5</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <h3>Asistencias</h3>
                    <p>3</p>
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default PerfilGeneral;