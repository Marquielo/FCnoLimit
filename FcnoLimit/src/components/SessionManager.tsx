import React, { useState, useEffect } from 'react';
import { 
  IonButton, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonBadge,
  IonChip,
  IonAlert
} from '@ionic/react';
import { 
  timeOutline, 
  shieldCheckmarkOutline, 
  logOutOutline,
  refreshOutline,
  informationCircleOutline 
} from 'ionicons/icons';
import { authService } from '../services/authService';

interface SessionInfo {
  id: number;
  device_info: string;
  ip_address: string;
  created_at: string;
  last_used: string;
  is_current: boolean;
}

const SessionManager: React.FC = () => {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLogoutAllAlert, setShowLogoutAllAlert] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<{
    expiresIn: number;
    tokenType: string;
  } | null>(null);

  useEffect(() => {
    loadSessionInfo();
    loadSessions();
  }, []);

  const loadSessionInfo = () => {
    const tokenExpiresAt = localStorage.getItem('tokenExpiresAt');
    const accessToken = localStorage.getItem('accessToken');
    
    if (tokenExpiresAt && accessToken) {
      const expirationTime = parseInt(tokenExpiresAt);
      const timeUntilExpiry = expirationTime - Date.now();
      const minutesUntilExpiry = Math.floor(timeUntilExpiry / 60000);
      
      setTokenInfo({
        expiresIn: minutesUntilExpiry,
        tokenType: 'refresh'
      });
    } else {
      const legacyToken = localStorage.getItem('token');
      if (legacyToken) {
        setTokenInfo({
          expiresIn: 480, // 8 horas por defecto para legacy
          tokenType: 'legacy'
        });
      }
    }
  };

  const loadSessions = async () => {
    setLoading(true);
    try {
      const sessionsData = await authService.getUserSessions();
      setSessions(sessionsData.sessions || []);
    } catch (error) {
      console.error('Error al cargar sesiones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAll = async () => {
    setLoading(true);
    try {
      await authService.logoutAll();
      // Redirigir a login después de cerrar todas las sesiones
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error al cerrar todas las sesiones:', error);
    } finally {
      setLoading(false);
      setShowLogoutAllAlert(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDeviceIcon = (deviceInfo: string) => {
    if (deviceInfo.toLowerCase().includes('mobile')) {
      return '📱';
    } else if (deviceInfo.toLowerCase().includes('chrome')) {
      return '🌐';
    } else if (deviceInfo.toLowerCase().includes('firefox')) {
      return '🦊';
    } else if (deviceInfo.toLowerCase().includes('safari')) {
      return '🧭';
    }
    return '💻';
  };

  return (
    <div className="session-manager">
      {/* Información del token actual */}
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>
            <IonIcon icon={shieldCheckmarkOutline} /> 
            Información de Sesión Actual
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          {tokenInfo && (
            <IonList>
              <IonItem>
                <IonIcon icon={timeOutline} slot="start" />
                <IonLabel>
                  <h3>Tipo de Token</h3>
                  <p>
                    {tokenInfo.tokenType === 'refresh' ? (
                      <IonChip color="success">
                        <IonIcon icon={refreshOutline} />
                        <span>Sistema Moderno (Refresh Tokens)</span>
                      </IonChip>
                    ) : (
                      <IonChip color="warning">
                        <span>Sistema Legacy</span>
                      </IonChip>
                    )}
                  </p>
                </IonLabel>
              </IonItem>
              
              <IonItem>
                <IonIcon icon={timeOutline} slot="start" />
                <IonLabel>
                  <h3>Tiempo hasta expiración</h3>
                  <p>
                    {tokenInfo.expiresIn > 0 ? (
                      <IonBadge color={tokenInfo.expiresIn <= 5 ? 'danger' : 'primary'}>
                        {tokenInfo.expiresIn} minutos
                      </IonBadge>
                    ) : (
                      <IonBadge color="danger">Expirado</IonBadge>
                    )}
                    {tokenInfo.tokenType === 'refresh' && (
                      <span style={{ marginLeft: '8px', fontSize: '0.8em', color: '#666' }}>
                        (Se renueva automáticamente)
                      </span>
                    )}
                  </p>
                </IonLabel>
              </IonItem>
            </IonList>
          )}
        </IonCardContent>
      </IonCard>

      {/* Lista de sesiones activas */}
      {sessions.length > 0 && (
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={informationCircleOutline} /> 
              Sesiones Activas ({sessions.length})
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              {sessions.map((session) => (
                <IonItem key={session.id}>
                  <div slot="start" style={{ fontSize: '1.5em' }}>
                    {getDeviceIcon(session.device_info)}
                  </div>
                  <IonLabel>
                    <h3>
                      {session.device_info}
                      {session.is_current && (
                        <IonChip color="primary" style={{ marginLeft: '8px' }}>
                          Actual
                        </IonChip>
                      )}
                    </h3>
                    <p>IP: {session.ip_address}</p>
                    <p>Creada: {formatDate(session.created_at)}</p>
                    <p>Último uso: {formatDate(session.last_used)}</p>
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
            
            {sessions.length > 1 && (
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <IonButton 
                  color="danger" 
                  fill="outline"
                  onClick={() => setShowLogoutAllAlert(true)}
                  disabled={loading}
                >
                  <IonIcon icon={logOutOutline} slot="start" />
                  Cerrar Todas las Sesiones
                </IonButton>
              </div>
            )}
          </IonCardContent>
        </IonCard>
      )}

      {/* Alert para confirmar logout de todas las sesiones */}
      <IonAlert
        isOpen={showLogoutAllAlert}
        onDidDismiss={() => setShowLogoutAllAlert(false)}
        header="Cerrar Todas las Sesiones"
        message="¿Estás seguro de que quieres cerrar todas las sesiones activas? Tendrás que iniciar sesión nuevamente en todos los dispositivos."
        buttons={[
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Cerrar Todas',
            role: 'destructive',
            handler: handleLogoutAll
          }
        ]}
      />
    </div>
  );
};

export default SessionManager;
