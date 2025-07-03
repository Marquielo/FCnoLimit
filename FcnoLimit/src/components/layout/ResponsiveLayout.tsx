import React, { useState, useEffect } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { isMobileApp } from '../../utils/platformDetection';
import MobileTabBar from '../mobile/MobileTabBar';
import NavBar from '../NavBar';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  showTabBar?: boolean;
  className?: string;
  fullHeight?: boolean;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ 
  children, 
  showTabBar = true,
  className,
  fullHeight = false
}) => {
  const isNativeMobile = isMobileApp();
  const [isSmartphone, setIsSmartphone] = useState(false);

  // Detectar tamaño de pantalla de forma reactiva
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmartphone(window.innerWidth <= 768);
    };

    // Verificar al montar
    checkScreenSize();

    // Escuchar cambios de tamaño de ventana
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Si es móvil nativo O smartphone web, usar layout móvil SIN NAVBAR
  if (isNativeMobile || isSmartphone) {
    return (
      <>
        {/* Estilos CSS integrados para móvil */}
        <style>
          {`
            /* OCULTAR NAVBAR COMPLETO EN MÓVIL */
            @media (max-width: 768px) {
              .navbar,
              .navbar-toggler,
              .navbar-header,
              .navbar-collapse,
              .navbar-brand,
              .hamburger-menu,
              .mobile-nav-toggle,
              .nav-hamburger,
              .navbar-nav {
                display: none !important;
              }
              
              /* OCULTAR FOOTER EN MÓVIL */
              .footer,
              .footer-separator,
              footer,
              .mobile-hidden {
                display: none !important;
              }
              
              /* AJUSTAR BODY Y CONTENIDO */
              body {
                padding-top: 0 !important;
                margin-top: 0 !important;
              }
              
              /* CONTENIDO MÓVIL */
              .mobile-content {
                padding-bottom: ${showTabBar ? '80px' : '20px'} !important;
                min-height: ${fullHeight ? '100vh' : 'auto'};
                overflow-x: hidden;
              }
              
              /* AJUSTES PARA IONIC */
              ion-content {
                --padding-bottom: ${showTabBar ? '80px' : '20px'} !important;
                --overflow: hidden;
              }
              
              /* PREVENIR SCROLL HORIZONTAL */
              .ion-page {
                overflow-x: hidden;
                max-width: 100vw;
              }
              
              /* COMPATIBILIDAD CON NOTCH */
              .mobile-tab-bar {
                padding-bottom: env(safe-area-inset-bottom);
              }
            }
          `}
        </style>
        
        <IonPage className={`mobile-layout ${className || ''}`}>
          <IonContent 
            className="mobile-content"
            scrollY={true}
            scrollX={false}
          >
            <div className="mobile-content-wrapper">
              {children}
            </div>
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
      <div className="web-content-wrapper">
        {children}
      </div>
      
      {/* Footer solo en desktop */}
      <div className="desktop-only">
        {/* Aquí puedes agregar footer si tienes */}
      </div>
    </div>
  );
};

export default ResponsiveLayout;
