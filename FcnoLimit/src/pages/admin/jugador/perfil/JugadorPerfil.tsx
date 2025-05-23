import React, { useState, useEffect } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle,
  IonButtons,
  IonButton,
  IonAvatar,
  IonItem,
  IonLabel,
  IonList,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonChip,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
  IonLoading,
  IonToast,
  IonItemGroup,
  IonItemDivider
} from '@ionic/react';
import { 
  personOutline, 
  footballOutline, 
  calendarOutline,
  pencilOutline,
  informationCircleOutline,
  statsChartOutline,
  medalOutline,
  logOutOutline
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

interface JugadorDetalle {
  id: number;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  dni: string;
  nacionalidad: string;
  posicion: string;
  estatura: number;
  peso: number;
  pie_dominante: string;
  estado: 'activo' | 'inactivo' | 'lesionado' | 'suspendido';
  email: string;
  telefono: string;
  imagen_url?: string;
  equipo_actual?: string;
  numero_camiseta?: number;
  estadisticas: {
    partidos_jugados: number;
    goles: number;
    asistencias: number;
    tarjetas_amarillas: number;
    tarjetas_rojas: number;
    minutos_jugados: number;
  }
}

const JugadorPerfil: React.FC = () => {
  const [perfil, setPerfil] = useState<JugadorDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState('danger');
  
  const history = useHistory();

  useEffect(() => {
    fetchJugadorPerfil();
  }, []);

  const fetchJugadorPerfil = async () => {
    setLoading(true);
    try {
      const userJSON = localStorage.getItem('usuario');
      if (!userJSON) throw new Error('No se encontró la sesión del usuario');
      
      const user = JSON.parse(userJSON);
      
      // En un entorno real, aquí haríamos la llamada a la API
      // const response = await fetch(`https://fcnolimit-back.onrender.com/api/jugadores/${user.id}`);
      // const data = await response.json();
      // setPerfil(data);
      
      // Simulamos datos para desarrollo
      setTimeout(() => {
        setPerfil({
          id: 1,
          nombre: user.nombre_completo?.split(' ')[0] || 'Juan',
          apellido: user.nombre_completo?.split(' ').slice(1).join(' ') || 'Pérez',
          fecha_nacimiento: '1998-05-15',
          dni: '12345678',
          nacionalidad: 'Argentina',
          posicion: 'Delantero',
          estatura: 180,
          peso: 75,
          pie_dominante: 'Derecho',
          estado: 'activo',
          email: user.correo || 'jugador@ejemplo.com',
          telefono: '+123456789',
          imagen_url: 'https://via.placeholder.com/150',
          equipo_actual: 'FC No Limit',
          numero_camiseta: 9,
          estadisticas: {
            partidos_jugados: 24,
            goles: 12,
            asistencias: 8,
            tarjetas_amarillas: 3,
            tarjetas_rojas: 0,
            minutos_jugados: 1850
          }
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error al cargar perfil del jugador:', error);
      setToastMessage('Error al cargar los datos. Intente nuevamente.');
      setToastColor('danger');
      setShowToast(true);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    history.push('/auth');
  };

  const handleEditProfile = () => {
    history.push('/jugador/perfil/editar');
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo': return 'success';
      case 'inactivo': return 'medium';
      case 'lesionado': return 'warning';
      case 'suspendido': return 'danger';
      default: return 'medium';
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mi Perfil</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleEditProfile}>
              <IonIcon slot="icon-only" icon={pencilOutline} />
            </IonButton>
            <IonButton onClick={handleLogout}>
              <IonIcon slot="icon-only" icon={logOutOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        <IonLoading isOpen={loading} message={'Cargando perfil...'} />
        
        {perfil && (
          <>
            <div className="profile-header">
              <IonAvatar className="profile-avatar">
                <img src={perfil.imagen_url || 'https://via.placeholder.com/150'} alt="Foto de perfil" />
              </IonAvatar>
              <h1>{`${perfil.nombre} ${perfil.apellido}`}</h1>
              <IonChip color={getEstadoColor(perfil.estado)}>
                {perfil.estado.charAt(0).toUpperCase() + perfil.estado.slice(1)}
              </IonChip>
              {perfil.equipo_actual && (
                <p className="equipo-actual">
                  <IonIcon icon={footballOutline} />
                  {perfil.equipo_actual}
                  {perfil.numero_camiseta && (
                    <IonBadge color="primary">#{perfil.numero_camiseta}</IonBadge>
                  )}
                </p>
              )}
            </div>

            <IonGrid>
              <IonRow>
                <IonCol size="12" sizeMd="6">
                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>
                        <IonIcon icon={informationCircleOutline} /> Información Personal
                      </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <IonList>
                        <IonItem>
                          <IonLabel>Posición</IonLabel>
                          <div slot="end">{perfil.posicion}</div>
                        </IonItem>
                        <IonItem>
                          <IonLabel>Fecha de Nacimiento</IonLabel>
                          <div slot="end">{new Date(perfil.fecha_nacimiento).toLocaleDateString()}</div>
                        </IonItem>
                        <IonItem>
                          <IonLabel>Nacionalidad</IonLabel>
                          <div slot="end">{perfil.nacionalidad}</div>
                        </IonItem>
                        <IonItem>
                          <IonLabel>DNI</IonLabel>
                          <div slot="end">{perfil.dni}</div>
                        </IonItem>
                        <IonItem>
                          <IonLabel>Pie Dominante</IonLabel>
                          <div slot="end">{perfil.pie_dominante}</div>
                        </IonItem>
                        <IonItem>
                          <IonLabel>Estatura</IonLabel>
                          <div slot="end">{perfil.estatura} cm</div>
                        </IonItem>
                        <IonItem>
                          <IonLabel>Peso</IonLabel>
                          <div slot="end">{perfil.peso} kg</div>
                        </IonItem>
                      </IonList>
                    </IonCardContent>
                  </IonCard>
                </IonCol>

                <IonCol size="12" sizeMd="6">
                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>
                        <IonIcon icon={statsChartOutline} /> Estadísticas
                      </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <div className="estadistica-item">
                        <div className="estadistica-valor">{perfil.estadisticas.partidos_jugados}</div>
                        <div className="estadistica-label">Partidos</div>
                      </div>
                      <div className="estadistica-item">
                        <div className="estadistica-valor">{perfil.estadisticas.goles}</div>
                        <div className="estadistica-label">Goles</div>
                      </div>
                      <div className="estadistica-item">
                        <div className="estadistica-valor">{perfil.estadisticas.asistencias}</div>
                        <div className="estadistica-label">Asistencias</div>
                      </div>
                      <div className="estadistica-item">
                        <div className="estadistica-valor">{perfil.estadisticas.tarjetas_amarillas}</div>
                        <div className="estadistica-label">Tarjetas Amarillas</div>
                      </div>
                      <div className="estadistica-item">
                        <div className="estadistica-valor">{perfil.estadisticas.tarjetas_rojas}</div>
                        <div className="estadistica-label">Tarjetas Rojas</div>
                      </div>
                      <div className="estadistica-item">
                        <div className="estadistica-valor">{Math.floor(perfil.estadisticas.minutos_jugados / 60)}</div>
                        <div className="estadistica-label">Horas jugadas</div>
                      </div>
                    </IonCardContent>
                  </IonCard>

                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>
                        <IonIcon icon={personOutline} /> Contacto
                      </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <IonList>
                        <IonItem>
                          <IonLabel>Email</IonLabel>
                          <div slot="end">{perfil.email}</div>
                        </IonItem>
                        <IonItem>
                          <IonLabel>Teléfono</IonLabel>
                          <div slot="end">{perfil.telefono}</div>
                        </IonItem>
                      </IonList>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>
            </IonGrid>
          </>
        )}

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          color={toastColor}
        />
      </IonContent>
    </IonPage>
  );
};

export default JugadorPerfil;