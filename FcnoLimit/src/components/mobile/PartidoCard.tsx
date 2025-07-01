import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonChip,
  IonLabel,
  IonBadge,
  IonButton
} from '@ionic/react';
import { 
  calendar, 
  location, 
  trophy,
  checkmarkCircle,
  ellipseOutline,
  statsChart
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

interface PartidoCardProps {
  partido: Partido;
  showDetails?: boolean;
}

const PartidoCard: React.FC<PartidoCardProps> = ({ partido, showDetails = false }) => {
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
    <IonCard className="ion-margin-bottom">
      <IonCardHeader>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '14px', color: 'var(--ion-color-medium)' }}>
            <IonIcon icon={calendar} /> {formatDate(partido.fecha)}
          </div>
          <IonChip color={getEstadoColor(partido.estado)}>
            <IonIcon icon={getEstadoIcon(partido.estado)} />
            <IonLabel>{partido.estado.toUpperCase()}</IonLabel>
          </IonChip>
        </div>
        
        {partido.division_nombre && (
          <IonBadge color="primary" style={{ marginTop: '8px' }}>
            {partido.division_nombre}
          </IonBadge>
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
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  marginBottom: '8px',
                  borderRadius: '8px',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
              {partido.nombre_local || `Equipo ${partido.equipo_local_id}`}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--ion-color-medium)' }}>
              Local
            </div>
          </div>

          {/* Marcador */}
          <div style={{ textAlign: 'center', margin: '0 20px' }}>
            {partido.estado === 'jugado' ? (
              <div style={{ 
                fontSize: '28px', 
                fontWeight: 'bold',
                color: 'var(--ion-color-primary)',
                lineHeight: '1'
              }}>
                {partido.goles_local} - {partido.goles_visitante}
              </div>
            ) : (
              <div style={{ 
                fontSize: '18px',
                color: 'var(--ion-color-medium)',
                fontWeight: 'bold'
              }}>
                VS
              </div>
            )}
            <div style={{ 
              fontSize: '12px', 
              color: 'var(--ion-color-medium)',
              marginTop: '4px'
            }}>
              {partido.estado === 'jugado' ? 'Final' : 'Por jugar'}
            </div>
          </div>

          {/* Equipo Visitante */}
          <div style={{ textAlign: 'center', flex: 1 }}>
            {partido.imagen_visitante && (
              <img 
                src={partido.imagen_visitante} 
                alt={partido.nombre_visitante}
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  marginBottom: '8px',
                  borderRadius: '8px',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
              {partido.nombre_visitante || `Equipo ${partido.equipo_visitante_id}`}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--ion-color-medium)' }}>
              Visitante
            </div>
          </div>
        </div>

        {/* Información adicional */}
        {partido.estadio && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            color: 'var(--ion-color-medium)',
            fontSize: '14px',
            marginBottom: '15px',
            justifyContent: 'center'
          }}>
            <IonIcon icon={location} style={{ marginRight: '8px' }} />
            {partido.estadio}
          </div>
        )}

        {/* Botones de acción */}
        {showDetails && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <IonButton 
              fill="outline" 
              expand="block" 
              size="small"
              routerLink={`/mobile/partido/${partido.id}`}
            >
              <IonIcon icon={trophy} slot="start" />
              Ver Partido
            </IonButton>
            {partido.estado === 'jugado' && (
              <IonButton 
                fill="outline" 
                expand="block" 
                size="small"
                routerLink={`/mobile/partido/${partido.id}/estadisticas`}
              >
                <IonIcon icon={statsChart} slot="start" />
                Estadísticas
              </IonButton>
            )}
          </div>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default PartidoCard;
