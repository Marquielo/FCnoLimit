import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonAlert,
  RefresherEventDetail,
  IonChip,
  IonBadge
} from '@ionic/react';
import { 
  calendar, 
  location, 
  time, 
  trophy,
  checkmarkCircle,
  ellipseOutline 
} from 'ionicons/icons';

interface Partido {
  id: number;
  equipo_local_id: number;
  equipo_visitante_id: number;
  goles_local: number;
  goles_visitante: number;
  fecha: string;
  estadio: string;
  estado: 'pendiente' | 'jugado' | 'suspendido';
  division_id: number;
  imagen_local?: string;
  nombre_local?: string;
  imagen_visitante?: string;
  nombre_visitante?: string;
  division_nombre?: string;
}

const MobilePartidos: React.FC = () => {
  const [segmentValue, setSegmentValue] = useState<string>('pendientes');
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showAlert, setShowAlert] = useState(false);

  const fetchPartidos = async (tipo: string) => {
    setLoading(true);
    setError('');
    
    try {
      let url = '';
      switch (tipo) {
        case 'pendientes':
          url = '/api/partidos/pendientes';
          break;
        case 'jugados':
          url = '/api/partidos/jugados';
          break;
        default:
          url = '/api/partidos';
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al cargar partidos');
      }
      
      const data = await response.json();
      setPartidos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartidos(segmentValue);
  }, [segmentValue]);

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    fetchPartidos(segmentValue).finally(() => {
      event.detail.complete();
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'jugado':
        return 'success';
      case 'pendiente':
        return 'warning';
      case 'suspendido':
        return 'danger';
      default:
        return 'medium';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'jugado':
        return checkmarkCircle;
      case 'pendiente':
        return ellipseOutline;
      default:
        return ellipseOutline;
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Partidos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Partidos</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* Segmento para filtrar partidos */}
        <div className="ion-padding-top">
          <IonSegment 
            value={segmentValue} 
            onIonChange={(e) => setSegmentValue(e.detail.value as string)}
          >
            <IonSegmentButton value="pendientes">
              <IonLabel>Pendientes</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="jugados">
              <IonLabel>Jugados</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="todos">
              <IonLabel>Todos</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>

        <div className="ion-padding">
          {loading && (
            <div className="ion-text-center ion-margin">
              <IonSpinner />
            </div>
          )}

          {!loading && partidos.length === 0 && (
            <IonCard>
              <IonCardContent className="ion-text-center">
                <IonIcon icon={trophy} size="large" color="medium" />
                <h3>No hay partidos disponibles</h3>
                <p>No se encontraron partidos para mostrar en esta categoría.</p>
              </IonCardContent>
            </IonCard>
          )}

          {!loading && partidos.map((partido) => (
            <IonCard key={partido.id} className="ion-margin-bottom">
              <IonCardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <IonCardSubtitle>
                    <IonIcon icon={calendar} /> {formatDate(partido.fecha)}
                  </IonCardSubtitle>
                  <IonChip color={getEstadoColor(partido.estado)}>
                    <IonIcon icon={getEstadoIcon(partido.estado)} />
                    <IonLabel>{partido.estado.toUpperCase()}</IonLabel>
                  </IonChip>
                </div>
                
                {partido.division_nombre && (
                  <IonBadge color="primary">{partido.division_nombre}</IonBadge>
                )}
              </IonCardHeader>

              <IonCardContent>
                {/* Información del partido */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: '15px' 
                }}>
                  {/* Equipo Local */}
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    {partido.imagen_local && (
                      <img 
                        src={partido.imagen_local} 
                        alt={partido.nombre_local}
                        style={{ width: '40px', height: '40px', marginBottom: '5px' }}
                      />
                    )}
                    <div style={{ fontWeight: 'bold' }}>
                      {partido.nombre_local || `Equipo ${partido.equipo_local_id}`}
                    </div>
                  </div>

                  {/* Marcador */}
                  <div style={{ textAlign: 'center', margin: '0 15px' }}>
                    {partido.estado === 'jugado' ? (
                      <div style={{ 
                        fontSize: '24px', 
                        fontWeight: 'bold',
                        color: 'var(--ion-color-primary)' 
                      }}>
                        {partido.goles_local} - {partido.goles_visitante}
                      </div>
                    ) : (
                      <div style={{ color: 'var(--ion-color-medium)' }}>
                        VS
                      </div>
                    )}
                  </div>

                  {/* Equipo Visitante */}
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    {partido.imagen_visitante && (
                      <img 
                        src={partido.imagen_visitante} 
                        alt={partido.nombre_visitante}
                        style={{ width: '40px', height: '40px', marginBottom: '5px' }}
                      />
                    )}
                    <div style={{ fontWeight: 'bold' }}>
                      {partido.nombre_visitante || `Equipo ${partido.equipo_visitante_id}`}
                    </div>
                  </div>
                </div>

                {/* Información adicional */}
                {partido.estadio && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    color: 'var(--ion-color-medium)',
                    fontSize: '14px' 
                  }}>
                    <IonIcon icon={location} style={{ marginRight: '5px' }} />
                    {partido.estadio}
                  </div>
                )}

                {/* Botón para ver detalles */}
                <div className="ion-margin-top">
                  <IonButton 
                    fill="outline" 
                    expand="block" 
                    size="small"
                    routerLink={`/mobile/partido/${partido.id}`}
                  >
                    Ver Detalles
                  </IonButton>
                </div>
              </IonCardContent>
            </IonCard>
          ))}
        </div>

        {/* Alert para errores */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Error"
          message={error}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default MobilePartidos;
