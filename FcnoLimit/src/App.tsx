import React from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';

import AuthPage from './pages/home/auth/AuthPage';
import InicioPage from './pages/home//inicio/InicioPage';
import AdminDashboard from './pages/admin/dashboard/AdminDashboard';
import JugadorPerfil from './pages/jugador/perfil/JugadorPerfil';
import EntrenadorPerfil from './pages/entrenador/perfil/EntrenadorPerfil';
import CompletarPerfilJugador from './pages/jugador/perfil/CompletarPerfil';
import CompletarPerfilEntrenador from './pages/entrenador/perfil/CompletarPerfil';
import PrivateRoute from './components/PrivateRoute';

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

/* Theme variables */
import './styles/variables.css';

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {/* Rutas públicas */}
          <Route path="/auth" component={AuthPage} exact />
          <Route path="/inicio" component={InicioPage} exact />
          <Route path="/" exact render={() => <Redirect to="/inicio" />} />
          
          {/* Rutas para administrador */}
          <PrivateRoute 
            path="/admin/dashboard" 
            component={AdminDashboard} 
            allowedRoles={['admin']} 
            exact 
          />
          <PrivateRoute 
            path="/admin" 
            exact
            component={() => <Redirect to="/admin/dashboard" />} 
            allowedRoles={['admin']} 
          />
          
          {/* Rutas para jugador */}
          <PrivateRoute 
            path="/jugador/perfil/completar" 
            component={CompletarPerfilJugador} 
            allowedRoles={['jugador']} 
            exact 
          />
          <PrivateRoute 
            path="/jugador/perfil" 
            component={JugadorPerfil} 
            allowedRoles={['jugador']} 
            exact 
          />
          <PrivateRoute 
            path="/jugador" 
            exact
            component={() => <Redirect to="/jugador/perfil" />} 
            allowedRoles={['jugador']} 
          />
          
          {/* Rutas para entrenador */}
          <PrivateRoute 
            path="/entrenador/perfil/completar" 
            component={CompletarPerfilEntrenador} 
            allowedRoles={['entrenador']} 
            exact 
          />
          <PrivateRoute 
            path="/entrenador/perfil" 
            component={EntrenadorPerfil} 
            allowedRoles={['entrenador']} 
            exact 
          />
          <PrivateRoute 
            path="/entrenador" 
            exact
            component={() => <Redirect to="/entrenador/perfil" />} 
            allowedRoles={['entrenador']} 
          />
          
          {/* Ruta para cuando no se encuentra la página */}
          <Route render={() => <Redirect to="/inicio" />} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
