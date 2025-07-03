/**
 * 📱 Utilidades para Detección de Dispositivos
 * ==========================================
 * Este archivo contiene funciones utilitarias para detectar
 * si la aplicación está corriendo en un dispositivo móvil o web
 */

// Tipos de dispositivos
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

// Configuración para breakpoints
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1025
} as const;

/**
 * Detecta si es un dispositivo móvil basado en user agent
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';
  
  // Patrones para detectar dispositivos móviles
  const mobilePatterns = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /IEMobile/i,
    /Opera Mini/i,
    /Mobile/i,
    /Tablet/i
  ];
  
  return mobilePatterns.some(pattern => pattern.test(userAgent));
};

/**
 * Detecta si es una pantalla pequeña (móvil)
 */
export const isSmallScreen = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= BREAKPOINTS.mobile;
};

/**
 * Detecta si es una tablet
 */
export const isTablet = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const width = window.innerWidth;
  const userAgent = navigator.userAgent || '';
  
  // Detectar iPad específicamente
  const isIPad = /iPad/i.test(userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  
  // Detectar otras tablets por tamaño de pantalla
  const isTabletSize = width > BREAKPOINTS.mobile && width <= BREAKPOINTS.tablet;
  
  return isIPad || (isTabletSize && isMobileDevice());
};

/**
 * Obtiene el tipo de dispositivo actual
 */
export const getDeviceType = (): DeviceType => {
  if (isSmallScreen() || (isMobileDevice() && !isTablet())) {
    return 'mobile';
  }
  
  if (isTablet()) {
    return 'tablet';
  }
  
  return 'desktop';
};

/**
 * Detecta si debe mostrar el MobileTabBar
 */
export const shouldShowMobileTabBar = (): boolean => {
  const deviceType = getDeviceType();
  return deviceType === 'mobile';
};

/**
 * Detecta si debe mostrar el NavBar desktop
 */
export const shouldShowDesktopNavBar = (): boolean => {
  const deviceType = getDeviceType();
  return deviceType === 'desktop' || deviceType === 'tablet';
};

/**
 * Hook para detectar cambios en el tipo de dispositivo
 */
export const useDeviceDetection = () => {
  const [deviceType, setDeviceType] = React.useState<DeviceType>('desktop');
  const [isMobile, setIsMobile] = React.useState(false);
  
  React.useEffect(() => {
    const handleResize = () => {
      const newDeviceType = getDeviceType();
      setDeviceType(newDeviceType);
      setIsMobile(newDeviceType === 'mobile');
    };
    
    // Detectar al montar
    handleResize();
    
    // Escuchar cambios de tamaño
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);
  
  return {
    deviceType,
    isMobile,
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    shouldShowMobileTabBar: deviceType === 'mobile',
    shouldShowDesktopNavBar: deviceType !== 'mobile'
  };
};

/**
 * Obtiene la configuración de navegación según el dispositivo
 */
export const getNavigationConfig = () => {
  const deviceType = getDeviceType();
  
  return {
    showMobileTabBar: deviceType === 'mobile',
    showDesktopNavBar: deviceType !== 'mobile',
    hideHamburgerMenu: deviceType === 'mobile',
    showFooter: deviceType !== 'mobile',
    contentPaddingBottom: deviceType === 'mobile' ? '80px' : '0',
    containerClass: `${deviceType}-layout`
  };
};

/**
 * Genera CSS dinámico para ocultar/mostrar elementos según el dispositivo
 */
export const generateResponsiveCSS = (isMobile: boolean): string => {
  return `
    ${isMobile ? `
      /* Ocultar elementos de desktop en móvil */
      .navbar,
      .navbar-toggler,
      .navbar-header,
      .navbar-collapse,
      .navbar-brand,
      .hamburger-menu,
      .mobile-nav-toggle,
      .nav-hamburger,
      .navbar-nav,
      .desktop-only {
        display: none !important;
      }
      
      /* Ajustar body para móvil */
      body {
        padding-top: 0 !important;
        padding-bottom: 80px !important;
        overflow-x: hidden;
      }
      
      /* Ocultar footer en móvil */
      .footer,
      .footer-separator,
      footer,
      .mobile-hidden {
        display: none !important;
      }
      
      /* Mostrar elementos solo de móvil */
      .mobile-only {
        display: block !important;
      }
      
      /* Ajustes de contenido móvil */
      .mobile-content,
      .ion-page {
        padding-bottom: 80px !important;
        min-height: 100vh;
      }
    ` : `
      /* Ocultar MobileTabBar en desktop/tablet */
      .mobile-tab-bar,
      .mobile-only {
        display: none !important;
      }
      
      /* Mostrar elementos solo de desktop */
      .desktop-only {
        display: block !important;
      }
      
      /* Ajustar body para desktop */
      body {
        padding-bottom: 0 !important;
      }
    `}
  `;
};

// Exportar React para uso en hooks
import React from 'react';
