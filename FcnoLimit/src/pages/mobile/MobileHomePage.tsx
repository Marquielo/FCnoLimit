import React from 'react';
import { IonHeader, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/react';
import { qrCodeOutline, refreshOutline, bugOutline } from 'ionicons/icons';
import ResponsiveLayout from '../../components/layout/ResponsiveLayout';
import { isMobileApp, mobileLog, webLog, getPlatformInfo } from '../../utils/platformDetection';

const MobileHomePage: React.FC = () => {
  const isMobile = isMobileApp();
  const platformInfo = getPlatformInfo();

  const testConnectivity = async () => {
    try {
      const response = await fetch('https://fcnolimit-back.onrender.com/api/ping');
      const data = await response.json();
      
      if (isMobile) {
        mobileLog('Test de conectividad exitoso', data);
        alert(`Conectividad OK: ${data.message}`);
      } else {
        webLog('Test de conectividad desde web', data);
        console.log('Conectividad web OK:', data);
      }
    } catch (error) {
      if (isMobile) {
        mobileLog('Error de conectividad', error);
        alert('Error de conectividad');
      } else {
        console.error('Error de conectividad web:', error);
      }
    }
  };

  return (
    <ResponsiveLayout showTabBar={true}>
      {/* Header solo visible en móvil nativo */}
      {isMobile && (
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>FCnoLimit</IonTitle>
          </IonToolbar>
        </IonHeader>
      )}

      <div className="mobile-home-content" style={{ padding: '20px' }}>
        <h1>🏠 Inicio - {isMobile ? 'App Móvil' : 'Web/Móvil'}</h1>
        
        <div style={{ marginBottom: '20px' }}>
          <h3>📱 Información de Plataforma:</h3>
          <ul>
            <li><strong>Es Móvil:</strong> {isMobile ? 'Sí' : 'No'}</li>
            <li><strong>Plataforma:</strong> {platformInfo.platform}</li>
            <li><strong>User Agent:</strong> {platformInfo.userAgent}</li>
          </ul>
        </div>

        {isMobile && (
          <div style={{ marginBottom: '20px' }}>
            <h3>🔧 Herramientas Móviles:</h3>
            <IonButton 
              expand="block" 
              fill="outline" 
              onClick={testConnectivity}
              style={{ marginBottom: '10px' }}
            >
              <IonIcon icon={refreshOutline} slot="start" />
              Test Conectividad
            </IonButton>

            <IonButton 
              expand="block" 
              fill="outline"
              routerLink="/debug"
              style={{ marginBottom: '10px' }}
            >
              <IonIcon icon={bugOutline} slot="start" />
              Página Debug
            </IonButton>
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <h3>🚀 Funcionalidades:</h3>
          <ul>
            <li>✅ Login funcional en móvil y web</li>
            <li>✅ TabBar nativo en app móvil</li>
            <li>✅ Navbar tradicional en web</li>
            <li>✅ Detección automática de plataforma</li>
            <li>✅ Backend en Render conectado</li>
          </ul>
        </div>

        {!isMobile && (
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#f5f5f5', 
            borderRadius: '8px',
            marginTop: '20px'
          }}>
            <h4>💻 Versión Web</h4>
            <p>Estás viendo la versión web de FCnoLimit. En la app móvil verás un TabBar en la parte inferior.</p>
          </div>
        )}
      </div>
    </ResponsiveLayout>
  );
};

export default MobileHomePage;
