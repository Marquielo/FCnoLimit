import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle } from 'ionicons/icons';
import NavBar from './components/NavBar';
import EquiposPage from './pages/EquiposPage';
import JugadoresPage from './pages/JugadoresPage';
import ComparativasPage from './pages/ComparativasPage';
import PartidosPage from './pages/PartidosPage';      
import InicioPage from './pages/InicioPage';
import AuthPage from './pages/AuthPage';
import CampeonatosPage from './pages/CampeonatoPage';
import NoticiasPage  from './pages/NoticiasPage';
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
      <Route exact path="/inicio">
        <InicioPage />
      </Route>
      <Route exact path="/auth">
        <AuthPage />
      </Route>
      <Route exact path="/Campeonatos">
        <CampeonatosPage />
      </Route>
      <Route exact path="/equipos">
        <EquiposPage />
      </Route>
      <Route exact path="/jugadores">
        <JugadoresPage />
      </Route>
      <Route exact path="/partidos">
        <PartidosPage />
      </Route>
      <Route exact path="/comparativas">
        <ComparativasPage />
      </Route>
      <Route exact path="/noticias">
        <NoticiasPage />
      </Route>
      <Route exact path="/">
        <Redirect to="/inicio" />
      </Route>
    </IonRouterOutlet>
    <NavBar /> {/* Agregamos la barra de navegación */}
  </IonReactRouter>
</IonApp>
);

export default App;
