import React, { useState } from 'react';
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
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton,
  IonModal,
  IonInput,
  IonTextarea,
  IonButtons,
  IonBackButton,
  IonSelect,
  IonSelectOption,
  IonList,
  IonItem,
  IonLabel,
  IonAccordion,
  IonAccordionGroup,
  IonChip
} from '@ionic/react';
import { add, footballSharp, triangle, footballOutline, close, create, trash } from 'ionicons/icons';
import Footer from '../../../../components/Footer';

import NavBar from '../../../../components/NavBar';


// Interfaces para datos
interface Tactica {
  id: number;
  nombre: string;
  formacion: string;
  descripcion: string;
  tipo: 'ofensiva' | 'defensiva' | 'general';
  notas: string[];
  imagenUrl?: string;
}

const EntrenadorTacticas: React.FC = () => {
  const [tacticas, setTacticas] = useState<Tactica[]>([
    {
      id: 1,
      nombre: '4-3-3 Posesión',
      formacion: '4-3-3',
      descripcion: 'Táctica ofensiva basada en posesión y presión alta.',
      tipo: 'ofensiva',
      notas: [
        'Presión alta tras pérdida',
        'Laterales profundos',
        'Centrocampistas rotando posiciones'
      ],
      imagenUrl: 'https://via.placeholder.com/300x200?text=Tactica+4-3-3'
    },
    {
      id: 2,
      nombre: '4-4-2 Bloque bajo',
      formacion: '4-4-2',
      descripcion: 'Táctica defensiva con dos líneas de 4 compactas.',
      tipo: 'defensiva',
      notas: [
        'Líneas juntas, máximo 15 metros entre líneas',
        'Salida rápida a contragolpe',
        'Extremos ayudan en defensa'
      ],
      imagenUrl: 'https://via.placeholder.com/300x200?text=Tactica+4-4-2'
    },
    {
      id: 3,
      nombre: '3-5-2 Contragolpe',
      formacion: '3-5-2',
      descripcion: 'Táctica para transiciones rápidas con 3 defensas.',
      tipo: 'general',
      notas: [
        'Carrileros con recorrido largo',
        'Dos puntas rápidos',
        'Centrocampistas con buen pase largo'
      ],
      imagenUrl: 'https://via.placeholder.com/300x200?text=Tactica+3-5-2'
    },
  ]);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDetalles, setShowDetalles] = useState<boolean>(false);
  const [tacticaSeleccionada, setTacticaSeleccionada] = useState<Tactica | null>(null);

  // Estado para formulario
  const [nuevaTactica, setNuevaTactica] = useState<Partial<Tactica>>({
    nombre: '',
    formacion: '',
    descripcion: '',
    tipo: 'general',
    notas: []
  });
  const [nuevaNota, setNuevaNota] = useState<string>('');

  const crearTactica = () => {
    setNuevaTactica({
      nombre: '',
      formacion: '',
      descripcion: '',
      tipo: 'general',
      notas: []
    });
    setShowModal(true);
  };

  const agregarNota = () => {
    if (nuevaNota.trim() !== '') {
      setNuevaTactica({
        ...nuevaTactica,
        notas: [...(nuevaTactica.notas || []), nuevaNota]
      });
      setNuevaNota('');
    }
  };

  const eliminarNota = (index: number) => {
    const nuevasNotas = [...(nuevaTactica.notas || [])];
    nuevasNotas.splice(index, 1);
    setNuevaTactica({
      ...nuevaTactica,
      notas: nuevasNotas
    });
  };

  const guardarTactica = () => {
    if (nuevaTactica.nombre && nuevaTactica.formacion) {
      const nuevaTacticaCompleta: Tactica = {
        id: tacticas.length + 1,
        nombre: nuevaTactica.nombre,
        formacion: nuevaTactica.formacion,
        descripcion: nuevaTactica.descripcion || '',
        tipo: nuevaTactica.tipo as 'ofensiva' | 'defensiva' | 'general',
        notas: nuevaTactica.notas || [],
        imagenUrl: 'https://via.placeholder.com/300x200?text=' + nuevaTactica.formacion.replace('-', '')
      };

      setTacticas([...tacticas, nuevaTacticaCompleta]);
      setShowModal(false);
    }
  };

  const verDetalles = (tactica: Tactica) => {
    setTacticaSeleccionada(tactica);
    setShowDetalles(true);
  };

  const eliminarTactica = (id: number) => {
    setTacticas(tacticas.filter(tactica => tactica.id !== id));
    setShowDetalles(false);
  };

  const getColorTipo = (tipo: string) => {
    switch (tipo) {
      case 'ofensiva': return 'success';
      case 'defensiva': return 'danger';
      default: return 'medium';
    }
  };

  return (
    <IonPage>
      <NavBar />
      <IonContent fullscreen>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Tácticas</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          <IonGrid>
            <IonRow>
              {tacticas.map(tactica => (
                <IonCol size="12" size-md="6" size-lg="4" key={tactica.id}>
                  <IonCard>
                    {tactica.imagenUrl && (
                      <img src={tactica.imagenUrl} alt={tactica.nombre} />
                    )}
                    <IonCardHeader>
                      <IonCardTitle>{tactica.nombre}</IonCardTitle>
                      <IonChip color={getColorTipo(tactica.tipo)}>
                        {tactica.tipo.charAt(0).toUpperCase() + tactica.tipo.slice(1)}
                      </IonChip>
                    </IonCardHeader>
                    <IonCardContent>
                      <p><strong>Formación:</strong> {tactica.formacion}</p>
                      <p>{tactica.descripcion}</p>
                      <div className="ion-text-center ion-margin-top">
                        <IonButton fill="outline" onClick={() => verDetalles(tactica)}>
                          Ver detalles
                        </IonButton>
                      </div>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>

          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton onClick={crearTactica}>
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFab>

          {/* Modal para crear nueva táctica */}
          <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
            <IonHeader>
              <IonToolbar>
                <IonButtons slot="start">
                  <IonButton onClick={() => setShowModal(false)}>Cancelar</IonButton>
                </IonButtons>
                <IonTitle>Nueva Táctica</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={guardarTactica} strong>Guardar</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              <IonList>
                <IonItem>
                  <IonLabel position="floating">Nombre</IonLabel>
                  <IonInput
                    value={nuevaTactica.nombre}
                    onIonChange={e => setNuevaTactica({ ...nuevaTactica, nombre: e.detail.value || '' })}
                    required
                  />
                </IonItem>
                <IonItem>
                  <IonLabel>Formación</IonLabel>
                  <IonSelect
                    value={nuevaTactica.formacion}
                    onIonChange={e => setNuevaTactica({ ...nuevaTactica, formacion: e.detail.value })}
                  >
                    <IonSelectOption value="4-3-3">4-3-3</IonSelectOption>
                    <IonSelectOption value="4-4-2">4-4-2</IonSelectOption>
                    <IonSelectOption value="3-5-2">3-5-2</IonSelectOption>
                    <IonSelectOption value="5-3-2">5-3-2</IonSelectOption>
                    <IonSelectOption value="4-2-3-1">4-2-3-1</IonSelectOption>
                    <IonSelectOption value="3-4-3">3-4-3</IonSelectOption>
                  </IonSelect>
                </IonItem>
                <IonItem>
                  <IonLabel>Tipo</IonLabel>
                  <IonSelect
                    value={nuevaTactica.tipo}
                    onIonChange={e => setNuevaTactica({ ...nuevaTactica, tipo: e.detail.value })}
                  >
                    <IonSelectOption value="ofensiva">Ofensiva</IonSelectOption>
                    <IonSelectOption value="defensiva">Defensiva</IonSelectOption>
                    <IonSelectOption value="general">General</IonSelectOption>
                  </IonSelect>
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Descripción</IonLabel>
                  <IonTextarea
                    value={nuevaTactica.descripcion}
                    onIonChange={e => setNuevaTactica({ ...nuevaTactica, descripcion: e.detail.value || '' })}
                    rows={4}
                  />
                </IonItem>

                <IonItem lines="none">
                  <IonLabel>Notas técnicas</IonLabel>
                </IonItem>

                {nuevaTactica.notas && nuevaTactica.notas.map((nota, index) => (
                  <IonItem key={index}>
                    <IonLabel>{nota}</IonLabel>
                    <IonButton slot="end" fill="clear" color="danger" onClick={() => eliminarNota(index)}>
                      <IonIcon icon={close} />
                    </IonButton>
                  </IonItem>
                ))}

                <IonItem>
                  <IonInput
                    value={nuevaNota}
                    onIonChange={e => setNuevaNota(e.detail.value || '')}
                    placeholder="Agregar nota técnica"
                  />
                  <IonButton slot="end" fill="clear" onClick={agregarNota}>Agregar</IonButton>
                </IonItem>
              </IonList>
            </IonContent>
          </IonModal>

          {/* Modal de detalles de táctica */}
          <IonModal isOpen={showDetalles} onDidDismiss={() => setShowDetalles(false)}>
            {tacticaSeleccionada && (
              <IonPage>
                <IonHeader>
                  <IonToolbar>
                    <IonButtons slot="start">
                      <IonButton onClick={() => setShowDetalles(false)}>Cerrar</IonButton>
                    </IonButtons>
                    <IonTitle>{tacticaSeleccionada.nombre}</IonTitle>
                  </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                  {tacticaSeleccionada.imagenUrl && (
                    <div className="ion-text-center ion-margin-bottom">
                      <img
                        src={tacticaSeleccionada.imagenUrl}
                        alt={tacticaSeleccionada.nombre}
                        style={{ maxWidth: '100%', maxHeight: '300px' }}
                      />
                    </div>
                  )}

                  <IonGrid>
                    <IonRow>
                      <IonCol>
                        <IonCard>
                          <IonCardHeader>
                            <IonCardTitle>Detalles</IonCardTitle>
                          </IonCardHeader>
                          <IonCardContent>
                            <p><strong>Formación:</strong> {tacticaSeleccionada.formacion}</p>
                            <p><strong>Tipo:</strong> {tacticaSeleccionada.tipo.charAt(0).toUpperCase() + tacticaSeleccionada.tipo.slice(1)}</p>
                            <p><strong>Descripción:</strong> {tacticaSeleccionada.descripcion}</p>
                          </IonCardContent>
                        </IonCard>
                      </IonCol>
                    </IonRow>

                    <IonRow>
                      <IonCol>
                        <IonCard>
                          <IonCardHeader>
                            <IonCardTitle>Notas técnicas</IonCardTitle>
                          </IonCardHeader>
                          <IonCardContent>
                            {tacticaSeleccionada.notas.length > 0 ? (
                              <IonList>
                                {tacticaSeleccionada.notas.map((nota, index) => (
                                  <IonItem key={index} lines={index === tacticaSeleccionada.notas.length - 1 ? 'none' : 'full'}>
                                    <IonIcon icon={footballOutline} slot="start" color="primary" />
                                    <IonLabel>{nota}</IonLabel>
                                  </IonItem>
                                ))}
                              </IonList>
                            ) : (
                              <p>No hay notas técnicas para esta táctica.</p>
                            )}
                          </IonCardContent>
                        </IonCard>
                      </IonCol>
                    </IonRow>

                    <IonRow>
                      <IonCol>
                        <IonButton expand="block" color="primary">
                          <IonIcon icon={create} slot="start" />
                          Editar Táctica
                        </IonButton>
                      </IonCol>
                      <IonCol>
                        <IonButton
                          expand="block"
                          color="danger"
                          onClick={() => eliminarTactica(tacticaSeleccionada.id)}
                        >
                          <IonIcon icon={trash} slot="start" />
                          Eliminar
                        </IonButton>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonContent>
              </IonPage>
            )}
          </IonModal>
        </IonContent>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default EntrenadorTacticas;