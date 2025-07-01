import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonButton,
  IonAvatar,
  IonList,
  IonItem,
  IonLabel,
  IonToggle,
  IonAlert,
  IonActionSheet
} from '@ionic/react';
import { 
  person, 
  settings, 
  notifications,
  moon,
  language,
  help,
  logOut,
  chevronForward,
  mail,
  call,
  informationCircle
} from 'ionicons/icons';

const MobilePerfil: React.FC = () => {
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    setShowAlert(true);
  };

  const confirmLogout = () => {
    // Aquí implementarías la lógica de logout
    console.log('Cerrando sesión...');
    setShowAlert(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Mi Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Mi Perfil</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="ion-padding">
          {/* Información del usuario */}
          <IonCard>
            <IonCardContent>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '20px' 
              }}>
                <IonAvatar style={{ width: '80px', height: '80px', marginRight: '15px' }}>
                  <img 
                    src="/assets/default-avatar.png" 
                    alt="Avatar del usuario"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNDQ0MiLz4KPGNpcmNsZSBjeD0iNDAiIGN5PSIzMCIgcj0iMTIiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yMCA2MEMyMCA1Mi4yNjggMjguMjY4IDQ0IDM2IDQ0SDQ0QzUxLjczMiA0NCA2MCA1Mi4yNjggNjAgNjBWNjRIMjBWNjBaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K';
                    }}
                  />
                </IonAvatar>
                <div>
                  <h2 style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
                    Usuario FCnoLimit
                  </h2>
                  <p style={{ margin: 0, color: 'var(--ion-color-medium)' }}>
                    Fanático del fútbol
                  </p>
                  <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: 'var(--ion-color-medium)' }}>
                    📧 usuario@example.com
                  </p>
                </div>
              </div>
              
              <IonButton 
                expand="block" 
                fill="outline" 
                onClick={() => setShowActionSheet(true)}
              >
                <IonIcon icon={settings} slot="start" />
                Editar Perfil
              </IonButton>
            </IonCardContent>
          </IonCard>

          {/* Configuraciones */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={settings} /> Configuraciones
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList>
                <IonItem>
                  <IonIcon icon={notifications} slot="start" />
                  <IonLabel>Notificaciones</IonLabel>
                  <IonToggle 
                    checked={notificationsEnabled}
                    onIonChange={(e) => setNotificationsEnabled(e.detail.checked)}
                  />
                </IonItem>
                
                <IonItem>
                  <IonIcon icon={moon} slot="start" />
                  <IonLabel>Modo oscuro</IonLabel>
                  <IonToggle 
                    checked={darkMode}
                    onIonChange={(e) => setDarkMode(e.detail.checked)}
                  />
                </IonItem>
                
                <IonItem button>
                  <IonIcon icon={language} slot="start" />
                  <IonLabel>Idioma</IonLabel>
                  <IonLabel slot="end" color="medium">Español</IonLabel>
                  <IonIcon icon={chevronForward} slot="end" />
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>

          {/* Información y soporte */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={informationCircle} /> Información
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList>
                <IonItem button>
                  <IonIcon icon={help} slot="start" />
                  <IonLabel>Ayuda y soporte</IonLabel>
                  <IonIcon icon={chevronForward} slot="end" />
                </IonItem>
                
                <IonItem button>
                  <IonIcon icon={informationCircle} slot="start" />
                  <IonLabel>Acerca de la app</IonLabel>
                  <IonIcon icon={chevronForward} slot="end" />
                </IonItem>
                
                <IonItem button>
                  <IonIcon icon={mail} slot="start" />
                  <IonLabel>Contacto</IonLabel>
                  <IonIcon icon={chevronForward} slot="end" />
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>

          {/* Información de la app */}
          <IonCard>
            <IonCardContent>
              <div style={{ textAlign: 'center', color: 'var(--ion-color-medium)' }}>
                <p style={{ margin: '10px 0 5px 0' }}>
                  <strong>FCnoLimit Mobile</strong>
                </p>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>
                  Versión 1.0.0
                </p>
                <p style={{ margin: '5px 0 10px 0', fontSize: '12px' }}>
                  © 2025 FCnoLimit. Todos los derechos reservados.
                </p>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Botón de cerrar sesión */}
          <div className="ion-margin-top">
            <IonButton 
              expand="block" 
              fill="clear" 
              color="danger"
              onClick={handleLogout}
            >
              <IonIcon icon={logOut} slot="start" />
              Cerrar Sesión
            </IonButton>
          </div>
        </div>

        {/* Action Sheet para editar perfil */}
        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          cssClass="my-custom-class"
          buttons={[
            {
              text: 'Cambiar foto de perfil',
              icon: person,
              handler: () => {
                console.log('Cambiar foto clicked');
              }
            },
            {
              text: 'Editar información',
              icon: settings,
              handler: () => {
                console.log('Editar info clicked');
              }
            },
            {
              text: 'Cancelar',
              icon: 'close',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            }
          ]}
        />

        {/* Alert para confirmar logout */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Cerrar Sesión"
          message="¿Estás seguro de que quieres cerrar sesión?"
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
                console.log('Logout cancelled');
              }
            },
            {
              text: 'Cerrar Sesión',
              handler: confirmLogout
            }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default MobilePerfil;
