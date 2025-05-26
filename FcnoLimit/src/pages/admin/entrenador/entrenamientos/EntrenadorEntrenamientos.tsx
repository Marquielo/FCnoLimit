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
  IonButtons,
  IonBackButton,
  IonSelect,
  IonSelectOption,
  IonChip,
  IonBadge,
  IonSegment,
  IonSegmentButton,
  IonProgressBar,
  IonText,
  IonToast,
  IonAlert,
  IonNote,
} from '@ionic/react';
import { 
  add, 
  calendar, 
  time, 
  location, 
  people, 
  informationCircle, 
  checkmark, 
  close, 
  create, 
  trash, 
  documentText,
  footballOutline,
  heartOutline,
  barbell,
  handLeftOutline, // Reemplazo de finger que no existe
  chevronForward,
  timeOutline,
  locationOutline,
  peopleOutline,
  calendarOutline,
  clipboardOutline,
  arrowForward,
  stopwatchOutline, // Corregido por stopwatch
  trophyOutline,
  fitnessOutline
} from 'ionicons/icons';
import NavBar from '../../../../components/NavBar';
import Footer from '../../../../components/Footer';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import LocationMap, { LocationType } from '../../../../components/LocationMap';

// Interfaces
interface Entrenamiento {
  id: number;
  titulo: string;
  fecha: string;
  hora: string;
  duracion: string;
  lugar: LocationType; // Cambiado de string a LocationType
  tipo: string;
  descripcion: string;
  completado: boolean;
  asistencias: {
    total: number;
    presentes: number;
  };
}

// Añade el tema personalizado para MUI
const theme = createTheme({
  palette: {
    primary: {
      main: '#ffa726', // Color primario de FCnoLimit
    },
  },
});

