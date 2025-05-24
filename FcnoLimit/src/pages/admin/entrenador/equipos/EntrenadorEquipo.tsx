import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonAvatar,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonSearchbar,
  IonChip,
  IonIcon,
  IonBadge,
  IonSelect,
  IonSelectOption,
  IonModal,
  IonButtons,
  IonBackButton,
  IonList,
  IonText,
} from '@ionic/react';
import { peopleCircleOutline, footballOutline, alertCircleOutline, fitnessOutline, trophyOutline } from 'ionicons/icons';

// Interfaces para datos
interface Jugador {
  id: number;
  nombre: string;
  posicion: string;
  edad: number;
  numero: number;
  imagen: string;
  estado: 'disponible' | 'lesionado' | 'sancionado';
  estadisticas: {
    partidos: number;
    goles: number;
    asistencias: number;
    tarjetasAmarillas: number;
    tarjetasRojas: number;
  };
}

const EntrenadorEquipo: React.FC = () => {
  const [busqueda, setBusqueda] = useState<string>('');
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [filtro, setFiltro] = useState<string>('todos');
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState<Jugador | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Datos de ejemplo
  useEffect(() => {
    // Aquí cargarías los datos desde tu API
    const datosEjemplo: Jugador[] = [
      {
        id: 1,
        nombre: 'Carlos Martínez',
        posicion: 'Delantero',
        edad: 24,
        numero: 9,
        imagen: 'https://ionicframework.com/docs/img/demos/avatar.svg',
        estado: 'disponible',
        estadisticas: {
          partidos: 15,
          goles: 12,
          asistencias: 5,
          tarjetasAmarillas: 2,
          tarjetasRojas: 0
        }
      },
      {
        id: 2,
        nombre: 'Juan Pérez',
        posicion: 'Mediocampista',
        edad: 22,
        numero: 8,
        imagen: 'https://ionicframework.com/docs/img/demos/avatar.svg',
        estado: 'lesionado',
        estadisticas: {
          partidos: 14,
          goles: 3,
          asistencias: 10,
          tarjetasAmarillas: 4,
          tarjetasRojas: 0
        }
      },
      {
        id: 3,
        nombre: 'Miguel López',
        posicion: 'Defensa',
        edad: 26,
        numero: 4,
        imagen: 'https://ionicframework.com/docs/img/demos/avatar.svg',
        estado: 'disponible',
        estadisticas: {
          partidos: 16,
          goles: 1,
          asistencias: 2,
          tarjetasAmarillas: 3,
          tarjetasRojas: 1
        }
      },
      {
        id: 4,
        nombre: 'Andrés Silva',
        posicion: 'Portero',
        edad: 29,
        numero: 1,
        imagen: 'https://ionicframework.com/docs/img/demos/avatar.svg',
        estado: 'sancionado',
        estadisticas: {
          partidos: 16,
          goles: 0,
          asistencias: 0,
          tarjetasAmarillas: 1,
          tarjetasRojas: 0
        }
      }
    ];

    setJugadores(datosEjemplo);
  }, []);

  // Filtrar jugadores según búsqueda y filtro
  const jugadoresFiltrados = jugadores.filter(jugador => {
    const coincideBusqueda = jugador.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideFiltro = 
      filtro === 'todos' || 
      (filtro === 'disponibles' && jugador.estado === 'disponible') ||
      (filtro === 'lesionados' && jugador.estado === 'lesionado') ||
      (filtro === 'sancionados' && jugador.estado === 'sancionado');
    
    return coincideBusqueda && coincideFiltro;
  });

  // Mostrar detalles del jugador
  const verDetalles = (jugador: Jugador) => {
    setJugadorSeleccionado(jugador);
    setShowModal(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Gestión de Equipo</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Resumen del Equipo</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol size="6" size-md="3">
                  <div className="ion-text-center">
                    <IonIcon icon={peopleCircleOutline} color="primary" style={{ fontSize: '2rem' }} />
                    <p><strong>Jugadores</strong></p>
                    <IonText color="primary">
                      <h2>{jugadores.length}</h2>
                    </IonText>
                  </div>
                </IonCol>
                <IonCol size="6" size-md="3">
                  <div className="ion-text-center">
                    <IonIcon icon={footballOutline} color="success" style={{ fontSize: '2rem' }} />
                    <p><strong>Disponibles</strong></p>
                    <IonText color="success">
                      <h2>{jugadores.filter(j => j.estado === 'disponible').length}</h2>
                    </IonText>
                  </div>
                </IonCol>
                <IonCol size="6" size-md="3">
                  <div className="ion-text-center">
                    <IonIcon icon={fitnessOutline} color="warning" style={{ fontSize: '2rem' }} />
                    <p><strong>Lesionados</strong></p>
                    <IonText color="warning">
                      <h2>{jugadores.filter(j => j.estado === 'lesionado').length}</h2>
                    </IonText>
                  </div>
                </IonCol>
                <IonCol size="6" size-md="3">
                  <div className="ion-text-center">
                    <IonIcon icon={alertCircleOutline} color="danger" style={{ fontSize: '2rem' }} />
                    <p><strong>Sancionados</strong></p>
                    <IonText color="danger">
                      <h2>{jugadores.filter(j => j.estado === 'sancionado').length}</h2>
                    </IonText>
                  </div>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        <IonGrid>
          <IonRow className="ion-align-items-center">
            <IonCol size="12" size-md="6">
              <IonSearchbar
                value={busqueda}
                onIonChange={e => setBusqueda(e.detail.value || '')}
                placeholder="Buscar jugador..."
              />
            </IonCol>
            <IonCol size="12" size-md="6">
              <IonSelect
                value={filtro}
                onIonChange={e => setFiltro(e.detail.value)}
                interface="popover"
                placeholder="Filtrar por estado"
              >
                <IonSelectOption value="todos">Todos</IonSelectOption>
                <IonSelectOption value="disponibles">Disponibles</IonSelectOption>
                <IonSelectOption value="lesionados">Lesionados</IonSelectOption>
                <IonSelectOption value="sancionados">Sancionados</IonSelectOption>
              </IonSelect>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonGrid>
          <IonRow>
            {jugadoresFiltrados.map(jugador => (
              <IonCol size="12" size-md="6" size-lg="4" key={jugador.id}>
                <IonCard>
                  <IonItem>
                    <IonAvatar slot="start">
                      <img src={jugador.imagen} alt={jugador.nombre} />
                    </IonAvatar>
                    <IonLabel>
                      <h2>{jugador.nombre}</h2>
                      <p>{jugador.posicion}</p>
                    </IonLabel>
                    <IonBadge slot="end" color={
                      jugador.estado === 'disponible' ? 'success' :
                      jugador.estado === 'lesionado' ? 'warning' : 'danger'
                    }>
                      {jugador.estado === 'disponible' ? 'Disponible' :
                       jugador.estado === 'lesionado' ? 'Lesionado' : 'Sancionado'}
                    </IonBadge>
                  </IonItem>
                  <IonCardContent>
                    <IonGrid>
                      <IonRow>
                        <IonCol size="6">
                          <p><strong>Edad:</strong> {jugador.edad}</p>
                        </IonCol>
                        <IonCol size="6">
                          <p><strong>Número:</strong> {jugador.numero}</p>
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size="12" className="ion-text-center">
                          <IonButton fill="clear" onClick={() => verDetalles(jugador)}>
                            Ver detalles
                          </IonButton>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          {jugadorSeleccionado && (
            <IonPage>
              <IonHeader>
                <IonToolbar>
                  <IonButtons slot="start">
                    <IonButton onClick={() => setShowModal(false)}>Cerrar</IonButton>
                  </IonButtons>
                  <IonTitle>{jugadorSeleccionado.nombre}</IonTitle>
                </IonToolbar>
              </IonHeader>
              <IonContent className="ion-padding">
                <div className="ion-text-center ion-margin-bottom">
                  <IonAvatar style={{ margin: '0 auto', width: '100px', height: '100px' }}>
                    <img src={jugadorSeleccionado.imagen} alt={jugadorSeleccionado.nombre} />
                  </IonAvatar>
                  <h1>{jugadorSeleccionado.nombre}</h1>
                  <IonChip>
                    {jugadorSeleccionado.posicion}
                  </IonChip>
                  <IonChip color={
                    jugadorSeleccionado.estado === 'disponible' ? 'success' :
                    jugadorSeleccionado.estado === 'lesionado' ? 'warning' : 'danger'
                  }>
                    {jugadorSeleccionado.estado === 'disponible' ? 'Disponible' :
                     jugadorSeleccionado.estado === 'lesionado' ? 'Lesionado' : 'Sancionado'}
                  </IonChip>
                </div>

                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>Información Personal</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonGrid>
                      <IonRow>
                        <IonCol size="6">
                          <p><strong>Edad:</strong> {jugadorSeleccionado.edad}</p>
                        </IonCol>
                        <IonCol size="6">
                          <p><strong>Número:</strong> {jugadorSeleccionado.numero}</p>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonCardContent>
                </IonCard>

                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>Estadísticas</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonGrid>
                      <IonRow>
                        <IonCol size="6" size-md="4">
                          <div className="ion-text-center">
                            <IonIcon icon={trophyOutline} color="primary" style={{ fontSize: '1.5rem' }} />
                            <p>Partidos</p>
                            <h2>{jugadorSeleccionado.estadisticas.partidos}</h2>
                          </div>
                        </IonCol>
                        <IonCol size="6" size-md="4">
                          <div className="ion-text-center">
                            <IonIcon icon={footballOutline} color="success" style={{ fontSize: '1.5rem' }} />
                            <p>Goles</p>
                            <h2>{jugadorSeleccionado.estadisticas.goles}</h2>
                          </div>
                        </IonCol>
                        <IonCol size="6" size-md="4">
                          <div className="ion-text-center">
                            <IonIcon icon={peopleCircleOutline} color="tertiary" style={{ fontSize: '1.5rem' }} />
                            <p>Asistencias</p>
                            <h2>{jugadorSeleccionado.estadisticas.asistencias}</h2>
                          </div>
                        </IonCol>
                        <IonCol size="6" size-md="6">
                          <div className="ion-text-center">
                            <IonIcon icon={alertCircleOutline} color="warning" style={{ fontSize: '1.5rem' }} />
                            <p>Tarjetas Amarillas</p>
                            <h2>{jugadorSeleccionado.estadisticas.tarjetasAmarillas}</h2>
                          </div>
                        </IonCol>
                        <IonCol size="6" size-md="6">
                          <div className="ion-text-center">
                            <IonIcon icon={alertCircleOutline} color="danger" style={{ fontSize: '1.5rem' }} />
                            <p>Tarjetas Rojas</p>
                            <h2>{jugadorSeleccionado.estadisticas.tarjetasRojas}</h2>
                          </div>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonCardContent>
                </IonCard>
                
                <IonRow className="ion-justify-content-center ion-margin-top">
                  <IonCol size="12" size-md="6">
                    <IonButton expand="block" color="primary">
                      Editar Información
                    </IonButton>
                  </IonCol>
                  <IonCol size="12" size-md="6">
                    <IonButton expand="block" color={jugadorSeleccionado.estado === 'disponible' ? 'danger' : 'success'}>
                      {jugadorSeleccionado.estado === 'disponible' ? 'Marcar como No Disponible' : 'Marcar como Disponible'}
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonContent>
            </IonPage>
          )}
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default EntrenadorEquipo;