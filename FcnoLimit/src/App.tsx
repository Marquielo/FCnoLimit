import { Redirect, Route, useLocation } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import NavBar from './components/NavBar';
import MobileTabBar from './components/mobile/MobileTabBar';
import EquiposPage from './pages/home/equipos/EquiposPage';
import JugadoresPage from './pages/admin/jugador/JugadoresPage';
import ComparativasPage from './pages/home/estadisticas/ComparativasPage';
import PartidosPage from './pages/home/partidos/PartidosPage';      
import InicioPage from './pages/home/inicio/InicioPage';
import AuthPage from './pages/home/auth/AuthPage';
import AuthPageMobile from './pages/home/auth/AuthPageMobile';
import CampeonatosPage from './pages/home/campeonato/CampeonatoPage';
import NoticiasPage  from './pages/home/noticias/NoticiasPage';
import AdminDashboard from './pages/home/admin/AdminDashboard';
import PerfilPage from './pages/home/perfil/PerfilPage';
import ProtectedRoute from './components/ProtectedRoute';
import React, { useEffect, useState } from 'react';
import { useDeviceDetection, generateResponsiveCSS } from './utils/deviceDetection';
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
import './styles/mobile/mobile-theme.css';

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
import EquipoPartidosPage from './pages/home/equipos/EquipoPartidosPage';
import EquiposResultadosPage from './pages/home/equipos/EquiposResultadosPage';
import { startGlobalParticlesEffect } from './effects/globalParticlesEffect';
import PaginaNoticiasEnVivo from './pages/PaginaNoticiasEnVivo';
import SimpleGoogleAuth from './components/SimpleGoogleAuth';
import PlayerCardsDemo from './pages/PlayerCardsDemo';
import FloatingChatbot from './components/FloatingChatbot/FloatingChatbotSimple';
import { MobileApp } from './pages/mobile';

setupIonicReact({
  mode: 'md',
  animated: true
});

const App: React.FC = () => {
  // Usar el hook de detección de dispositivos
  const { 
    isMobile, 
    deviceType, 
    shouldShowMobileTabBar, 
    shouldShowDesktopNavBar 
  } = useDeviceDetection();

  // Estado para detectar primera carga después del login
  const [isFirstLoadAfterLogin, setIsFirstLoadAfterLogin] = useState(false);

  useEffect(() => {
    const stopParticles = startGlobalParticlesEffect();
    return () => {
      if (typeof stopParticles === 'function') stopParticles();
    };
  }, []);

  // Efecto para detectar si es la primera carga después del login
  useEffect(() => {
    const checkFirstLogin = () => {
      const userJSON = localStorage.getItem('usuario');
      const accessToken = localStorage.getItem('accessToken') || localStorage.getItem('token');
      const hasShownWelcome = localStorage.getItem('hasShownWelcomeChatbot');
      
      // Si hay usuario autenticado pero no se ha mostrado el welcome
      if (userJSON && accessToken && !hasShownWelcome) {
        setIsFirstLoadAfterLogin(true);
        localStorage.setItem('hasShownWelcomeChatbot', 'true');
      }
    };

    checkFirstLogin();
  }, []);

  // Renderizar componente de navegación basado en el tipo de dispositivo
  const renderNavigation = () => {
    // Rutas donde NO debe aparecer la navegación
    const noNavigationRoutes = ['/auth'];
    const currentPath = window.location.pathname;
    const shouldHideNavigation = noNavigationRoutes.includes(currentPath);

    if (shouldHideNavigation) {
      return null; // No mostrar navegación en rutas específicas
    }
    
    if (shouldShowMobileTabBar) {
      return <MobileTabBar />;
    } else if (shouldShowDesktopNavBar) {
      return <NavBar />;
    }
    return null;
  };

  // Renderizar chatbot solo si no estamos en rutas de autenticación
  const renderChatbot = () => {
    const noChatbotRoutes = ['/auth'];
    const currentPath = window.location.pathname;
    const shouldHideChatbot = noChatbotRoutes.includes(currentPath);

    if (shouldHideChatbot) {
      return null; // No mostrar chatbot en rutas de autenticación
    }
    
    return <FloatingChatbot showWelcome={isFirstLoadAfterLogin} />;
  };
  return (
    <IonApp className={`light-theme ${deviceType}-app`}>
      {/* Estilos CSS dinámicos generados automáticamente */}
      <style>
        {generateResponsiveCSS(isMobile)}
      </style>

      <IonReactRouter>
        <IonRouterOutlet>
          {/* Rutas públicas */}
            <Route exact path="/auth" render={() => 
              isMobile ? <AuthPageMobile /> : <AuthPage />
            } />
            <Route exact path="/google-test" component={SimpleGoogleAuth} />
            <Route exact path="/player-cards" component={PlayerCardsDemo} />
            
          {/* Ruta de inicio protegida */}
          <Route exact path="/inicio" render={() => (
            <ProtectedRoute>
              <InicioPage />
            </ProtectedRoute>
          )} />

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
          {/* Agrega esta ruta para ver los partidos de un equipo (pendientes o jugados) */}
          <Route exact path="/equipos/:id/partidos" render={({ match }) => (
            <ProtectedRoute>
              <EquipoPartidosPage />
            </ProtectedRoute>
          )} />
          <Route exact path="/equipos/:id/resultados" render={() => (
            <ProtectedRoute>
              <EquiposResultadosPage />
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
          <Route exact path="/noticias-en-vivo" render={() => (
            <ProtectedRoute>
              <PaginaNoticiasEnVivo />
            </ProtectedRoute>
          )} />

          {/* Rutas para aplicación móvil */}
          <Route path="/mobile">
            <MobileApp />
          </Route>

          <Route exact path="/">
            <Redirect to="/auth" />
          </Route>
        </IonRouterOutlet>
        
        {/* Renderizar navegación condicional */}
        {renderNavigation()}
      </IonReactRouter>
      {/* Renderizar chatbot condicional */}
      {renderChatbot()}
    </IonApp>
  );
};

export default App;