const EntrenadorEntrenamientos: React.FC = () => {
  const [entrenamientos, setEntrenamientos] = useState<Entrenamiento[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDetalles, setShowDetalles] = useState<boolean>(false);
  const [entrenamientoSeleccionado, setEntrenamientoSeleccionado] = useState<Entrenamiento | null>(null);
  const [filtro, setFiltro] = useState<string>('proximos');
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Campos para el formulario
  const [nuevoTitulo, setNuevoTitulo] = useState<string>('');
  const [nuevaFecha, setNuevaFecha] = useState<string>('');
  const [nuevaHora, setNuevaHora] = useState<string>('');
  const [nuevaDuracion, setNuevaDuracion] = useState<string>('');
  const [nuevoLugar, setNuevoLugar] = useState<LocationType>('');
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
        descripcion: 'Ejercicios de resistencia y velocidad. Trabajo de alta intensidad con intervalos de recuperación activa. Enfoque en mejorar la capacidad aeróbica y anaeróbica de los jugadores.',
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
        descripcion: 'Trabajo en líneas defensivas y presión alta. Entrenamiento de situaciones de juego con énfasis en la recuperación rápida del balón y las transiciones defensa-ataque.',
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
        descripcion: 'Mejora de técnica individual con balón. Ejercicios de control, pase y conducción en espacios reducidos. Circuitos de habilidad técnica con componentes de toma de decisiones.',
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
        descripcion: 'Partidos 5 vs 5 con diferentes reglas. Trabajo de posesión en espacios reducidos con objetivos tácticos específicos. Desarrollo de la toma de decisiones bajo presión.',
        completado: true,
        asistencias: {
          total: 22,
          presentes: 18,
        }
      }
    ];

    setEntrenamientos(datosEjemplo);

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

  // Filtrar entrenamientos
  const entrenamientosFiltrados = entrenamientos.filter(
    entrenamiento => filtro === 'proximos' ? !entrenamiento.completado : entrenamiento.completado
  );

  // Obtener el ícono para el tipo de entrenamiento
  const getIconoTipo = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'físico': return barbell;
      case 'técnico': return handLeftOutline; // Reemplazo de finger
      case 'táctico': return documentText;
      case 'recuperación': return heartOutline;
      case 'partido': return footballOutline;
      default: return footballOutline;
    }
  };
  
  // Obtener la clase para el tipo de entrenamiento
  const getClaseTipo = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'físico': return 'card-fisico';
      case 'técnico': return 'card-tecnico';
      case 'táctico': return 'card-tactico';
      case 'recuperación': return 'card-recuperacion';
      case 'partido': return 'card-partido';
      default: return '';
    }
  };

  // Obtener la clase para el chip según el tipo
  const getChipClase = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'físico': return 'chip-fisico';
      case 'técnico': return 'chip-tecnico';
      case 'táctico': return 'chip-tactico';
      case 'recuperación': return 'chip-recuperacion';
      case 'partido': return 'chip-partido';
      default: return '';
    }
  };

  // Manejadores para el formulario
  const crearEntrenamiento = () => {
    setIsEditing(false);
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

  const editarEntrenamiento = (entrenamiento: Entrenamiento) => {
    setIsEditing(true);
    // Cargar datos del entrenamiento en el formulario
    setNuevoTitulo(entrenamiento.titulo);
    setNuevaFecha(entrenamiento.fecha);
    setNuevaHora(entrenamiento.hora);
    setNuevaDuracion(entrenamiento.duracion);
    setNuevoLugar(entrenamiento.lugar as LocationType);
    setNuevoTipo(entrenamiento.tipo);
    setNuevaDescripcion(entrenamiento.descripcion);
    setEntrenamientoSeleccionado(entrenamiento);
    setShowModal(true);
  };

  const guardarEntrenamiento = () => {
    // Validación de campos requeridos
    if (!nuevoTitulo || !nuevaFecha || !nuevaHora || !nuevaDuracion || !nuevoLugar || !nuevoTipo) {
      setToastMessage('Por favor complete todos los campos requeridos');
      setShowToast(true);
      return;
    }

    if (isEditing && entrenamientoSeleccionado) {
      // Actualizar entrenamiento existente
      const entrenamientosActualizados = entrenamientos.map(e => 
        e.id === entrenamientoSeleccionado.id 
          ? { 
              ...e, 
              titulo: nuevoTitulo,
              fecha: nuevaFecha,
              hora: nuevaHora,
              duracion: nuevaDuracion,
              lugar: nuevoLugar,
              tipo: nuevoTipo,
              descripcion: nuevaDescripcion
            } 
          : e
      );
      setEntrenamientos(entrenamientosActualizados);
      setToastMessage('Entrenamiento actualizado correctamente');
    } else {
      // Crear nuevo entrenamiento
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
      setToastMessage('Entrenamiento creado correctamente');
    }
    
    setShowToast(true);
    setShowModal(false);
  };

  const completarEntrenamiento = (id: number) => {
    const entrenamientosActualizados = entrenamientos.map(e => 
      e.id === id 
        ? { 
            ...e, 
            completado: true,
            asistencias: {
              ...e.asistencias,
              presentes: Math.floor(e.asistencias.total * 0.8) // Simulación: 80% de asistencia
            }
          } 
        : e
    );
    setEntrenamientos(entrenamientosActualizados);
    setShowDetalles(false);
    setToastMessage('Entrenamiento marcado como completado');
    setShowToast(true);
  };

  const eliminarEntrenamiento = () => {
    if (!entrenamientoSeleccionado) return;
    
    const entrenamientosFiltrados = entrenamientos.filter(e => e.id !== entrenamientoSeleccionado.id);
    setEntrenamientos(entrenamientosFiltrados);
    setShowDeleteAlert(false);
    setShowDetalles(false);
    setToastMessage('Entrenamiento eliminado correctamente');
    setShowToast(true);
  };

  const verDetalles = (entrenamiento: Entrenamiento) => {
    setEntrenamientoSeleccionado(entrenamiento);
    setShowDetalles(true);
  };

  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getProximosCount = () => {
    return entrenamientos.filter(e => !e.completado).length;
  };

  const getCompletadosCount = () => {
    return entrenamientos.filter(e => e.completado).length;
  };

  return (
    <IonPage className="entrenamientos-page">
      <NavBar />
      <IonContent fullscreen>
        {/* Hero Section con fondo animado */}
        <div className="entrenamientos-hero">
          <div className="entrenamientos-hero-overlay"></div>
          <div className="entrenamientos-hero-content">
            <div className="hero-badges animate-on-enter">
              <div className="hero-badge">
                <IonIcon icon={calendarOutline} />
                <span className="badge-count">{getProximosCount()}</span>
                <span className="badge-label">Próximos</span>
              </div>
              <div className="hero-badge">
                <IonIcon icon={checkmark} />
                <span className="badge-count">{getCompletadosCount()}</span>
                <span className="badge-label">Completados</span>
              </div>
            </div>
            <h1 className="main-title animate-on-enter">
              Entrenamientos <span>FC No Limit</span>
            </h1>
            <p className="hero-subtitle animate-on-enter">
              Gestiona y planifica todas las sesiones de entrenamiento del equipo
            </p>
          </div>
        </div>

        {/* Segmento filtro mejorado */}
        <div className="filtro-segment-container animate-on-scroll">
          <IonSegment value={filtro} onIonChange={e => setFiltro(e.detail.value as string)} className="filtro-segment">
            <IonSegmentButton value="proximos" className="segment-button-custom">
              <IonLabel>
                <IonIcon icon={calendarOutline} />
                Próximos
                <span className="segment-button-counter">{getProximosCount()}</span>
              </IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="completados" className="segment-button-custom">
              <IonLabel>
                <IonIcon icon={checkmark} />
                Completados
                <span className="segment-button-counter">{getCompletadosCount()}</span>
              </IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>

        <div className="entrenamientos-container">
          {entrenamientosFiltrados.length === 0 ? (
            <div className="empty-state animate-on-scroll">
              <div className="empty-state-icon">
                <IonIcon icon={filtro === 'proximos' ? calendarOutline : checkmark} />
              </div>
              <h3 className="empty-state-title">{filtro === 'proximos' ? 'Sin entrenamientos programados' : 'Sin entrenamientos completados'}</h3>
              <p className="empty-state-text">
                {filtro === 'proximos' 
                  ? 'No hay entrenamientos programados. Crea uno nuevo con el botón (+).' 
                  : 'Todavía no has completado ningún entrenamiento.'}
              </p>
              {filtro === 'proximos' && (
                <IonButton className="empty-state-action" onClick={crearEntrenamiento}>
                  <IonIcon slot="start" icon={add}/>
                  Crear nuevo entrenamiento
                </IonButton>
              )}
            </div>
          ) : (
            <div className="entrenamientos-list-container">
              <IonGrid>
                <IonRow>
                  {entrenamientosFiltrados.map((entrenamiento, index) => (
                    <IonCol size="12" size-md="6" key={entrenamiento.id}>
                      <IonCard 
                        className={`entrenamiento-card ${getClaseTipo(entrenamiento.tipo)}`}
                        button 
                        onClick={() => verDetalles(entrenamiento)}
                      >
                        <div className="card-header-content">
                          <div className="card-header-left">
                            <IonChip className={`tipo-chip ${getChipClase(entrenamiento.tipo)}`}>
                              <IonIcon icon={getIconoTipo(entrenamiento.tipo)} />
                              <IonLabel>{entrenamiento.tipo}</IonLabel>
                            </IonChip>
                            <h2 className="card-title">{entrenamiento.titulo}</h2>
                          </div>
                          <div className="card-date">
                            <IonIcon icon={calendarOutline} />
                            <span>{formatearFecha(entrenamiento.fecha)}</span>
                          </div>
                        </div>
                        
                        <div className="entrenamiento-info">
                          <div className="info-item">
                            <div className="info-icon">
                              <IonIcon icon={timeOutline} />
                            </div>
                            <div className="info-content">
                              <div className="info-label">Hora</div>
                              <div className="info-text">{entrenamiento.hora}</div>
                            </div>
                          </div>
                          
                          <div className="info-item">
                            <div className="info-icon">
                              <IonIcon icon={stopwatchOutline} />
                            </div>
                            <div className="info-content">
                              <div className="info-label">Duración</div>
                              <div className="info-text">{entrenamiento.duracion}</div>
                            </div>
                          </div>
                          
                          <div className="info-item">
                            <div className="info-icon">
                              <IonIcon icon={locationOutline} />
                            </div>
                            <div className="info-content">
                              <div className="info-label">Lugar</div>
                              <div className="info-text">{entrenamiento.lugar}</div>
                            </div>
                          </div>
                          
                          <div className="info-item">
                            <div className="info-icon">
                              <IonIcon icon={peopleOutline} />
                            </div>
                            <div className="info-content">
                              <div className="info-label">Jugadores</div>
                              <div className="info-text">{entrenamiento.asistencias.total}</div>
                            </div>
                          </div>
                        </div>

                        {entrenamiento.completado && (
                          <div className="asistencia-container">
                            <div className="asistencia-title">
                              <IonIcon icon={peopleOutline} />
                              <span>Estadísticas de asistencia</span>
                            </div>
                            <IonProgressBar
                              value={entrenamiento.asistencias.presentes / entrenamiento.asistencias.total}
                              color="success"
                              className="asistencia-progress"
                            />
                            <div className="asistencia-info">
                              <span className="asistencia-count">
                                {entrenamiento.asistencias.presentes} de {entrenamiento.asistencias.total} jugadores
                              </span>
                              <span className="asistencia-percentage">
                                <IonBadge color="success" className="asistencia-badge">
                                  {Math.round((entrenamiento.asistencias.presentes / entrenamiento.asistencias.total) * 100)}%
                                </IonBadge>
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="card-footer">
                          <div className={`card-estado ${entrenamiento.completado ? 'estado-completado' : 'estado-programado'}`}>
                            <IonIcon icon={entrenamiento.completado ? checkmark : calendar} />
                            <span>{entrenamiento.completado ? 'Completado' : 'Programado'}</span>
                          </div>
                          <div className="card-action">
                            <span>Ver detalles</span>
                            <IonIcon icon={arrowForward} />
                          </div>
                        </div>
                      </IonCard>
                    </IonCol>
                  ))}
                </IonRow>
              </IonGrid>
            </div>
          )}

          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton onClick={crearEntrenamiento} className="fab-button-custom">
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFab>

          {/* Modal para crear/editar entrenamiento */}
          <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} className="entrenamiento-modal">
            <IonPage>
              <IonHeader>
                <IonToolbar className="modal-header">
                  <IonButtons slot="start">
                    <IonButton onClick={() => setShowModal(false)}>
                      <IonIcon slot="icon-only" icon={close} />
                    </IonButton>
                  </IonButtons>
                  <IonTitle>{isEditing ? 'Editar Entrenamiento' : 'Nuevo Entrenamiento'}</IonTitle>
                </IonToolbar>
              </IonHeader>
              
              <IonContent className="modal-content">
                <form className="form-container" onSubmit={(e) => {
                  e.preventDefault();
                  guardarEntrenamiento();
                }}>
                  {/* Sección de Información General */}
                  <div className="modal-form-section">
                    <div className="section-title">
                      <IonIcon icon={clipboardOutline} />
                      <h3>Información General</h3>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Título <span className="required-mark">*</span>
                      </label>
                      <input 
                        type="text"
                        className="custom-input"
                        placeholder="Ej: Entrenamiento físico"
                        value={nuevoTitulo}
                        onChange={(e) => setNuevoTitulo(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Tipo <span className="required-mark">*</span>
                      </label>
                      <select 
                        className="custom-select"
                        value={nuevoTipo}
                        onChange={(e) => setNuevoTipo(e.target.value)}
                      >
                        <option value="">Seleccione un tipo</option>
                        <option value="Físico">Físico</option>
                        <option value="Técnico">Técnico</option>
                        <option value="Táctico">Táctico</option>
                        <option value="Recuperación">Recuperación</option>
                        <option value="Partido">Partido de práctica</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Descripción
                      </label>
                      <textarea
                        className="custom-textarea"
                        placeholder="Describa el objetivo y actividades del entrenamiento"
                        value={nuevaDescripcion}
                        onChange={(e) => setNuevaDescripcion(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Sección de Fecha y Hora */}
                  <div className="modal-form-section">
                    <div className="section-title">
                      <IonIcon icon={calendarOutline} />
                      <h3>Fecha y Hora</h3>
                    </div>

                    <div className="date-time-grid">
                      <div className="form-group">
                        <label className="form-label">
                          Fecha <span className="required-mark">*</span>
                        </label>
                        <input 
                          type="date"
                          className="custom-input"
                          value={nuevaFecha}
                          onChange={(e) => setNuevaFecha(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Hora <span className="required-mark">*</span>
                        </label>
                        <input 
                          type="time"
                          className="custom-input"
                          value={nuevaHora}
                          onChange={(e) => setNuevaHora(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Duración <span className="required-mark">*</span>
                        </label>
                        <input 
                          type="number"
                          className="custom-input"
                          placeholder="90"
                          value={nuevaDuracion}
                          onChange={(e) => setNuevaDuracion(e.target.value)}
                        />
                        <span className="help-text">minutos</span>
                      </div>
                    </div>
                  </div>

                  {/* Sección de Ubicación */}
                  <div className="modal-form-section">
                    <div className="section-title">
                      <IonIcon icon={locationOutline} />
                      <h3>Ubicación</h3>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Lugar <span className="required-mark">*</span>
                      </label>
                      <select 
                        className="custom-select"
                        value={nuevoLugar}
                        onChange={(e) => setNuevoLugar(e.target.value as LocationType)}
                      >
                        <option value="">Seleccione un lugar</option>
                        <option value="Campo principal">Campo principal</option>
                        <option value="Campo auxiliar">Campo auxiliar</option>
                        <option value="Gimnasio">Gimnasio</option>
                        <option value="Sala de tácticas">Sala de tácticas</option>
                        <option value="Pista de atletismo">Pista de atletismo</option>
                      </select>
                    </div>

                    <div className="map-container">
                      <LocationMap selectedLocation={nuevoLugar} />
                      <div className="map-info">
                        <div className="info-row">
                          <IonIcon icon={locationOutline} />
                          <span>Complejo Deportivo FC No Limit</span>
                        </div>
                        <div className="info-row">
                          <IonIcon icon={informationCircle} />
                          <span>Seleccione una ubicación de la lista para ver en el mapa</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Añadir al final del formulario, después de la última sección */}
                  <div className="form-actions">
                    <IonButton 
                      expand="block" 
                      type="submit"
                      className="save-button"
                      strong
                    >
                      <IonIcon slot="start" icon={checkmark} />
                      {isEditing ? 'Guardar cambios' : 'Crear entrenamiento'}
                    </IonButton>
                  </div>
                </form>
              </IonContent>
            </IonPage>
          </IonModal>

          {/* Modal de detalles de entrenamiento */}
          <IonModal isOpen={showDetalles} onDidDismiss={() => setShowDetalles(false)} className="detalles-modal">
            {entrenamientoSeleccionado && (
              <IonPage>
                <IonHeader>
                  <IonToolbar className="modal-header">
                    <IonButtons slot="start">
                      <IonButton onClick={() => setShowDetalles(false)}>
                        <IonIcon slot="icon-only" icon={close} />
                      </IonButton>
                    </IonButtons>
                    <IonTitle>Detalles del Entrenamiento</IonTitle>
                    <IonButtons slot="end">
                      <IonButton onClick={() => editarEntrenamiento(entrenamientoSeleccionado)}>
                        <IonIcon slot="icon-only" icon={create} />
                      </IonButton>
                    </IonButtons>
                  </IonToolbar>
                </IonHeader>

                <IonContent className="detalles-content ion-padding">
                  <div className="detalles-hero-container">
                    <div className="detalles-hero">
                      <div className="detalles-hero-overlay"></div>
                      <div className="detalles-hero-content">
                        <div className="detalles-tipo">
                          <div className={`detalles-tipo-badge ${getChipClase(entrenamientoSeleccionado.tipo)}`}>
                            <IonIcon icon={getIconoTipo(entrenamientoSeleccionado.tipo)} />
                            <span>{entrenamientoSeleccionado.tipo}</span>
                          </div>
                        </div>
                        
                        <h1 className="detalles-titulo">{entrenamientoSeleccionado.titulo}</h1>
                        
                        <div className="detalles-metadata">
                          <div className="detalles-fecha">
                            <IonIcon icon={calendarOutline} />
                            <span>{formatearFecha(entrenamientoSeleccionado.fecha)}</span>
                          </div>
                          <div className="detalles-hora">
                            <IonIcon icon={timeOutline} />
                            <span>{entrenamientoSeleccionado.hora}</span>
                          </div>
                        </div>

                        <div className={`detalles-estado-badge ${entrenamientoSeleccionado.completado ? 'completado' : 'pendiente'}`}>
                          <IonIcon icon={entrenamientoSeleccionado.completado ? checkmark : timeOutline} />
                          <span>{entrenamientoSeleccionado.completado ? 'Completado' : 'Programado'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="detalles-cards-container">
                    {/* Sección de información general */}
                    <div className="detalles-card">
                      <div className="detalles-card-header">
                        <IonIcon icon={informationCircle} />
                        <h3>Información General</h3>
                      </div>
                      <div className="detalles-info-grid">
                        <div className="detalles-info-item">
                          <span className="detalles-info-label">Tipo</span>
                          <span className="detalles-info-text">
                            <IonIcon icon={getIconoTipo(entrenamientoSeleccionado.tipo)} />
                            {entrenamientoSeleccionado.tipo}
                          </span>
                        </div>
                        <div className="detalles-info-item">
                          <span className="detalles-info-label">Fecha</span>
                          <span className="detalles-info-text">
                            <IonIcon icon={calendarOutline} />
                            {formatearFecha(entrenamientoSeleccionado.fecha)}
                          </span>
                        </div>
                        <div className="detalles-info-item">
                          <span className="detalles-info-label">Hora</span>
                          <span className="detalles-info-text">
                            <IonIcon icon={timeOutline} />
                            {entrenamientoSeleccionado.hora}
                          </span>
                        </div>
                        <div className="detalles-info-item">
                          <span className="detalles-info-label">Duración</span>
                          <span className="detalles-info-text">
                            <IonIcon icon={stopwatchOutline} />
                            {entrenamientoSeleccionado.duracion}
                          </span>
                        </div>
                        <div className="detalles-info-item">
                          <span className="detalles-info-label">Lugar</span>
                          <span className="detalles-info-text">
                            <IonIcon icon={locationOutline} />
                            {entrenamientoSeleccionado.lugar}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Sección de descripción */}
                    <div className="detalles-card">
                      <div className="detalles-card-header">
                        <IonIcon icon={documentText} />
                        <h3>Descripción</h3>
                      </div>
                      <p className="detalles-descripcion">
                        {entrenamientoSeleccionado.descripcion || "No hay descripción disponible para este entrenamiento."}
                      </p>
                    </div>

                    {/* Sección de asistencia */}
                    <div className="detalles-card">
                      <div className="detalles-card-header">
                        <IonIcon icon={peopleOutline} />
                        <h3>Asistencia</h3>
                      </div>
                      <div className="detalle-asistencia">
                        <div className="detalle-asistencia-chart">
                          <IonProgressBar 
                            value={entrenamientoSeleccionado.asistencias.presentes / entrenamientoSeleccionado.asistencias.total} 
                            color="success" 
                            style={{
                              height: '100%', 
                              width: '100%', 
                              borderRadius: '50%',
                              transform: 'rotate(-90deg)', 
                              position: 'absolute'
                            }}
                          ></IonProgressBar>
                          <span className="detalle-asistencia-percentage">
                            {Math.round((entrenamientoSeleccionado.asistencias.presentes / entrenamientoSeleccionado.asistencias.total) * 100)}%
                          </span>
                        </div>
                        <div className="detalle-asistencia-info">
                          <strong>{entrenamientoSeleccionado.asistencias.presentes}</strong> de {entrenamientoSeleccionado.asistencias.total} jugadores
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Botones de acción */}
                  <div className="detalle-buttons">
                    {!entrenamientoSeleccionado.completado && (
                      <IonButton 
                        expand="block" 
                        onClick={() => completarEntrenamiento(entrenamientoSeleccionado.id)}
                        className="detalle-btn detalle-btn-primary"
                      >
                        <IonIcon slot="start" icon={checkmark} />
                        Marcar como Completado
                      </IonButton>
                    )}
                    
                    <IonButton 
                      expand="block" 
                      onClick={() => editarEntrenamiento(entrenamientoSeleccionado)}
                      className="detalle-btn detalle-btn-secondary"
                    >
                      <IonIcon slot="start" icon={create} />
                      Editar Entrenamiento
                    </IonButton>
                    
                    <IonButton 
                      expand="block" 
                      onClick={() => setShowDeleteAlert(true)}
                      className="detalle-btn detalle-btn-danger"
                    >
                      <IonIcon slot="start" icon={trash} />
                      Eliminar Entrenamiento
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
            header="Eliminar entrenamiento"
            message="¿Está seguro de que desea eliminar este entrenamiento? Esta acción no se puede deshacer."
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
                handler: eliminarEntrenamiento
              }
            ]}
          />
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default EntrenadorEntrenamientos;