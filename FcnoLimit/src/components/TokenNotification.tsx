import React, { useState, useEffect } from 'react';
import { IonToast } from '@ionic/react';
import { authService } from '../services/authService';

interface TokenNotificationProps {
  className?: string;
}

const TokenNotification: React.FC<TokenNotificationProps> = ({ className }) => {
  const [showTokenWarning, setShowTokenWarning] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [timeUntilExpiry, setTimeUntilExpiry] = useState<number | null>(null);

  useEffect(() => {
    // Solo verificar si tenemos refresh tokens (no legacy)
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!accessToken || !refreshToken) {
      return; // No usar notificaciones para sistema legacy
    }

    const checkTokenExpiry = () => {
      const tokenExpiresAt = localStorage.getItem('tokenExpiresAt');
      
      if (!tokenExpiresAt) return;
      
      const expirationTime = parseInt(tokenExpiresAt);
      const currentTime = Date.now();
      const timeUntilExpiry = expirationTime - currentTime;
      const minutesUntilExpiry = Math.floor(timeUntilExpiry / 60000);
      
      setTimeUntilExpiry(minutesUntilExpiry);
      
      // Mostrar advertencia 2 minutos antes de expirar
      if (minutesUntilExpiry <= 2 && minutesUntilExpiry > 0) {
        setToastMessage(`Tu sesión expirará en ${minutesUntilExpiry} minuto(s). Se renovará automáticamente.`);
        setShowTokenWarning(true);
      }
      
      // Mostrar cuando se renueve automáticamente
      if (minutesUntilExpiry > 13) { // Token recién renovado
        setToastMessage('Tu sesión se ha renovado automáticamente.');
        setShowTokenWarning(true);
      }
    };

    // Verificar inmediatamente
    checkTokenExpiry();
    
    // Verificar cada 30 segundos
    const interval = setInterval(checkTokenExpiry, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <IonToast
      isOpen={showTokenWarning}
      onDidDismiss={() => setShowTokenWarning(false)}
      message={toastMessage}
      duration={4000}
      color="warning"
      position="top"
      className={className}
      buttons={[
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            setShowTokenWarning(false);
          }
        }
      ]}
    />
  );
};

export default TokenNotification;
