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
  IonChip,
  IonBadge,
  IonToast,
  IonAlert,
  IonText
} from '@ionic/react';
import { 
  add, 
  footballSharp, 
  footballOutline, 
  close, 
  create, 
  trash, 
  clipboardOutline,
  trophy, 
  clipboard, 
  shieldOutline, 
  documentTextOutline,
  informationCircle,
  chevronForward,
  checkmark,
  calendarOutline,
  arrowForward
} from 'ionicons/icons';
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
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Estado para formulario
  const [nuevaTactica, setNuevaTactica] = useState<Partial<Tactica>>({
    nombre: '',
    formacion: '',
    descripcion: '',
    tipo: 'general',
    notas: []
  });
  const [nuevaNota, setNuevaNota] = useState<string>('');

  // Efecto para animaciones
  useEffect(() => {
    // Añadir observador para animaciones al hacer scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, { threshold: 0.1 });

    setTimeout(() => {
      const hiddenElements = document.querySelectorAll('.animate-on-scroll, .animate-on-enter');
      hiddenElements.forEach(el => observer.observe(el));
    }, 100);

    return () => {
      const hiddenElements = document.querySelectorAll('.animate-on-scroll, .animate-on-enter');
      hiddenElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  const crearTactica = () => {
    setIsEditing(false);
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

  const editarTactica = (tactica: Tactica) => {
    setIsEditing(true);
    setNuevaTactica({
      nombre: tactica.nombre,
      formacion: tactica.formacion,
      descripcion: tactica.descripcion,
      tipo: tactica.tipo,
      notas: [...tactica.notas]
    });
    setTacticaSeleccionada(tactica);
    setShowModal(true);
    setShowDetalles(false);
  };

  const guardarTactica = () => {
    if (nuevaTactica.nombre && nuevaTactica.formacion) {
      if (isEditing && tacticaSeleccionada) {
        // Actualizar táctica existente
        const tacticasActualizadas = tacticas.map(t => 
          t.id === tacticaSeleccionada.id 
            ? { 
                ...t,
                nombre: nuevaTactica.nombre || t.nombre,
                formacion: nuevaTactica.formacion || t.formacion,
                descripcion: nuevaTactica.descripcion || t.descripcion,
                tipo: nuevaTactica.tipo as 'ofensiva' | 'defensiva' | 'general',
                notas: nuevaTactica.notas || []
              } 
            : t
        );
        setTacticas(tacticasActualizadas);
        setToastMessage('Táctica actualizada correctamente');
      } else {
        // Crear nueva táctica
        const nuevaTacticaCompleta: Tactica = {
          id: tacticas.length + 1,
          nombre: nuevaTactica.nombre || '',
          formacion: nuevaTactica.formacion || '',
          descripcion: nuevaTactica.descripcion || '',
          tipo: nuevaTactica.tipo as 'ofensiva' | 'defensiva' | 'general',
          notas: nuevaTactica.notas || [],
          imagenUrl: 'https://via.placeholder.com/300x200?text=' + (nuevaTactica.formacion || '').replace('-', '')
        };

        setTacticas([...tacticas, nuevaTacticaCompleta]);
        setToastMessage('Táctica creada correctamente');
      }
      
      setShowToast(true);
      setShowModal(false);
    } else {
      setToastMessage('Por favor completa los campos obligatorios');
      setShowToast(true);
    }
  };

  const verDetalles = (tactica: Tactica) => {
    setTacticaSeleccionada(tactica);
    setShowDetalles(true);
  };

  const eliminarTactica = () => {
    if (!tacticaSeleccionada) return;
    
    const tacticasFiltradas = tacticas.filter(t => t.id !== tacticaSeleccionada.id);
    setTacticas(tacticasFiltradas);
    setShowDeleteAlert(false);
    setShowDetalles(false);
    setToastMessage('Táctica eliminada correctamente');
    setShowToast(true);
  };

  const getColorTipo = (tipo: string) => {
    switch (tipo) {
      case 'ofensiva': return 'success';
      case 'defensiva': return 'danger';
      default: return 'medium';
    }
  };

  const getIconTipo = (tipo: string) => {
    switch (tipo) {
      case 'ofensiva': return trophy;
      case 'defensiva': return shieldOutline;
      default: return clipboard;
    }
  };

  const getChipClase = (tipo: string) => {
    switch (tipo) {
      case 'ofensiva': return 'chip-tecnico'; // Usando clases de entrenamiento
      case 'defensiva': return 'chip-fisico';
      default: return 'chip-tactico';
    }
  };

  const getTacticaClase = (tipo: string) => {
    switch (tipo) {
      case 'ofensiva': return 'card-tecnico'; // Usando clases de entrenamiento
      case 'defensiva': return 'card-fisico';
      default: return 'card-tactico';
    }
  };

  return (
    <IonPage className="entrenamientos-page">
      <NavBar />
      <IonContent fullscreen>
        {/* Hero Section con diseño similar a entrenamientos */}
        <div className="entrenamientos-hero">
          <div className="entrenamientos-hero-overlay"></div>
          <div className="entrenamientos-hero-content">
            <div className="hero-badges animate-on-enter">
              <div className="hero-badge">
                <IonIcon icon={documentTextOutline} />
                <span className="badge-count">{tacticas.length}</span>
                <span className="badge-label">Tácticas</span>
              </div>
              <div className="hero-badge">
                <IonIcon icon={clipboard} />
                <span className="badge-count">3</span>
                <span className="badge-label">Formaciones</span>
              </div>
            </div>
            <h1 className="main-title animate-on-enter">
              Biblioteca de <span>Tácticas</span>
            </h1>
            <p className="hero-subtitle animate-on-enter">
              Gestiona y organiza tus estrategias y formaciones de juego
            </p>
          </div>
        </div>

        {/* Contenedor principal con tarjetas de tácticas */}
        <div className="entrenamientos-container">
          <IonGrid>
            <IonRow>
              {tacticas.map((tactica, index) => (
                <IonCol size="12" size-md="6" key={tactica.id}>
                  <IonCard 
                    className={`entrenamiento-card ${getTacticaClase(tactica.tipo)} animate-on-scroll animate-delay-${index % 5 + 1}`}
                    button 
                    onClick={() => verDetalles(tactica)}
                  >
                    <div className="card-header-content">
                      <div className="card-header-left">
                        <IonChip className={`tipo-chip ${getChipClase(tactica.tipo)}`}>
                          <IonIcon icon={getIconTipo(tactica.tipo)} />
                          <IonLabel>{tactica.tipo.charAt(0).toUpperCase() + tactica.tipo.slice(1)}</IonLabel>
                        </IonChip>
                        <h2 className="card-title">{tactica.nombre}</h2>
                      </div>
                      <div className="formacion-badge">{tactica.formacion}</div>
                    </div>
                    
                    {tactica.imagenUrl && (
                      <div className="tactica-imagen-container">
                        <img src={tactica.imagenUrl} alt={tactica.nombre} className="tactica-imagen" />
                      </div>
                    )}
                    
                    <IonCardContent>
                      <p className="tactica-descripcion">{tactica.descripcion}</p>
                      
                      <div className="asistencia-container">
                        <div className="asistencia-title">
                          <IonIcon icon={clipboardOutline} />
                          <span>Notas técnicas</span>
                        </div>
                        <div className="tactica-notas-count">
                          <IonBadge color="light">{tactica.notas.length} notas</IonBadge>
                        </div>
                      </div>

                      <div className="card-footer">
                        <div className="card-estado">
                          <IonIcon icon={documentTextOutline} />
                          <span>Formación {tactica.formacion}</span>
                        </div>
                        <div className="card-action">
                          <span>Ver detalles</span>
                          <IonIcon icon={arrowForward} />
                        </div>
                      </div>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>

          <IonFab vertical="bottom" horizontal="end" slot="fixed" className="custom-fab">
            <IonFabButton 
              onClick={crearTactica} 
              className="fab-button-custom"
            >
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFab>

          {/* Modal para crear/editar táctica */}
          <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} className="entrenamiento-modal">
            <IonPage>
              <IonHeader>
                <IonToolbar className="modal-header">
                  <IonButtons slot="start">
                    <IonButton onClick={() => setShowModal(false)}>
                      <IonIcon slot="icon-only" icon={close} />
                    </IonButton>
                  </IonButtons>
                  <IonTitle>{isEditing ? 'Editar Táctica' : 'Nueva Táctica'}</IonTitle>
                </IonToolbar>
              </IonHeader>
              
              <IonContent className="modal-content">
                <form className="form-container" onSubmit={(e) => {
                  e.preventDefault();
                  guardarTactica();
                }}>
                  {/* Sección de Información General */}
                  <div className="modal-form-section">
                    <div className="section-title">
                      <IonIcon icon={informationCircle} />
                      <h3>Información General</h3>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Nombre <span className="required-mark">*</span>
                      </label>
                      <input 
                        type="text"
                        className="custom-input"
                        placeholder="Ej: 4-3-3 Presión alta"
                        value={nuevaTactica.nombre}
                        onChange={(e) => setNuevaTactica({ ...nuevaTactica, nombre: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Formación <span className="required-mark">*</span>
                      </label>
                      <select 
                        className="custom-select"
                        value={nuevaTactica.formacion}
                        onChange={(e) => setNuevaTactica({ ...nuevaTactica, formacion: e.target.value })}
                      >
                        <option value="">Seleccionar formación</option>
                        <option value="4-3-3">4-3-3</option>
                        <option value="4-4-2">4-4-2</option>
                        <option value="3-5-2">3-5-2</option>
                        <option value="5-3-2">5-3-2</option>
                        <option value="4-2-3-1">4-2-3-1</option>
                        <option value="3-4-3">3-4-3</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Tipo <span className="required-mark">*</span>
                      </label>
                      <select 
                        className="custom-select"
                        value={nuevaTactica.tipo}
                        onChange={(e) => setNuevaTactica({ ...nuevaTactica, tipo: e.target.value as 'ofensiva' | 'defensiva' | 'general' })}
                      >
                        <option value="">Seleccionar tipo</option>
                        <option value="ofensiva">Ofensiva</option>
                        <option value="defensiva">Defensiva</option>
                        <option value="general">General</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Descripción
                      </label>
                      <textarea
                        className="custom-textarea"
                        placeholder="Describe la estrategia y sus objetivos"
                        value={nuevaTactica.descripcion}
                        onChange={(e) => setNuevaTactica({ ...nuevaTactica, descripcion: e.target.value })}
                        rows={4}
                      />
                    </div>
                  </div>

                  {/* Sección de Notas Técnicas */}
                  <div className="modal-form-section">
                    <div className="section-title">
                      <IonIcon icon={clipboardOutline} />
                      <h3>Notas Técnicas</h3>
                    </div>

                    {nuevaTactica.notas && nuevaTactica.notas.map((nota, index) => (
                      <div key={index} className="nota-item-container">
                        <div className="nota-content">
                          <IonIcon icon={footballOutline} className="nota-icon" />
                          <div className="nota-text">{nota}</div>
                        </div>
                        <IonButton 
                          fill="clear" 
                          color="danger" 
                          onClick={() => eliminarNota(index)}
                          className="nota-delete-btn"
                        >
                          <IonIcon icon={trash} />
                        </IonButton>
                      </div>
                    ))}

                    <div className="add-nota-container">
                      <input 
                        type="text"
                        className="custom-input"
                        placeholder="Añadir nota técnica"
                        value={nuevaNota}
                        onChange={(e) => setNuevaNota(e.target.value)}
                      />
                      <IonButton 
                        fill="clear" 
                        onClick={agregarNota}
                        className="add-nota-btn"
                      >
                        Agregar
                      </IonButton>
                    </div>
                  </div>

                  {/* Botón de guardar */}
                  <div className="form-actions">
                    <IonButton 
                      expand="block" 
                      type="submit"
                      className="save-button"
                      strong
                    >
                      <IonIcon slot="start" icon={checkmark} />
                      {isEditing ? 'Guardar cambios' : 'Crear táctica'}
                    </IonButton>
                  </div>
                </form>
              </IonContent>
            </IonPage>
          </IonModal>

          {/* Modal de detalles de táctica */}
          <IonModal isOpen={showDetalles} onDidDismiss={() => setShowDetalles(false)} className="detalles-modal premium-modal">
            {tacticaSeleccionada && (
              <IonPage>
                <IonHeader>
                  <IonToolbar className={`modal-header premium-header ${getChipClase(tacticaSeleccionada.tipo)}-header`}>
                    <IonButtons slot="start">
                      <IonButton onClick={() => setShowDetalles(false)}>
                        <IonIcon slot="icon-only" icon={close} />
                      </IonButton>
                    </IonButtons>
                    <IonTitle>Detalles de la Táctica</IonTitle>
                    <IonButtons slot="end">
                      <IonButton onClick={() => editarTactica(tacticaSeleccionada)}>
                        <IonIcon slot="icon-only" icon={create} />
                      </IonButton>
                    </IonButtons>
                  </IonToolbar>
                </IonHeader>

                <IonContent className="detalles-content premium-content">
                  {/* Cabecera premium con imagen de fondo */}
                  <div className={`premium-hero ${getChipClase(tacticaSeleccionada.tipo)}-background`}>
                    <div className="premium-hero-overlay"></div>
                    <div className="premium-hero-content">
                      <div className="premium-badge">
                        <IonIcon icon={getIconTipo(tacticaSeleccionada.tipo)} />
                        <span>{tacticaSeleccionada.tipo.charAt(0).toUpperCase() + tacticaSeleccionada.tipo.slice(1)}</span>
                      </div>
                      <h1 className="premium-title">{tacticaSeleccionada.nombre}</h1>
                      <div className="premium-formation">
                        {tacticaSeleccionada.formacion}
                      </div>
                    </div>
                  </div>
                  
                  {/* Panel de información principal con estilo de tarjeta única */}
                  <div className="premium-info-panel">
                    <div className="premium-info-header">
                      <h2 className="panel-title">FORMACIÓN {tacticaSeleccionada.formacion}</h2>
                      <div className="premium-divider"></div>
                    </div>
                    
                    {/* Campo de juego visual */}
                    <div className="premium-field-container">
                      <div className="premium-field">
                        <img 
                          src={tacticaSeleccionada.imagenUrl || `https://via.placeholder.com/800x500?text=Formacion+${tacticaSeleccionada.formacion}`} 
                          alt={`Formación ${tacticaSeleccionada.formacion}`} 
                          className="premium-field-image"
                        />
                        <div className="premium-field-overlay"></div>
                      </div>
                    </div>

                    {/* Descripción con estilo mejorado */}
                    <div className="premium-section">
                      <div className="premium-section-header">
                        <IonIcon icon={informationCircle} className="premium-icon" />
                        <h3>DESCRIPCIÓN</h3>
                      </div>
                      <div className="premium-section-content">
                        <p className="premium-description">
                          {tacticaSeleccionada.descripcion || "Sin descripción disponible."}
                        </p>
                      </div>
                    </div>

                    {/* Notas técnicas con estilo visual mejorado */}
                    <div className="premium-section">
                      <div className="premium-section-header">
                        <IonIcon icon={clipboardOutline} className="premium-icon" />
                        <h3>NOTAS TÉCNICAS</h3>
                      </div>
                      <div className="premium-section-content">
                        {tacticaSeleccionada.notas.length > 0 ? (
                          <div className="premium-notes-list">
                            {tacticaSeleccionada.notas.map((nota, index) => (
                              <div key={index} className="premium-note-item">
                                <div className="premium-note-bullet">
                                  <IonIcon icon={footballOutline} />
                                </div>
                                <p className="premium-note-text">{nota}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="premium-empty-state">No hay notas técnicas para esta táctica</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Botones de acción con diseño mejorado */}
                  <div className="premium-actions">
                    <IonButton 
                      expand="block" 
                      onClick={() => editarTactica(tacticaSeleccionada)}
                      className="premium-button premium-edit-button"
                      shape="round"
                      fill="solid"
                    >
                      <IonIcon slot="start" icon={create} />
                      Editar Táctica
                    </IonButton>
                    
                    <IonButton 
                      expand="block" 
                      onClick={() => setShowDeleteAlert(true)}
                      className="premium-button premium-delete-button"
                      shape="round"
                      fill="outline"
                      color="danger"
                    >
                      <IonIcon slot="start" icon={trash} />
                      Eliminar Táctica
                    </IonButton>
                  </div>
                </IonContent>
              </IonPage>
            )}
          </IonModal>
          
          {/* Toast para notificaciones */}
          <IonToast
            isOpen={showToast}
            onDidDismiss={() => setShowToast(false)}
            message={toastMessage}
            duration={2000}
            position="bottom"
            color="primary"
            cssClass="toast-notification"
          />
          
          {/* Alerta de confirmación para eliminar */}
          <IonAlert
            isOpen={showDeleteAlert}
            onDidDismiss={() => setShowDeleteAlert(false)}
            header="Eliminar táctica"
            message="¿Está seguro de que desea eliminar esta táctica? Esta acción no se puede deshacer."
            cssClass="custom-alert"
            buttons={[
              {
                text: 'Cancelar',
                role: 'cancel',
                cssClass: 'alert-button-cancel'
              },
              {
                text: 'Eliminar',
                role: 'destructive',
                cssClass: 'alert-button-confirm',
                handler: eliminarTactica
              }
            ]}
          />
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default EntrenadorTacticas;