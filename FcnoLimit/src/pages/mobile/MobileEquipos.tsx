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
  IonCardTitle,
  IonIcon,
  IonButton,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonAlert,
  IonAvatar,
  IonItem,
  IonLabel,
  IonList,
  IonSearchbar,
  RefresherEventDetail,
  IonBadge
} from '@ionic/react';
import { 
  trophy, 
  people, 
  statsChart,
  search
} from 'ionicons/icons';

interface Equipo {
  id: number;
  nombre: string;
  imagen_url?: string;
  division_id?: number;
  division_nombre?: string;
  ciudad?: string;
  fundacion?: string;
}

const MobileEquipos: React.FC = () => {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [filteredEquipos, setFilteredEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showAlert, setShowAlert] = useState(false);
  const [searchText, setSearchText] = useState('');

  const fetchEquipos = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/equipos');
      if (!response.ok) {
        throw new Error('Error al cargar equipos');
      }
      
      const data = await response.json();
      setEquipos(data);
      setFilteredEquipos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipos();
  }, []);

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredEquipos(equipos);
    } else {
      const filtered = equipos.filter(equipo =>
        equipo.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
        (equipo.ciudad && equipo.ciudad.toLowerCase().includes(searchText.toLowerCase()))
      );
      setFilteredEquipos(filtered);
    }
  }, [searchText, equipos]);

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    fetchEquipos().finally(() => {
      event.detail.complete();
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Equipos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Equipos</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* Barra de búsqueda */}
        <div className="ion-padding">
          <IonSearchbar
            value={searchText}
            onIonInput={(e) => setSearchText(e.detail.value!)}
            placeholder="Buscar equipos..."
            showClearButton="focus"
          />
        </div>

        <div className="ion-padding">
          {loading && (
            <div className="ion-text-center ion-margin">
              <IonSpinner />
            </div>
          )}

          {!loading && filteredEquipos.length === 0 && (
            <IonCard>
              <IonCardContent className="ion-text-center">
                <IonIcon icon={search} size="large" color="medium" />
                <h3>No se encontraron equipos</h3>
                <p>
                  {searchText.trim() 
                    ? 'No hay equipos que coincidan con tu búsqueda.' 
                    : 'No hay equipos disponibles para mostrar.'
                  }
                </p>
              </IonCardContent>
            </IonCard>
          )}

          {!loading && filteredEquipos.length > 0 && (
            <IonList>
              {filteredEquipos.map((equipo) => (
                <IonCard key={equipo.id} className="ion-margin-bottom">
                  <IonItem button routerLink={`/mobile/equipo/${equipo.id}`}>
                    <IonAvatar slot="start">
                      {equipo.imagen_url ? (
                        <img 
                          src={equipo.imagen_url} 
                          alt={equipo.nombre}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/default-team.png';
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          background: 'var(--ion-color-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold'
                        }}>
                          {equipo.nombre.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </IonAvatar>
                    
                    <IonLabel>
                      <h2 style={{ fontWeight: 'bold' }}>{equipo.nombre}</h2>
                      {equipo.ciudad && (
                        <p style={{ color: 'var(--ion-color-medium)' }}>
                          📍 {equipo.ciudad}
                        </p>
                      )}
                      {equipo.fundacion && (
                        <p style={{ color: 'var(--ion-color-medium)', fontSize: '12px' }}>
                          Fundado: {equipo.fundacion}
                        </p>
                      )}
                    </IonLabel>

                    {equipo.division_nombre && (
                      <IonBadge slot="end" color="secondary">
                        {equipo.division_nombre}
                      </IonBadge>
                    )}
                  </IonItem>

                  <IonCardContent>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <IonButton 
                        fill="outline" 
                        size="small" 
                        expand="block"
                        routerLink={`/mobile/equipo/${equipo.id}/partidos`}
                      >
                        <IonIcon icon={trophy} slot="start" />
                        Partidos
                      </IonButton>
                      <IonButton 
                        fill="outline" 
                        size="small" 
                        expand="block"
                        routerLink={`/mobile/equipo/${equipo.id}/jugadores`}
                      >
                        <IonIcon icon={people} slot="start" />
                        Jugadores
                      </IonButton>
                      <IonButton 
                        fill="outline" 
                        size="small" 
                        expand="block"
                        routerLink={`/mobile/equipo/${equipo.id}/estadisticas`}
                      >
                        <IonIcon icon={statsChart} slot="start" />
                        Stats
                      </IonButton>
                    </div>
                  </IonCardContent>
                </IonCard>
              ))}
            </IonList>
          )}
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

export default MobileEquipos;
