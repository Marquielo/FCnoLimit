import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import NavBar from './components/NavBar';
import EquiposPage from './pages/equipos/EquiposPage';
import JugadoresPage from './pages/jugadores/JugadoresPage';
import ComparativasPage from './pages/estadisticas/ComparativasPage';
import PartidosPage from './pages/partidos/PartidosPage';      
import InicioPage from './pages/inicio/InicioPage';
import AuthPage from './pages/auth/AuthPage';
import CampeonatosPage from './pages/campeonato/CampeonatoPage';
import NoticiasPage  from './pages/noticias/NoticiasPage';
import AdminDashboard from './pages/admin/AdminDashboard';
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
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        {/* Rutas públicas */}
        <Route exact path="/inicio">
          <InicioPage />
        </Route>
        <Route exact path="/auth">
          <AuthPage />
        </Route>
        {/* Rutas protegidas */}
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
        <Route exact path="/jugadores" render={() => (
          <ProtectedRoute>
            <JugadoresPage />
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
        <Route exact path="/admin" render={() => (
          <ProtectedRoute>
            <AdminDashboard />
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
