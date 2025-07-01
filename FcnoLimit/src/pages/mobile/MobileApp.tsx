import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { 
  home, 
  football, 
  trophy, 
  statsChart,
  person,
  calendar
} from 'ionicons/icons';

// Páginas móviles
import MobileHome from './MobileHome';
import MobilePartidos from './MobilePartidos';
import MobileEquipos from './MobileEquipos';
import MobileEstadisticas from './MobileEstadisticas';
import MobilePerfil from './MobilePerfil';

const MobileApp: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/mobile">
          <Redirect to="/mobile/home" />
        </Route>
        <Route exact path="/mobile/home">
          <MobileHome />
        </Route>
        <Route exact path="/mobile/partidos">
          <MobilePartidos />
        </Route>
        <Route exact path="/mobile/equipos">
          <MobileEquipos />
        </Route>
        <Route exact path="/mobile/estadisticas">
          <MobileEstadisticas />
        </Route>
        <Route exact path="/mobile/perfil">
          <MobilePerfil />
        </Route>
        {/* Rutas adicionales para detalles */}
        <Route path="/mobile/equipo/:id">
          {/* Aquí puedes agregar componentes de detalle */}
        </Route>
        <Route path="/mobile/partido/:id">
          {/* Aquí puedes agregar componentes de detalle */}
        </Route>
      </IonRouterOutlet>
      
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/mobile/home">
          <IonIcon aria-hidden="true" icon={home} />
          <IonLabel>Inicio</IonLabel>
        </IonTabButton>
        
        <IonTabButton tab="partidos" href="/mobile/partidos">
          <IonIcon aria-hidden="true" icon={football} />
          <IonLabel>Partidos</IonLabel>
        </IonTabButton>
        
        <IonTabButton tab="equipos" href="/mobile/equipos">
          <IonIcon aria-hidden="true" icon={trophy} />
          <IonLabel>Equipos</IonLabel>
        </IonTabButton>
        
        <IonTabButton tab="estadisticas" href="/mobile/estadisticas">
          <IonIcon aria-hidden="true" icon={statsChart} />
          <IonLabel>Stats</IonLabel>
        </IonTabButton>
        
        <IonTabButton tab="perfil" href="/mobile/perfil">
          <IonIcon aria-hidden="true" icon={person} />
          <IonLabel>Perfil</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default MobileApp;
