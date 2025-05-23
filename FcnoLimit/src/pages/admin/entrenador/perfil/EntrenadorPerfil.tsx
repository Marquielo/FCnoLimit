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
  IonGrid,
  IonRow,
  IonCol,
  IonLoading,
  IonToast,
  IonBadge
} from '@ionic/react';
import { 
  personOutline, 
  footballOutline, 
  schoolOutline,
  pencilOutline,
  informationCircleOutline,
  clipboardOutline,
  timeOutline,
  logOutOutline
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

interface EntrenadorDetalle {
  id: number;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  dni: string;
  nacionalidad: string;
  especialidad: string;
  nivel_experiencia: 'principiante' | 'intermedio' | 'avanzado' | 'experto';
  estado: 'activo' | 'inactivo';
  email: string;
  telefono: string;
  imagen_url?: string;
  equipo_actual?: string;
  cargo?: string;
  licencias: string[];
  experiencia: Array<{
    equipo: string;
    cargo: string;
    fecha_inicio: string;
    fecha_fin?: string;
  }>;
}

const EntrenadorPerfil: React.FC = () => {
  const [perfil, setPerfil] = useState<EntrenadorDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState('danger');
  
  const history = useHistory();

  useEffect(() => {
    fetchEntrenadorPerfil();
  }, []);

  const fetchEntrenadorPerfil = async () => {
    setLoading(true);
    try {
      const userJSON = localStorage.getItem('usuario');
      if (!userJSON) throw new Error('No se encontró la sesión del usuario');
      
      const user = JSON.parse(userJSON);
      
      // En un entorno real, aquí haríamos la llamada a la API
      // const response = await fetch(`https://fcnolimit-back.onrender.com/api/entrenadores/${user.id}`);
      // const data = await response.json();
      // setPerfil(data);
      
      // Simulamos datos para desarrollo
      setTimeout(() => {
        setPerfil({
          id: 1,
          nombre: user.nombre_completo?.split(' ')[0] || 'Carlos',
          apellido: user.nombre_completo?.split(' ').slice(1).join(' ') || 'Rodríguez',
          fecha_nacimiento: '1978-05-15',
          dni: '23456789',
          nacionalidad: 'Argentina',
          especialidad: 'Táctica Defensiva',
          nivel_experiencia: 'avanzado',
          estado: 'activo',
          email: user.correo || 'entrenador@ejemplo.com',
          telefono: '+123456789',
          imagen_url: 'https://via.placeholder.com/150',
          equipo_actual: 'FC No Limit',
          cargo: 'Director Técnico',
          licencias: ['UEFA B', 'CONMEBOL Pro'],
          experiencia: [
            {
              equipo: 'FC No Limit',
              cargo: 'Director Técnico',
              fecha_inicio: '2021-01-15',
              fecha_fin: undefined
            },
            {
              equipo: 'Real Deportivo',
              cargo: 'Asistente Técnico',
              fecha_inicio: '2018-06-01',
              fecha_fin: '2020-12-31'
            },
            {
              equipo: 'Atlético Nacional',
              cargo: 'Entrenador de Juveniles',
              fecha_inicio: '2015-03-10',
              fecha_fin: '2018-05-30'
            }
          ]
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error al cargar perfil del entrenador:', error);
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
    history.push('/entrenador/perfil/editar');
  };

  const getNivelExperienciaColor = (nivel: string) => {
    switch (nivel) {
      case 'principiante': return 'primary';
      case 'intermedio': return 'tertiary';
      case 'avanzado': return 'secondary';
      case 'experto': return 'danger';
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
              <div className="profile-badges">
                <IonChip color="success">
                  {perfil.estado === 'activo' ? 'Activo' : 'Inactivo'}
                </IonChip>
                <IonChip color={getNivelExperienciaColor(perfil.nivel_experiencia)}>
                  {perfil.nivel_experiencia.charAt(0).toUpperCase() + perfil.nivel_experiencia.slice(1)}
                </IonChip>
              </div>
              {perfil.equipo_actual && (
                <p className="equipo-actual">
                  <IonIcon icon={footballOutline} />
                  {perfil.equipo_actual}
                  {perfil.cargo && (
                    <span className="cargo"> - {perfil.cargo}</span>
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
                          <IonLabel>Especialidad</IonLabel>
                          <div slot="end">{perfil.especialidad}</div>
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
                      </IonList>
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

                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>
                        <IonIcon icon={schoolOutline} /> Licencias y Certificaciones
                      </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <div className="licencias-container">
                        {perfil.licencias.map((licencia, index) => (
                          <IonBadge key={index} color="tertiary" className="licencia-badge">
                            {licencia}
                          </IonBadge>
                        ))}
                      </div>
                    </IonCardContent>
                  </IonCard>
                </IonCol>

                <IonCol size="12" sizeMd="6">
                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>
                        <IonIcon icon={clipboardOutline} /> Experiencia
                      </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <IonList>
                        {perfil.experiencia.map((exp, index) => (
                          <div key={index} className="experiencia-item">
                            <div className="experiencia-periodo">
                              <IonIcon icon={timeOutline} />
                              {new Date(exp.fecha_inicio).getFullYear()} - 
                              {exp.fecha_fin 
                                ? new Date(exp.fecha_fin).getFullYear() 
                                : 'Actual'}
                            </div>
                            <h3 className="experiencia-equipo">{exp.equipo}</h3>
                            <div className="experiencia-cargo">{exp.cargo}</div>
                            {index < perfil.experiencia.length - 1 && <hr />}
                          </div>
                        ))}
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

export default EntrenadorPerfil;