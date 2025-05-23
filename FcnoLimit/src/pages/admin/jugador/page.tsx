'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar,
  SelectChangeEvent
} from '@mui/material';
import { Grid as MuiGrid } from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  History as HistoryIcon,
  SportsSoccer as SportsIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

// Tipos basados en la estructura de la base de datos
interface Jugador {
  id: number;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  dni: string;
  nacionalidad: string;
  posicion: string;
  estatura?: number;
  peso?: number;
  pie_dominante?: string;
  estado: 'activo' | 'inactivo' | 'lesionado' | 'suspendido';
  email?: string;
  telefono?: string;
  usuario_id?: number;
  imagen_url?: string;
}

interface HistorialEquipo {
  id: number;
  jugador_id: number;
  equipo_id: number;
  equipo_nombre: string;
  fecha_inicio: string;
  fecha_fin?: string; // Corregido: puede ser string o undefined, no null
  numero_camiseta?: number;
  estado: string;
}

// Crear componentes personalizados para evitar errores de tipos
const GridContainer = (props: any) => <MuiGrid container {...props} />;
const GridItem = (props: any) => <MuiGrid item {...props} />;

const JugadorPage = () => {
  // Estados para manejar datos y UI
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState<Jugador | null>(null);
  const [historialJugador, setHistorialJugador] = useState<HistorialEquipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openHistorialDialog, setOpenHistorialDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [filtro, setFiltro] = useState('');

  // Formulario para crear/editar jugador
  const [formData, setFormData] = useState<Partial<Jugador>>({
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    dni: '',
    nacionalidad: '',
    posicion: '',
    estado: 'activo',
  });

  // Cargar datos de jugadores
  useEffect(() => {
    fetchJugadores();
  }, []);

  const fetchJugadores = async () => {
    setLoading(true);
    try {
      // Reemplazar con tu llamada API real
      const response = await fetch('/api/jugadores');
      if (!response.ok) {
        throw new Error('Error al cargar jugadores');
      }
      const data = await response.json();
      setJugadores(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar jugadores:', err);
      setError('No se pudieron cargar los jugadores. Por favor, intente nuevamente.');
      
      // Datos de ejemplo para desarrollo (quitar en producción)
      setJugadores([
        {
          id: 1,
          nombre: 'Juan',
          apellido: 'Pérez',
          fecha_nacimiento: '1995-05-15',
          dni: '12345678',
          nacionalidad: 'Argentino',
          posicion: 'Delantero',
          estatura: 180,
          peso: 75,
          pie_dominante: 'Derecho',
          estado: 'activo',
          email: 'juan@example.com',
          telefono: '123456789',
        },
        {
          id: 2,
          nombre: 'Carlos',
          apellido: 'González',
          fecha_nacimiento: '1992-08-22',
          dni: '87654321',
          nacionalidad: 'Mexicano',
          posicion: 'Defensor',
          estatura: 185,
          peso: 82,
          pie_dominante: 'Izquierdo',
          estado: 'lesionado',
          email: 'carlos@example.com',
          telefono: '987654321',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistorialJugador = async (jugadorId: number) => {
    try {
      // Reemplazar con tu llamada API real
      const response = await fetch(`/api/jugadores/${jugadorId}/historial`);
      if (!response.ok) {
        throw new Error('Error al cargar historial del jugador');
      }
      const data = await response.json();
      setHistorialJugador(data);
      
      // Datos de ejemplo para desarrollo (quitar en producción)
      setHistorialJugador([
        {
          id: 1,
          jugador_id: jugadorId,
          equipo_id: 1,
          equipo_nombre: 'FC United',
          fecha_inicio: '2021-01-15',
          fecha_fin: '2022-06-30',
          numero_camiseta: 10,
          estado: 'finalizado',
        },
        {
          id: 2,
          jugador_id: jugadorId,
          equipo_id: 2,
          equipo_nombre: 'Real Deportivo',
          fecha_inicio: '2022-07-01',
          fecha_fin: undefined, // Cambiado a undefined en lugar de null
          numero_camiseta: 7,
          estado: 'activo',
        },
      ]);
    } catch (err) {
      console.error('Error al cargar historial:', err);
      setSnackbarSeverity('error');
      setSnackbarMessage('No se pudo cargar el historial del jugador');
      setOpenSnackbar(true);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (jugador?: Jugador) => {
    if (jugador) {
      setJugadorSeleccionado(jugador);
      setFormData({...jugador});
    } else {
      setJugadorSeleccionado(null);
      setFormData({
        nombre: '',
        apellido: '',
        fecha_nacimiento: '',
        dni: '',
        nacionalidad: '',
        posicion: '',
        estado: 'activo',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Manejador de cambios en formulario para TextField
  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Manejador de cambios en Select
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (jugadorSeleccionado) {
        // Editar jugador existente
        const response = await fetch(`/api/jugadores/${jugadorSeleccionado.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) throw new Error('Error al actualizar jugador');
        
        setJugadores(jugadores.map(j => 
          j.id === jugadorSeleccionado.id ? { ...j, ...formData } as Jugador : j
        ));
        
        setSnackbarMessage('Jugador actualizado correctamente');
      } else {
        // Crear nuevo jugador
        const response = await fetch('/api/jugadores', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) throw new Error('Error al crear jugador');
        
        const nuevoJugador = await response.json();
        setJugadores([...jugadores, nuevoJugador]);
        
        setSnackbarMessage('Jugador creado correctamente');
      }
      
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      handleCloseDialog();
      
      // En un entorno de desarrollo sin API, simulamos la actualización
      if (!jugadorSeleccionado) {
        const nuevoId = Math.max(...jugadores.map(j => j.id)) + 1;
        setJugadores([...jugadores, { id: nuevoId, ...formData } as Jugador]);
      } else {
        setJugadores(jugadores.map(j => 
          j.id === jugadorSeleccionado.id ? { ...j, ...formData } as Jugador : j
        ));
      }
    } catch (err) {
      console.error('Error:', err);
      setSnackbarSeverity('error');
      setSnackbarMessage('Error al guardar el jugador');
      setOpenSnackbar(true);
    }
  };

  const handleDeleteJugador = async (jugadorId: number) => {
    if (!confirm('¿Está seguro de eliminar este jugador?')) return;
    
    try {
      const response = await fetch(`/api/jugadores/${jugadorId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Error al eliminar jugador');
      
      setJugadores(jugadores.filter(j => j.id !== jugadorId));
      setSnackbarSeverity('success');
      setSnackbarMessage('Jugador eliminado correctamente');
      setOpenSnackbar(true);
    } catch (err) {
      console.error('Error al eliminar:', err);
      setSnackbarSeverity('error');
      setSnackbarMessage('Error al eliminar el jugador');
      setOpenSnackbar(true);
    }
  };

  const handleVerHistorial = (jugador: Jugador) => {
    setJugadorSeleccionado(jugador);
    fetchHistorialJugador(jugador.id);
    setOpenHistorialDialog(true);
  };

  const filtrarJugadores = () => {
    const filtroLower = filtro.toLowerCase();
    return jugadores.filter(jugador => 
      jugador.nombre.toLowerCase().includes(filtroLower) || 
      jugador.apellido.toLowerCase().includes(filtroLower) ||
      jugador.dni.toLowerCase().includes(filtroLower) ||
      jugador.posicion.toLowerCase().includes(filtroLower) ||
      jugador.nacionalidad.toLowerCase().includes(filtroLower)
    );
  };

  const jugadoresFiltrados = filtrarJugadores();

  const getEstadoChipColor = (estado: string) => {
    switch (estado) {
      case 'activo': return 'success';
      case 'inactivo': return 'default';
      case 'lesionado': return 'error';
      case 'suspendido': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Gestión de Jugadores
        </Typography>
        <Box>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />} 
            onClick={() => handleOpenDialog()}
            sx={{ mr: 1 }}
          >
            Nuevo Jugador
          </Button>
          <IconButton color="primary" onClick={fetchJugadores}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <TextField
          fullWidth
          label="Buscar jugadores"
          variant="outlined"
          size="small"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Buscar por nombre, apellido, DNI, posición..."
        />
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}

      <Paper>
        <TableContainer component={Paper}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Apellido</TableCell>
                  <TableCell>DNI</TableCell>
                  <TableCell>Fecha Nacimiento</TableCell>
                  <TableCell>Nacionalidad</TableCell>
                  <TableCell>Posición</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jugadoresFiltrados
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((jugador) => (
                    <TableRow key={jugador.id}>
                      <TableCell>{jugador.id}</TableCell>
                      <TableCell>{jugador.nombre}</TableCell>
                      <TableCell>{jugador.apellido}</TableCell>
                      <TableCell>{jugador.dni}</TableCell>
                      <TableCell>
                        {new Date(jugador.fecha_nacimiento).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{jugador.nacionalidad}</TableCell>
                      <TableCell>{jugador.posicion}</TableCell>
                      <TableCell>
                        <Chip 
                          label={jugador.estado} 
                          color={getEstadoChipColor(jugador.estado) as any} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Editar jugador">
                          <IconButton 
                            color="primary" 
                            onClick={() => handleOpenDialog(jugador)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Ver historial de equipos">
                          <IconButton 
                            color="secondary" 
                            onClick={() => handleVerHistorial(jugador)}
                          >
                            <HistoryIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar jugador">
                          <IconButton 
                            color="error" 
                            onClick={() => handleDeleteJugador(jugador.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                {jugadoresFiltrados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No se encontraron jugadores
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={jugadoresFiltrados.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </TableContainer>
      </Paper>

      {/* Dialog para crear/editar jugador */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {jugadorSeleccionado ? 'Editar Jugador' : 'Nuevo Jugador'}
        </DialogTitle>
        <DialogContent>
          <GridContainer spacing={2} sx={{ mt: 1 }}>
            <GridItem xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleTextFieldChange}
                required
                variant="outlined"
              />
            </GridItem>
            <GridItem xs={12} sm={6}>
              <TextField
                fullWidth
                label="Apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleTextFieldChange}
                required
                variant="outlined"
              />
            </GridItem>
            <GridItem xs={12} sm={6}>
              <TextField
                fullWidth
                label="DNI"
                name="dni"
                value={formData.dni}
                onChange={handleTextFieldChange}
                required
                variant="outlined"
              />
            </GridItem>
            <GridItem xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fecha de Nacimiento"
                name="fecha_nacimiento"
                type="date"
                value={formData.fecha_nacimiento}
                onChange={handleTextFieldChange}
                required
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </GridItem>
            <GridItem xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nacionalidad"
                name="nacionalidad"
                value={formData.nacionalidad}
                onChange={handleTextFieldChange}
                required
                variant="outlined"
              />
            </GridItem>
            <GridItem xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Posición</InputLabel>
                <Select
                  label="Posición"
                  name="posicion"
                  value={formData.posicion || ''}
                  onChange={handleSelectChange}
                  required
                >
                  <MenuItem value="Arquero">Arquero</MenuItem>
                  <MenuItem value="Defensor">Defensor</MenuItem>
                  <MenuItem value="Mediocampista">Mediocampista</MenuItem>
                  <MenuItem value="Delantero">Delantero</MenuItem>
                </Select>
              </FormControl>
            </GridItem>
            <GridItem xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Estado</InputLabel>
                <Select
                  label="Estado"
                  name="estado"
                  value={formData.estado || 'activo'}
                  onChange={handleSelectChange}
                  required
                >
                  <MenuItem value="activo">Activo</MenuItem>
                  <MenuItem value="inactivo">Inactivo</MenuItem>
                  <MenuItem value="lesionado">Lesionado</MenuItem>
                  <MenuItem value="suspendido">Suspendido</MenuItem>
                </Select>
              </FormControl>
            </GridItem>
            <GridItem xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleTextFieldChange}
                variant="outlined"
              />
            </GridItem>
            <GridItem xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                value={formData.telefono || ''}
                onChange={handleTextFieldChange}
                variant="outlined"
              />
            </GridItem>
            <GridItem xs={12} sm={4}>
              <TextField
                fullWidth
                label="Estatura (cm)"
                name="estatura"
                type="number"
                value={formData.estatura || ''}
                onChange={handleTextFieldChange}
                variant="outlined"
              />
            </GridItem>
            <GridItem xs={12} sm={4}>
              <TextField
                fullWidth
                label="Peso (kg)"
                name="peso"
                type="number"
                value={formData.peso || ''}
                onChange={handleTextFieldChange}
                variant="outlined"
              />
            </GridItem>
            <GridItem xs={12} sm={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Pie Dominante</InputLabel>
                <Select
                  label="Pie Dominante"
                  name="pie_dominante"
                  value={formData.pie_dominante || ''}
                  onChange={handleSelectChange}
                >
                  <MenuItem value="">Seleccionar</MenuItem>
                  <MenuItem value="Derecho">Derecho</MenuItem>
                  <MenuItem value="Izquierdo">Izquierdo</MenuItem>
                  <MenuItem value="Ambidiestro">Ambidiestro</MenuItem>
                </Select>
              </FormControl>
            </GridItem>
          </GridContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para ver historial del jugador */}
      <Dialog open={openHistorialDialog} onClose={() => setOpenHistorialDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Historial de Equipos - {jugadorSeleccionado?.nombre} {jugadorSeleccionado?.apellido}
        </DialogTitle>
        <DialogContent>
          {historialJugador.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Equipo</TableCell>
                    <TableCell>Fecha Inicio</TableCell>
                    <TableCell>Fecha Fin</TableCell>
                    <TableCell>Número</TableCell>
                    <TableCell>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historialJugador.map((hist) => (
                    <TableRow key={hist.id}>
                      <TableCell>{hist.equipo_nombre}</TableCell>
                      <TableCell>{new Date(hist.fecha_inicio).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {hist.fecha_fin ? new Date(hist.fecha_fin).toLocaleDateString() : 'Actual'}
                      </TableCell>
                      <TableCell>{hist.numero_camiseta || '-'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={hist.estado} 
                          color={hist.estado === 'activo' ? 'success' : 'default'} 
                          size="small" 
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body1">
                Este jugador no tiene historial de equipos registrado.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHistorialDialog(false)} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensajes */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={snackbarSeverity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default JugadorPage;