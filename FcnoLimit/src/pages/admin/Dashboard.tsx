import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonButton,
  IonLoading,
  IonToast
} from '@ionic/react';
import { 
  peopleOutline,
  footballOutline,
  trophyOutline,
  calendarOutline,
  statsChartOutline,
  personAddOutline,
  addCircleOutline,
  newspaperOutline,
  settingsOutline
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './Dashboard.css';

interface EstadisticasGlobales {
  jugadores: number;
  equipos: number;
  campeonatos: number;
  partidos_totales: number;
  partidos_pendientes: number;
  noticias: number;
}

const Dashboard: React.FC = () => {
  const [estadisticas, setEstadisticas] = useState<EstadisticasGlobales | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState('danger');
  
  const history = useHistory();

  useEffect(() => {
    fetchEstadisticas();
  }, []);

  const fetchEstadisticas = async () => {
    setLoading(true);
    try {
      // En un entorno real, aquí haríamos la llamada a la API
      // Simulamos datos para desarrollo
      setTimeout(() => {
        setEstadisticas({
          jugadores: 120,
          equipos: 8,
          campeonatos: 3,
          partidos_totales: 45,
          partidos_pendientes: 15,
          noticias: 24
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      setToastMessage('Error al cargar los datos. Intente nuevamente.');
      setToastColor('danger');
      setShowToast(true);
      setLoading(false);
    }
  };

  const modulos = [
    { 
      titulo: 'Gestión de Jugadores', 
      icono: peopleOutline, 
      color: 'primary',
      acciones: [
        { texto: 'Ver jugadores', ruta: '/admin/jugadores' },
        { texto: 'Añadir jugador', ruta: '/admin/jugadores/nuevo', icono: personAddOutline }
      ]
    },
    { 
      titulo: 'Equipos', 
      icono: peopleOutline, 
      color: 'success',
      acciones: [
        { texto: 'Ver equipos', ruta: '/admin/equipos' },
        { texto: 'Añadir equipo', ruta: '/admin/equipos/nuevo', icono: addCircleOutline }
      ]
    },
    { 
      titulo: 'Campeonatos', 
      icono: trophyOutline, 
      color: 'warning',
      acciones: [
        { texto: 'Ver campeonatos', ruta: '/admin/campeonatos' },
        { texto: 'Nuevo campeonato', ruta: '/admin/campeonatos/nuevo', icono: addCircleOutline }
      ]
    },
    { 
      titulo: 'Partidos', 
      icono: footballOutline, 
      color: 'danger',
      acciones: [
        { texto: 'Ver partidos', ruta: '/admin/partidos' },
        { texto: 'Programar partido', ruta: '/admin/partidos/nuevo', icono: calendarOutline }
      ]
    },
    { 
      titulo: 'Estadísticas', 
      icono: statsChartOutline, 
      color: 'tertiary',
      acciones: [
        { texto: 'Estadísticas globales', ruta: '/admin/estadisticas' },
        { texto: 'Reportes', ruta: '/admin/estadisticas/reportes', icono: statsChartOutline }
      ]
    },
    { 
      titulo: 'Noticias', 
      icono: newspaperOutline, 
      color: 'medium',
      acciones: [
        { texto: 'Ver noticias', ruta: '/admin/noticias' },
        { texto: 'Publicar noticia', ruta: '/admin/noticias/nueva', icono: addCircleOutline }
      ]
    },
    { 
      titulo: 'Configuración', 
      icono: settingsOutline, 
      color: 'dark',
      acciones: [
        { texto: 'Configuración general', ruta: '/admin/configuracion' },
        { texto: 'Gestión de usuarios', ruta: '/admin/usuarios', icono: peopleOutline }
      ]
    }
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Panel de Administración</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        <IonLoading isOpen={loading} message={'Cargando dashboard...'} />
        
        {estadisticas && (
          <>
            <IonGrid>
              <IonRow>
                <IonCol size="12">
                  <h2 className="dashboard-titulo">Resumen General</h2>
                </IonCol>
              </IonRow>
              
              <IonRow>
                <IonCol size="6" sizeMd="4" sizeLg="2">
                  <IonCard className="estadistica-card">
                    <IonCardContent className="text-center">
                      <div className="estadistica-icono">
                        <IonIcon icon={peopleOutline} color="primary" />
                      </div>
                      <div className="estadistica-valor">{estadisticas.jugadores}</div>
                      <div className="estadistica-titulo">Jugadores</div>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
                
                <IonCol size="6" sizeMd="4" sizeLg="2">
                  <IonCard className="estadistica-card">
                    <IonCardContent className="text-center">
                      <div className="estadistica-icono">
                        <IonIcon icon={peopleOutline} color="success" />
                      </div>
                      <div className="estadistica-valor">{estadisticas.equipos}</div>
                      <div className="estadistica-titulo">Equipos</div>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
                
                <IonCol size="6" sizeMd="4" sizeLg="2">
                  <IonCard className="estadistica-card">
                    <IonCardContent className="text-center">
                      <div className="estadistica-icono">
                        <IonIcon icon={trophyOutline} color="warning" />
                      </div>
                      <div className="estadistica-valor">{estadisticas.campeonatos}</div>
                      <div className="estadistica-titulo">Campeonatos</div>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
                
                <IonCol size="6" sizeMd="4" sizeLg="2">
                  <IonCard className="estadistica-card">
                    <IonCardContent className="text-center">
                      <div className="estadistica-icono">
                        <IonIcon icon={footballOutline} color="danger" />
                      </div>
                      <div className="estadistica-valor">{estadisticas.partidos_totales}</div>
                      <div className="estadistica-titulo">Partidos</div>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
                
                <IonCol size="6" sizeMd="4" sizeLg="2">
                  <IonCard className="estadistica-card">
                    <IonCardContent className="text-center">
                      <div className="estadistica-icono">
                        <IonIcon icon={calendarOutline} color="tertiary" />
                      </div>
                      <div className="estadistica-valor">{estadisticas.partidos_pendientes}</div>
                      <div className="estadistica-titulo">Pendientes</div>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
                
                <IonCol size="6" sizeMd="4" sizeLg="2">
                  <IonCard className="estadistica-card">
                    <IonCardContent className="text-center">
                      <div className="estadistica-icono">
                        <IonIcon icon={newspaperOutline} color="medium" />
                      </div>
                      <div className="estadistica-valor">{estadisticas.noticias}</div>
                      <div className="estadistica-titulo">Noticias</div>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>
              
              <IonRow>
                <IonCol size="12">
                  <h2 className="dashboard-titulo">Módulos de Administración</h2>
                </IonCol>
              </IonRow>
              
              <IonRow>
                {modulos.map((modulo, index) => (
                  <IonCol key={index} size="12" sizeMd="6" sizeLg="4">
                    <IonCard className="modulo-card">
                      <IonCardHeader>
                        <div className="modulo-header">
                          <div className={`modulo-icono bg-${modulo.color}`}>
                            <IonIcon icon={modulo.icono} />
                          </div>
                          <IonCardTitle>{modulo.titulo}</IonCardTitle>
                        </div>
                      </IonCardHeader>
                      <IonCardContent>
                        <div className="modulo-acciones">
                          {modulo.acciones.map((accion, i) => (
                            <IonButton 
                              key={i}
                              expand="block"
                              color={modulo.color}
                              fill={i === 0 ? "solid" : "outline"}
                              onClick={() => history.push(accion.ruta)}
                            >
                              {accion.icono && <IonIcon icon={accion.icono} slot="start" />}
                              {accion.texto}
                            </IonButton>
                          ))}
                        </div>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                ))}
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

export default Dashboard;