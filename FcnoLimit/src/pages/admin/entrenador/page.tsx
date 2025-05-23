'use client';

import { useState, useEffect } from 'react';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  History as HistoryIcon,
  Sports as SportsIcon,
  Refresh as RefreshIcon,
  School as SchoolIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import './entrenador.css'; // Asegúrate de crear este archivo CSS

// Tipos basados en la estructura de la base de datos
interface Entrenador {
  id: number;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  dni: string;
  nacionalidad: string;
  especialidad: string;
  nivel_experiencia: 'principiante' | 'intermedio' | 'avanzado' | 'experto';
  estado: 'activo' | 'inactivo';
  email?: string;
  telefono?: string;
  usuario_id?: number;
  licencias?: string;
}

interface HistorialEquipo {
  id: number;
  entrenador_id: number;
  equipo_id: number;
  equipo_nombre: string;
  fecha_inicio: string;
  fecha_fin?: string;
  cargo: string;
  estado: string;
}

const EntrenadorPage = () => {
  // Estados para manejar datos y UI
  const [entrenadores, setEntrenadores] = useState<Entrenador[]>([]);
  const [entrenadorSeleccionado, setEntrenadorSeleccionado] = useState<Entrenador | null>(null);
  const [historialEquipos, setHistorialEquipos] = useState<HistorialEquipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [pagina, setPagina] = useState(0);
  const [itemsPorPagina] = useState(10);
  const [notificacion, setNotificacion] = useState({ mensaje: '', tipo: '', visible: false });
  const [filtro, setFiltro] = useState('');

  // Formulario para crear/editar entrenador
  const [formData, setFormData] = useState<Partial<Entrenador>>({
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    dni: '',
    nacionalidad: '',
    especialidad: '',
    nivel_experiencia: 'intermedio',
    estado: 'activo',
  });

  // Cargar datos de entrenadores
  useEffect(() => {
    fetchEntrenadores();
  }, []);

  const fetchEntrenadores = async () => {
    setLoading(true);
    try {
      // Reemplazar con tu llamada API real
      const response = await fetch('/api/entrenadores');
      if (!response.ok) {
        throw new Error('Error al cargar entrenadores');
      }
      const data = await response.json();
      setEntrenadores(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar entrenadores:', err);
      setError('No se pudieron cargar los entrenadores. Por favor, intente nuevamente.');
      
      // Datos de ejemplo para desarrollo (quitar en producción)
      setEntrenadores([
        {
          id: 1,
          nombre: 'Carlos',
          apellido: 'Rodríguez',
          fecha_nacimiento: '1978-03-15',
          dni: '22345678',
          nacionalidad: 'Argentino',
          especialidad: 'Táctica Defensiva',
          nivel_experiencia: 'experto',
          estado: 'activo',
          email: 'carlos@example.com',
          telefono: '123456789',
          licencias: 'UEFA Pro'
        },
        {
          id: 2,
          nombre: 'María',
          apellido: 'González',
          fecha_nacimiento: '1985-08-22',
          dni: '33654321',
          nacionalidad: 'Española',
          especialidad: 'Preparación Física',
          nivel_experiencia: 'avanzado',
          estado: 'activo',
          email: 'maria@example.com',
          telefono: '987654321',
          licencias: 'UEFA A'
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistorialEntrenador = async (entrenadorId: number) => {
    try {
      // Reemplazar con tu llamada API real
      const response = await fetch(`/api/entrenadores/${entrenadorId}/historial`);
      if (!response.ok) {
        throw new Error('Error al cargar historial del entrenador');
      }
      const data = await response.json();
      setHistorialEquipos(data);
      
      // Datos de ejemplo para desarrollo (quitar en producción)
      setHistorialEquipos([
        {
          id: 1,
          entrenador_id: entrenadorId,
          equipo_id: 1,
          equipo_nombre: 'FC United',
          fecha_inicio: '2019-01-15',
          fecha_fin: '2021-06-30',
          cargo: 'Entrenador Principal',
          estado: 'finalizado',
        },
        {
          id: 2,
          entrenador_id: entrenadorId,
          equipo_id: 2,
          equipo_nombre: 'Real Deportivo',
          fecha_inicio: '2021-07-01',
          fecha_fin: undefined,
          cargo: 'Director Técnico',
          estado: 'activo',
        },
      ]);
    } catch (err) {
      console.error('Error al cargar historial:', err);
      mostrarNotificacion('No se pudo cargar el historial del entrenador', 'error');
    }
  };

  const handlePaginaCambio = (nuevaPagina: number) => {
    setPagina(nuevaPagina);
  };

  const handleAbrirFormulario = (entrenador?: Entrenador) => {
    if (entrenador) {
      setEntrenadorSeleccionado(entrenador);
      setFormData({...entrenador});
    } else {
      setEntrenadorSeleccionado(null);
      setFormData({
        nombre: '',
        apellido: '',
        fecha_nacimiento: '',
        dni: '',
        nacionalidad: '',
        especialidad: '',
        nivel_experiencia: 'intermedio',
        estado: 'activo',
      });
    }
    setMostrarFormulario(true);
  };

  const handleCerrarFormulario = () => {
    setMostrarFormulario(false);
  };

  // Manejador de cambios en formulario para inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (entrenadorSeleccionado) {
        // Editar entrenador existente
        const response = await fetch(`/api/entrenadores/${entrenadorSeleccionado.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) throw new Error('Error al actualizar entrenador');
        
        setEntrenadores(entrenadores.map(e => 
          e.id === entrenadorSeleccionado.id ? { ...e, ...formData } as Entrenador : e
        ));
        
        mostrarNotificacion('Entrenador actualizado correctamente', 'exito');
      } else {
        // Crear nuevo entrenador
        const response = await fetch('/api/entrenadores', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) throw new Error('Error al crear entrenador');
        
        const nuevoEntrenador = await response.json();
        setEntrenadores([...entrenadores, nuevoEntrenador]);
        
        mostrarNotificacion('Entrenador creado correctamente', 'exito');
      }
      
      handleCerrarFormulario();
      
      // En un entorno de desarrollo sin API, simulamos la actualización
      if (!entrenadorSeleccionado) {
        const nuevoId = Math.max(...entrenadores.map(e => e.id), 0) + 1;
        setEntrenadores([...entrenadores, { id: nuevoId, ...formData } as Entrenador]);
      } else {
        setEntrenadores(entrenadores.map(e => 
          e.id === entrenadorSeleccionado.id ? { ...e, ...formData } as Entrenador : e
        ));
      }
    } catch (err) {
      console.error('Error:', err);
      mostrarNotificacion('Error al guardar el entrenador', 'error');
    }
  };

  const handleEliminarEntrenador = async (entrenadorId: number) => {
    if (!confirm('¿Está seguro de eliminar este entrenador?')) return;
    
    try {
      const response = await fetch(`/api/entrenadores/${entrenadorId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Error al eliminar entrenador');
      
      setEntrenadores(entrenadores.filter(e => e.id !== entrenadorId));
      mostrarNotificacion('Entrenador eliminado correctamente', 'exito');
    } catch (err) {
      console.error('Error al eliminar:', err);
      mostrarNotificacion('Error al eliminar el entrenador', 'error');
    }
  };

  const handleVerHistorial = (entrenador: Entrenador) => {
    setEntrenadorSeleccionado(entrenador);
    fetchHistorialEntrenador(entrenador.id);
    setMostrarHistorial(true);
  };

  const mostrarNotificacion = (mensaje: string, tipo: 'exito' | 'error') => {
    setNotificacion({ mensaje, tipo, visible: true });
    setTimeout(() => {
      setNotificacion({ ...notificacion, visible: false });
    }, 3000);
  };

  const filtrarEntrenadores = () => {
    const filtroLower = filtro.toLowerCase();
    return entrenadores.filter(entrenador => 
      entrenador.nombre.toLowerCase().includes(filtroLower) || 
      entrenador.apellido.toLowerCase().includes(filtroLower) ||
      entrenador.dni.toLowerCase().includes(filtroLower) ||
      entrenador.especialidad.toLowerCase().includes(filtroLower) ||
      entrenador.nacionalidad.toLowerCase().includes(filtroLower)
    );
  };

  const entrenadoresFiltrados = filtrarEntrenadores();
  const entrenadorPaginados = entrenadoresFiltrados.slice(
    pagina * itemsPorPagina,
    pagina * itemsPorPagina + itemsPorPagina
  );

  const getBadgeClase = (estado: string) => {
    switch (estado) {
      case 'activo': return 'badge badge-success';
      case 'inactivo': return 'badge badge-inactive';
      default: return 'badge';
    }
  };

  const getNivelExperienciaClase = (nivel: string) => {
    switch (nivel) {
      case 'principiante': return 'badge badge-info';
      case 'intermedio': return 'badge badge-primary';
      case 'avanzado': return 'badge badge-secondary';
      case 'experto': return 'badge badge-danger';
      default: return 'badge';
    }
  };

  return (
    <div className="entrenador-page">
      <header className="page-header">
        <h1>Gestión de Entrenadores</h1>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => handleAbrirFormulario()}>
            <AddIcon className="icon" />
            Nuevo Entrenador
          </button>
          <button className="btn btn-secondary icon-only" onClick={fetchEntrenadores}>
            <RefreshIcon className="icon" />
          </button>
        </div>
      </header>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por nombre, apellido, DNI, especialidad..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="search-input"
        />
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div className="table-container">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Cargando...</p>
          </div>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Especialidad</th>
                  <th>Nivel de Experiencia</th>
                  <th>Licencias</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {entrenadorPaginados.map((entrenador) => (
                  <tr key={entrenador.id}>
                    <td>{entrenador.id}</td>
                    <td>{entrenador.nombre}</td>
                    <td>{entrenador.apellido}</td>
                    <td>{entrenador.especialidad}</td>
                    <td>
                      <span className={getNivelExperienciaClase(entrenador.nivel_experiencia)}>
                        {entrenador.nivel_experiencia}
                      </span>
                    </td>
                    <td>{entrenador.licencias || '-'}</td>
                    <td>
                      <span className={getBadgeClase(entrenador.estado)}>
                        {entrenador.estado}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button 
                        className="btn btn-sm btn-primary icon-only" 
                        onClick={() => handleAbrirFormulario(entrenador)}
                        title="Editar entrenador"
                      >
                        <EditIcon className="icon-sm" />
                      </button>
                      <button 
                        className="btn btn-sm btn-secondary icon-only" 
                        onClick={() => handleVerHistorial(entrenador)}
                        title="Ver historial de equipos"
                      >
                        <HistoryIcon className="icon-sm" />
                      </button>
                      <button 
                        className="btn btn-sm btn-danger icon-only" 
                        onClick={() => handleEliminarEntrenador(entrenador.id)}
                        title="Eliminar entrenador"
                      >
                        <DeleteIcon className="icon-sm" />
                      </button>
                    </td>
                  </tr>
                ))}
                {entrenadoresFiltrados.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center">
                      No se encontraron entrenadores
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="pagination">
              <button 
                className="btn btn-sm"
                onClick={() => handlePaginaCambio(pagina - 1)}
                disabled={pagina === 0}
              >
                Anterior
              </button>
              <span className="page-info">
                Página {pagina + 1} de {Math.ceil(entrenadoresFiltrados.length / itemsPorPagina)}
              </span>
              <button 
                className="btn btn-sm"
                onClick={() => handlePaginaCambio(pagina + 1)}
                disabled={pagina >= Math.ceil(entrenadoresFiltrados.length / itemsPorPagina) - 1}
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modal para crear/editar entrenador */}
      {mostrarFormulario && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{entrenadorSeleccionado ? 'Editar Entrenador' : 'Nuevo Entrenador'}</h2>
              <button className="btn-icon" onClick={handleCerrarFormulario}>
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre</label>
                    <input
                      id="nombre"
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="apellido">Apellido</label>
                    <input
                      id="apellido"
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleInputChange}
                      required
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="dni">DNI</label>
                    <input
                      id="dni"
                      type="text"
                      name="dni"
                      value={formData.dni}
                      onChange={handleInputChange}
                      required
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="fecha_nacimiento">Fecha de Nacimiento</label>
                    <input
                      id="fecha_nacimiento"
                      type="date"
                      name="fecha_nacimiento"
                      value={formData.fecha_nacimiento}
                      onChange={handleInputChange}
                      required
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nacionalidad">Nacionalidad</label>
                    <input
                      id="nacionalidad"
                      type="text"
                      name="nacionalidad"
                      value={formData.nacionalidad}
                      onChange={handleInputChange}
                      required
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="especialidad">Especialidad</label>
                    <input
                      id="especialidad"
                      type="text"
                      name="especialidad"
                      value={formData.especialidad}
                      onChange={handleInputChange}
                      required
                      className="form-control"
                      placeholder="Ej: Táctica Defensiva, Preparación Física..."
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nivel_experiencia">Nivel de Experiencia</label>
                    <select
                      id="nivel_experiencia"
                      name="nivel_experiencia"
                      value={formData.nivel_experiencia}
                      onChange={handleInputChange}
                      required
                      className="form-control"
                    >
                      <option value="principiante">Principiante</option>
                      <option value="intermedio">Intermedio</option>
                      <option value="avanzado">Avanzado</option>
                      <option value="experto">Experto</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="estado">Estado</label>
                    <select
                      id="estado"
                      name="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                      required
                      className="form-control"
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="telefono">Teléfono</label>
                    <input
                      id="telefono"
                      type="tel"
                      name="telefono"
                      value={formData.telefono || ''}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="licencias">Licencias</label>
                  <input
                    id="licencias"
                    type="text"
                    name="licencias"
                    value={formData.licencias || ''}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Ej: UEFA Pro, UEFA A, CONMEBOL..."
                  />
                  <small className="form-text">Introduce las licencias y certificaciones separadas por comas</small>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={handleCerrarFormulario}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver historial del entrenador */}
      {mostrarHistorial && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>
                Historial de Equipos - {entrenadorSeleccionado?.nombre} {entrenadorSeleccionado?.apellido}
              </h2>
              <button className="btn-icon" onClick={() => setMostrarHistorial(false)}>
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              {historialEquipos.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Equipo</th>
                      <th>Cargo</th>
                      <th>Fecha Inicio</th>
                      <th>Fecha Fin</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historialEquipos.map((hist) => (
                      <tr key={hist.id}>
                        <td>{hist.equipo_nombre}</td>
                        <td>{hist.cargo}</td>
                        <td>{new Date(hist.fecha_inicio).toLocaleDateString()}</td>
                        <td>
                          {hist.fecha_fin ? new Date(hist.fecha_fin).toLocaleDateString() : 'Actual'}
                        </td>
                        <td>
                          <span className={`badge ${hist.estado === 'activo' ? 'badge-success' : 'badge-inactive'}`}>
                            {hist.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="message-center">
                  <p>Este entrenador no tiene historial de equipos registrado.</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setMostrarHistorial(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notificación */}
      {notificacion.visible && (
        <div className={`notification notification-${notificacion.tipo}`}>
          {notificacion.mensaje}
        </div>
      )}
    </div>
  );
};

export default EntrenadorPage;