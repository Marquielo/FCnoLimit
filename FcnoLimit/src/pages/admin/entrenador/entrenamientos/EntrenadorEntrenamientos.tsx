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
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonList,
  IonFab,
  IonFabButton,
  IonModal,
  IonInput,
  IonTextarea,
  IonDatetime,
  IonButtons,
  IonBackButton,
  IonSelect,
  IonSelectOption,
  IonChip,
  IonBadge,
  IonSegment,
  IonSegmentButton,
} from '@ionic/react';
import { add, calendar, time, location, people, informationCircle, checkmark, close, create, trash } from 'ionicons/icons';

// Interfaces
interface Entrenamiento {
  id: number;
  titulo: string;
  fecha: string;
  hora: string;
  duracion: string;
  lugar: string;
  tipo: string;
  descripcion: string;
  completado: boolean;
  asistencias: {
    total: number;
    presentes: number;
  };
}

const EntrenadorEntrenamientos: React.FC = () => {
  const [entrenamientos, setEntrenamientos] = useState<Entrenamiento[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDetalles, setShowDetalles] = useState<boolean>(false);
  const [entrenamientoSeleccionado, setEntrenamientoSeleccionado] = useState<Entrenamiento | null>(null);
  const [filtro, setFiltro] = useState<string>('proximos');

  // Nuevos campos para el formulario
  const [nuevoTitulo, setNuevoTitulo] = useState<string>('');
  const [nuevaFecha, setNuevaFecha] = useState<string>('');
  const [nuevaHora, setNuevaHora] = useState<string>('');
  const [nuevaDuracion, setNuevaDuracion] = useState<string>('');
  const [nuevoLugar, setNuevoLugar] = useState<string>('');
  const [nuevoTipo, setNuevoTipo] = useState<string>('');
  const [nuevaDescripcion, setNuevaDescripcion] = useState<string>('');

  // Datos de ejemplo
  useEffect(() => {
    // Aquí cargarías los datos desde tu API
    const datosEjemplo: Entrenamiento[] = [
      {
        id: 1,
        titulo: 'Entrenamiento físico',
        fecha: '2025-05-25',
        hora: '18:00',
        duracion: '90 minutos',
        lugar: 'Campo principal',
        tipo: 'Físico',
        descripcion: 'Ejercicios de resistencia y velocidad.',
        completado: false,
        asistencias: {
          total: 22,
          presentes: 0,
        }
      },
      {
        id: 2,
        titulo: 'Táctica defensiva',
        fecha: '2025-05-27',
        hora: '17:30',
        duracion: '120 minutos',
        lugar: 'Campo auxiliar',
        tipo: 'Táctico',
        descripcion: 'Trabajo en líneas defensivas y presión alta.',
        completado: false,
        asistencias: {
          total: 22,
          presentes: 0,
        }
      },
      {
        id: 3,
        titulo: 'Técnica individual',
        fecha: '2025-05-22',
        hora: '18:00',
        duracion: '90 minutos',
        lugar: 'Gimnasio',
        tipo: 'Técnico',
        descripcion: 'Mejora de técnica individual con balón.',
        completado: true,
        asistencias: {
          total: 22,
          presentes: 20,
        }
      },
      {
        id: 4,
        titulo: 'Partidos reducidos',
        fecha: '2025-05-20',
        hora: '16:30',
        duracion: '120 minutos',
        lugar: 'Campo principal',
        tipo: 'Táctico',
        descripcion: 'Partidos 5 vs 5 con diferentes reglas.',
        completado: true,
        asistencias: {
          total: 22,
          presentes: 18,
        }
      }
    ];

    setEntrenamientos(datosEjemplo);
  }, []);

  // Filtrar entrenamientos
  const entrenamientosFiltrados = entrenamientos.filter(
    entrenamiento => filtro === 'proximos' ? !entrenamiento.completado : entrenamiento.completado
  );

  // Manejadores para el formulario
  const crearEntrenamiento = () => {
    setShowModal(true);
    // Limpiar campos del formulario
    setNuevoTitulo('');
    setNuevaFecha('');
    setNuevaHora('');
    setNuevaDuracion('');
    setNuevoLugar('');
    setNuevoTipo('');
    setNuevaDescripcion('');
  };

  const guardarEntrenamiento = () => {
    // Aquí enviarías los datos a tu API
    const nuevoEntrenamiento: Entrenamiento = {
      id: entrenamientos.length + 1,
      titulo: nuevoTitulo,
      fecha: nuevaFecha,
      hora: nuevaHora,
      duracion: nuevaDuracion,
      lugar: nuevoLugar,
      tipo: nuevoTipo,
      descripcion: nuevaDescripcion,
      completado: false,
      asistencias: {
        total: 22, // Valor por defecto
        presentes: 0,
      }
    };

    setEntrenamientos([...entrenamientos, nuevoEntrenamiento]);
    setShowModal(false);
  };

  const verDetalles = (entrenamiento: Entrenamiento) => {
    setEntrenamientoSeleccionado(entrenamiento);
    setShowDetalles(true);
  };

  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Entrenamientos</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonSegment value={filtro} onIonChange={e => setFiltro(e.detail.value as string)}>
          <IonSegmentButton value="proximos">
            <IonLabel>Próximos</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="completados">
            <IonLabel>Completados</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {entrenamientosFiltrados.length === 0 ? (
          <IonCard>
            <IonCardContent className="ion-text-center">
              {filtro === 'proximos' ? 
                'No hay entrenamientos programados. Crea uno nuevo.' : 
                'No hay entrenamientos completados.'}
            </IonCardContent>
          </IonCard>
        ) : (
          <IonGrid>
            <IonRow>
              {entrenamientosFiltrados.map(entrenamiento => (
                <IonCol size="12" size-md="6" key={entrenamiento.id}>
                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>{entrenamiento.titulo}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <IonList lines="none">
                        <IonItem>
                          <IonIcon icon={calendar} slot="start" color="primary" />
                          <IonLabel>
                            <h3>Fecha</h3>
                            <p>{formatearFecha(entrenamiento.fecha)}</p>
                          </IonLabel>
                        </IonItem>
                        <IonItem>
                          <IonIcon icon={time} slot="start" color="primary" />
                          <IonLabel>
                            <h3>Hora</h3>
                            <p>{entrenamiento.hora} ({entrenamiento.duracion})</p>
                          </IonLabel>
                        </IonItem>
                        <IonItem>
                          <IonIcon icon={location} slot="start" color="primary" />
                          <IonLabel>
                            <h3>Lugar</h3>
                            <p>{entrenamiento.lugar}</p>
                          </IonLabel>
                        </IonItem>
                      </IonList>

                      <IonChip color="primary">{entrenamiento.tipo}</IonChip>
                      
                      {entrenamiento.completado && (
                        <IonItem lines="none">
                          <IonIcon icon={people} slot="start" color="primary" />
                          <IonLabel>
                            <h3>Asistencia</h3>
                            <p>{entrenamiento.asistencias.presentes} de {entrenamiento.asistencias.total}</p>
                          </IonLabel>
                          <IonBadge color="success" slot="end">
                            {Math.round((entrenamiento.asistencias.presentes / entrenamiento.asistencias.total) * 100)}%
                          </IonBadge>
                        </IonItem>
                      )}

                      <div className="ion-text-end ion-margin-top">
                        <IonButton fill="clear" onClick={() => verDetalles(entrenamiento)}>
                          Ver detalles
                        </IonButton>
                        {!entrenamiento.completado && (
                          <IonButton fill="outline" color="success">
                            <IonIcon icon={checkmark} slot="start" />
                            Completar
                          </IonButton>
                        )}
                      </div>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={crearEntrenamiento}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        {/* Modal para crear nuevo entrenamiento */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonPage>
            <IonHeader>
              <IonToolbar>
                <IonButtons slot="start">
                  <IonButton onClick={() => setShowModal(false)}>Cancelar</IonButton>
                </IonButtons>
                <IonTitle>Nuevo Entrenamiento</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={guardarEntrenamiento} strong>Guardar</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              <IonList>
                <IonItem>
                  <IonLabel position="floating">Título</IonLabel>
                  <IonInput
                    value={nuevoTitulo}
                    onIonChange={e => setNuevoTitulo(e.detail.value || '')}
                    required
                  />
                </IonItem>
                <IonItem>
                  <IonLabel>Fecha</IonLabel>
                  <IonDatetime
                    presentation="date"
                    min="2023-01-01"
                    max="2030-12-31"
                    value={nuevaFecha}
                    onIonChange={(e) => setNuevaFecha(e.detail.value as string)}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Hora</IonLabel>
                  <IonInput
                    type="time"
                    value={nuevaHora}
                    onIonChange={e => setNuevaHora(e.detail.value || '')}
                    required
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Duración</IonLabel>
                  <IonInput
                    value={nuevaDuracion}
                    onIonChange={e => setNuevaDuracion(e.detail.value || '')}
                    placeholder="Ej: 90 minutos"
                    required
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Lugar</IonLabel>
                  <IonInput
                    value={nuevoLugar}
                    onIonChange={e => setNuevoLugar(e.detail.value || '')}
                    required
                  />
                </IonItem>
                <IonItem>
                  <IonLabel>Tipo</IonLabel>
                  <IonSelect
                    value={nuevoTipo}
                    onIonChange={e => setNuevoTipo(e.detail.value)}
                  >
                    <IonSelectOption value="Físico">Físico</IonSelectOption>
                    <IonSelectOption value="Técnico">Técnico</IonSelectOption>
                    <IonSelectOption value="Táctico">Táctico</IonSelectOption>
                    <IonSelectOption value="Recuperación">Recuperación</IonSelectOption>
                    <IonSelectOption value="Partido">Partido de práctica</IonSelectOption>
                  </IonSelect>
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Descripción</IonLabel>
                  <IonTextarea
                    value={nuevaDescripcion}
                    onIonChange={e => setNuevaDescripcion(e.detail.value || '')}
                    rows={4}
                  />
                </IonItem>
              </IonList>
            </IonContent>
          </IonPage>
        </IonModal>

        {/* Modal de detalles de entrenamiento */}
        <IonModal isOpen={showDetalles} onDidDismiss={() => setShowDetalles(false)}>
          {entrenamientoSeleccionado && (
            <IonPage>
              <IonHeader>
                <IonToolbar>
                  <IonButtons slot="start">
                    <IonButton onClick={() => setShowDetalles(false)}>Cerrar</IonButton>
                  </IonButtons>
                  <IonTitle>{entrenamientoSeleccionado.titulo}</IonTitle>
                  <IonButtons slot="end">
                    {!entrenamientoSeleccionado.completado && (
                      <IonButton color="primary">
                        <IonIcon icon={create} />
                      </IonButton>
                    )}
                  </IonButtons>
                </IonToolbar>
              </IonHeader>
              <IonContent className="ion-padding">
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>Detalles del Entrenamiento</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonList lines="none">
                      <IonItem>
                        <IonIcon icon={calendar} slot="start" color="primary" />
                        <IonLabel>
                          <h3>Fecha</h3>
                          <p>{formatearFecha(entrenamientoSeleccionado.fecha)}</p>
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonIcon icon={time} slot="start" color="primary" />
                        <IonLabel>
                          <h3>Hora</h3>
                          <p>{entrenamientoSeleccionado.hora}</p>
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonIcon icon={time} slot="start" color="primary" />
                        <IonLabel>
                          <h3>Duración</h3>
                          <p>{entrenamientoSeleccionado.duracion}</p>
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonIcon icon={location} slot="start" color="primary" />
                        <IonLabel>
                          <h3>Lugar</h3>
                          <p>{entrenamientoSeleccionado.lugar}</p>
                        </IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonIcon icon={informationCircle} slot="start" color="primary" />
                        <IonLabel>
                          <h3>Estado</h3>
                          {entrenamientoSeleccionado.completado ? (
                            <IonChip color="success">
                              <IonIcon icon={checkmark} />
                              <IonLabel>Completado</IonLabel>
                            </IonChip>
                          ) : (
                            <IonChip>
                              <IonIcon icon={calendar} />
                              <IonLabel>Programado</IonLabel>
                            </IonChip>
                          )}
                        </IonLabel>
                      </IonItem>
                    </IonList>

                    {entrenamientoSeleccionado.descripcion && (
                      <>
                        <h3>Descripción</h3>
                        <p>{entrenamientoSeleccionado.descripcion}</p>
                      </>
                    )}

                    {entrenamientoSeleccionado.completado && (
                      <div>
                        <h3>Estadísticas de Asistencia</h3>
                        <p>
                          <strong>Total de jugadores:</strong> {entrenamientoSeleccionado.asistencias.total}
                          <br />
                          <strong>Asistentes:</strong> {entrenamientoSeleccionado.asistencias.presentes} 
                          ({Math.round((entrenamientoSeleccionado.asistencias.presentes / entrenamientoSeleccionado.asistencias.total) * 100)}%)
                        </p>
                      </div>
                    )}
                  </IonCardContent>
                </IonCard>

                {!entrenamientoSeleccionado.completado && (
                  <IonRow className="ion-margin-top">
                    <IonCol>
                      <IonButton expand="block" color="success">
                        <IonIcon icon={checkmark} slot="start" />
                        Marcar como Completado
                      </IonButton>
                    </IonCol>
                    <IonCol>
                      <IonButton expand="block" color="danger">
                        <IonIcon icon={trash} slot="start" />
                        Eliminar
                      </IonButton>
                    </IonCol>
                  </IonRow>
                )}
              </IonContent>
            </IonPage>
          )}
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default EntrenadorEntrenamientos;