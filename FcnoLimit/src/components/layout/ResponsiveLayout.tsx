import React from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { isMobileApp } from '../../utils/platformDetection';
import MobileTabBar from '../mobile/MobileTabBar';
import NavBar from '../NavBar';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  showTabBar?: boolean;
  className?: string;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ 
  children, 
  showTabBar = true,
  className 
}) => {
  const isNativeMobile = isMobileApp();
  
  // Detectar si es un smartphone (ancho de pantalla pequeño) independientemente de si es nativo o web
  const isSmartphone = typeof window !== 'undefined' && window.innerWidth <= 768;

  // Si es móvil nativo O smartphone web, usar layout móvil SIN NAVBAR
  if (isNativeMobile || isSmartphone) {
    return (
      <>
        {/* Ocultar el navbar/hamburguesa y footer en smartphones usando CSS */}
        {isSmartphone && !isNativeMobile && (
          <style>
            {`
              .navbar,
              .navbar-toggler,
              .navbar-header,
              .navbar-collapse,
              .navbar-brand {
                display: none !important;
              }
              
              /* OCULTAR FOOTER EN MÓVIL */
              .footer,
              .footer-separator,
              footer {
                display: none !important;
              }
              
              body {
                padding-top: 0 !important;
              }
              
              .mobile-content {
                padding-bottom: 80px !important; /* Espacio para el tab bar */
                min-height: 100vh;
              }
            `}
          </style>
        )}
        
        <IonPage className={className}>
          <IonContent 
            className="mobile-content"
            style={{ 
              paddingBottom: showTabBar ? '80px' : '0' // Espacio para el TabBar
            }}
          >
            {children}
          </IonContent>
          
          {showTabBar && <MobileTabBar />}
        </IonPage>
      </>
    );
  }

  // Layout para web desktop - CON NAVBAR
  return (
    <div className={`web-layout ${className || ''}`}>
      <NavBar />
      {children}
    </div>
  );
};

export default ResponsiveLayout;
