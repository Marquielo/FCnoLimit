import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import NavBar from './components/NavBar';
import EquiposPage from './pages/home/equipos/EquiposPage';
import JugadoresPage from './pages/admin/jugador/JugadoresPage';
import ComparativasPage from './pages/home/estadisticas/ComparativasPage';
import PartidosPage from './pages/home/partidos/PartidosPage';      
import InicioPage from './pages/home/inicio/InicioPage';
import AuthPage from './pages/home/auth/AuthPage';
import CampeonatosPage from './pages/home/campeonato/CampeonatoPage';
import NoticiasPage  from './pages/home/noticias/NoticiasPage';
import AdminDashboard from './pages/home/admin/AdminDashboard';
import PerfilPage from './pages/home/perfil/PerfilPage';
import ProtectedRoute from './components/ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './styles/variables.css';

import JugadorPerfil from './pages/admin/jugador/perfil/JugadorPerfil';
import JugadorEstadisticas from './pages/admin/jugador/estadisticas/Estadisticas';
import JugadorEntrenamientos from './pages/admin/jugador/entrenamientos/JugadorEntrenamientos';
import EntrenadorPerfil from './pages/admin/entrenador/perfil/EntrenadorPerfil';
import EntrenadorEquipo from './pages/admin/entrenador/equipos/EntrenadorEquipo';
import EntrenadorEstadisticas from './pages/admin/entrenador/estadistica/EntrenadorEstadisticas';
import EntrenadorEntrenamientos from './pages/admin/entrenador/entrenamientos/EntrenadorEntrenamientos';
import EntrenadorPage from './pages/admin/entrenador/page';
import EntrenadorTacticas from './pages/admin/entrenador/tactica/EntrenadorTacticas';
import BuscarPage from './pages/home/buscar/BuscarPage';
import AdminPartidos from './pages/admin/AdminPartidos';
import CrearPartido from './pages/admin/CrearPartido';
import EditarSolicitud from './pages/admin/EditarSolicitud';


setupIonicReact({
  mode: 'md',
  animated: true
});

const App: React.FC = () => (
  <IonApp className="light-theme">
    <IonReactRouter>
      <IonRouterOutlet>
        {/* Rutas públicas */}
        <Route exact path="/inicio" component={InicioPage} />
        <Route exact path="/auth" component={AuthPage} />

        {/* Rutas de Jugador */}
        <Route exact path="/jugador/perfil" render={() => (
          <ProtectedRoute>
            <JugadorPerfil />
          </ProtectedRoute>
        )} />
        <Route exact path="/jugador/estadisticas" render={() => (
          <ProtectedRoute>
            <JugadorEstadisticas />
          </ProtectedRoute>
        )} />
        <Route exact path="/jugador/entrenamientos" render={() => (
          <ProtectedRoute>
            <JugadorEntrenamientos />
          </ProtectedRoute>
        )} />

        {/* Rutas de Entrenador */}
        <Route exact path="/entrenador/perfil" render={() => (
          <ProtectedRoute>
            <EntrenadorPerfil />
          </ProtectedRoute>
        )} />
        <Route exact path="/entrenador/equipo" render={() => (
          <ProtectedRoute>
            <EntrenadorEquipo />
          </ProtectedRoute>
        )} />
        <Route exact path="/entrenador/estadisticas" render={() => (
          <ProtectedRoute>
            <EntrenadorEstadisticas />
          </ProtectedRoute>
        )} />
        <Route exact path="/entrenador/entrenamientos" render={() => (
          <ProtectedRoute>
            <EntrenadorEntrenamientos />
          </ProtectedRoute>
        )} />
        <Route exact path="/entrenador/tactica" render={() => (
          <ProtectedRoute>
            <EntrenadorTacticas />
          </ProtectedRoute>
        )} />

        {/* Rutas de Administrador */}
        <Route exact path="/admin/dashboard" render={() => (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        )} />
        {/* Añadido para el botón Panel Admin del navbar */}
        <Route exact path="/admin/AdminDashboard" render={() => (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        )} />
        <Route exact path="/admin/adminpartidos" render={() => (
          <ProtectedRoute>
            <AdminPartidos />
          </ProtectedRoute>
        )} />
        <Route exact path="/admin/jugadores" render={() => (
          <ProtectedRoute>
            <JugadoresPage />
          </ProtectedRoute>
        )} />
        <Route exact path="/admin/entrenadores" render={() => (
          <ProtectedRoute>
            <EntrenadorPage />
          </ProtectedRoute>
        )} />
        <Route exact path="/admin/campeonatos" render={() => (
          <ProtectedRoute>
            <CampeonatosPage />
          </ProtectedRoute>
        )} />
        <Route exact path="/admin/crear-partido" render={() => (
          <ProtectedRoute>
            <CrearPartido />
          </ProtectedRoute>
        )} />
        <Route exact path="/admin/EditarSolicitud" render={() => (
          <ProtectedRoute>
            <EditarSolicitud />
          </ProtectedRoute>
        )} />

        {/* Rutas comunes protegidas */}
        <Route exact path="/campeonatos" render={() => (
          <ProtectedRoute>
            <CampeonatosPage />
          </ProtectedRoute>
        )} />
        <Route exact path="/equipos" render={() => (
          <ProtectedRoute>
            <EquiposPage />
          </ProtectedRoute>
        )} />
        {/* Agrega esta ruta para ver el detalle de un equipo */}
        <Route exact path="/equipos/:id" render={({ match }) => (
          <ProtectedRoute>
            <EquiposPage />
          </ProtectedRoute>
        )} />
        {/* Agrega esta ruta para ver los partidos de un equipo */}
        <Route exact path="/equipos/:id/partidos" render={({ match }) => (
          <ProtectedRoute>
            <PartidosPage />
          </ProtectedRoute>
        )} />
        <Route exact path="/partidos" render={() => (
          <ProtectedRoute>
            <PartidosPage />
          </ProtectedRoute>
        )} />
        <Route exact path="/comparativas" render={() => (
          <ProtectedRoute>
            <ComparativasPage />
          </ProtectedRoute>
        )} />
        <Route exact path="/noticias" render={() => (
          <ProtectedRoute>
            <NoticiasPage />
          </ProtectedRoute>
        )} />
        <Route exact path="/perfil" render={() => (
          <ProtectedRoute>
            <PerfilPage />
          </ProtectedRoute>
        )} />

        {/* Ruta para BuscarPage */}
        <Route exact path="/home/buscar" render={() => (
          <ProtectedRoute>
            <BuscarPage />
          </ProtectedRoute>
        )} />

        <Route exact path="/">
          <Redirect to="/inicio" />
        </Route>
      </IonRouterOutlet>
      <NavBar />
    </IonReactRouter>
  </IonApp>
);

export default App;
