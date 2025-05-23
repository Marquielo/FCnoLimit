import React, { useState, useEffect } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle,
  IonButtons,
  IonButton,
  IonMenuButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonLoading,
  IonToast
} from '@ionic/react';
import { 
  peopleOutline, 
  personOutline, 
  footballOutline, 
  calendarOutline,
  statsChartOutline,
  settingsOutline,
  logOutOutline
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

interface DashboardStats {
  usuariosTotal: number;
  jugadoresTotal: number;
  entrenadoresTotal: number;
  equiposTotal: number;
  partidosTotal: number;
  torneosPendientes: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    usuariosTotal: 0,
    jugadoresTotal: 0,
    entrenadoresTotal: 0,
    equiposTotal: 0,
    partidosTotal: 0,
    torneosPendientes: 0
  });
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const history = useHistory();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // En un entorno real, aquí haríamos la llamada a la API
      // const response = await fetch('https://fcnolimit-back.onrender.com/api/admin/stats');
      // const data = await response.json();
      // setStats(data);
      
      // Simulamos datos para desarrollo
      setTimeout(() => {
        setStats({
          usuariosTotal: 125,
          jugadoresTotal: 87,
          entrenadoresTotal: 15,
          equiposTotal: 8,
          partidosTotal: 34,
          torneosPendientes: 2
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
      setToastMessage('Error al cargar los datos. Intente nuevamente.');
      setShowToast(true);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    history.push('/auth');
  };

  const navigateToSection = (section: string) => {
    history.push(`/admin/${section}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Panel de Administración</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleLogout}>
              <IonIcon slot="icon-only" icon={logOutOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        <h1>Bienvenido, Administrador</h1>
        <p>Aquí puedes ver un resumen de la actividad del sistema.</p>

        <IonLoading isOpen={loading} message={'Cargando datos...'} />
        
        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="6" sizeLg="4">
              <IonCard onClick={() => navigateToSection('usuarios')}>
                <IonCardHeader>
                  <IonIcon icon={peopleOutline} size="large" />
                  <IonCardTitle>Usuarios</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <h2 className="stat-number">{stats.usuariosTotal}</h2>
                  <p>usuarios registrados</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
            
            <IonCol size="12" sizeMd="6" sizeLg="4">
              <IonCard onClick={() => navigateToSection('jugador')}>
                <IonCardHeader>
                  <IonIcon icon={personOutline} size="large" />
                  <IonCardTitle>Jugadores</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <h2 className="stat-number">{stats.jugadoresTotal}</h2>
                  <p>jugadores activos</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
            
            <IonCol size="12" sizeMd="6" sizeLg="4">
              <IonCard onClick={() => navigateToSection('entrenador')}>
                <IonCardHeader>
                  <IonIcon icon={statsChartOutline} size="large" />
                  <IonCardTitle>Entrenadores</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <h2 className="stat-number">{stats.entrenadoresTotal}</h2>
                  <p>entrenadores registrados</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
            
            <IonCol size="12" sizeMd="6" sizeLg="4">
              <IonCard onClick={() => navigateToSection('equipos')}>
                <IonCardHeader>
                  <IonIcon icon={footballOutline} size="large" />
                  <IonCardTitle>Equipos</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <h2 className="stat-number">{stats.equiposTotal}</h2>
                  <p>equipos registrados</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
            
            <IonCol size="12" sizeMd="6" sizeLg="4">
              <IonCard onClick={() => navigateToSection('partidos')}>
                <IonCardHeader>
                  <IonIcon icon={calendarOutline} size="large" />
                  <IonCardTitle>Partidos</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <h2 className="stat-number">{stats.partidosTotal}</h2>
                  <p>partidos jugados</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
            
            <IonCol size="12" sizeMd="6" sizeLg="4">
              <IonCard onClick={() => navigateToSection('torneos')}>
                <IonCardHeader>
                  <IonIcon icon={settingsOutline} size="large" />
                  <IonCardTitle>Torneos</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <h2 className="stat-number">{stats.torneosPendientes}</h2>
                  <p>torneos activos</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default AdminDashboard;