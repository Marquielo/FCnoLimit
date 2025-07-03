import { useState, useEffect } from 'react';

// Tipos
export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type OrientationType = 'portrait' | 'landscape';
export interface ResponsiveStyles {
  [key: string]: any;
}
export interface ResponsiveClasses {
  [key: string]: string | undefined;
}
export interface ResponsiveValues<T> {
  [key: string]: T | undefined;
}

/**
 * Hook para detectar si el dispositivo es móvil basado en el ancho de pantalla
 * @param breakpoint - Punto de quiebre en píxeles. Por defecto 768px
 * @returns - True si es móvil, false si no
 */
export const useIsMobile = (breakpoint = 768): boolean => {
  // SSR check
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth <= breakpoint : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = (): void => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    // Detectar cambios en el tamaño de la ventana
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
};

/**
 * Hook para detectar si el dispositivo es una tablet basado en el ancho de pantalla
 * @returns - True si es tablet, false si no
 */
export const useIsTablet = (): boolean => {
  // SSR check
  const [isTablet, setIsTablet] = useState<boolean>(
    typeof window !== 'undefined' 
      ? window.innerWidth > 768 && window.innerWidth <= 1024 
      : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = (): void => {
      setIsTablet(window.innerWidth > 768 && window.innerWidth <= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isTablet;
};

/**
 * Hook para obtener el dispositivo actual (móvil, tablet, desktop)
 * @returns - 'mobile', 'tablet' o 'desktop'
 */
export const useDeviceType = (): DeviceType => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  
  return isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
};

/**
 * Hook para obtener la orientación del dispositivo
 * @returns - 'portrait' o 'landscape'
 */
export const useOrientation = (): OrientationType => {
  // SSR check
  const [orientation, setOrientation] = useState<OrientationType>(
    typeof window !== 'undefined' 
      ? window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      : 'portrait'
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = (): void => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return orientation;
};

/**
 * Función para aplicar estilos condicionales según el dispositivo
 * @param styles - Objeto con estilos por dispositivo
 * @param deviceType - Tipo de dispositivo ('mobile', 'tablet', 'desktop')
 * @returns - Estilos para el dispositivo actual
 */
export const getResponsiveStyles = (styles: ResponsiveStyles, deviceType: DeviceType = 'desktop'): any => {
  const defaultStyles = styles.default || {};
  const deviceStyles = styles[deviceType] || {};
  
  return { ...defaultStyles, ...deviceStyles };
};

/**
 * Función para aplicar clases condicionales según el dispositivo
 * @param baseClasses - Clases base que siempre se aplican
 * @param deviceClasses - Objeto con clases por dispositivo
 * @param deviceType - Tipo de dispositivo ('mobile', 'tablet', 'desktop')
 * @returns - Clases combinadas para el dispositivo actual
 */
export const getResponsiveClasses = (
  baseClasses: string = '',
  deviceClasses: ResponsiveClasses = {},
  deviceType: DeviceType = 'desktop'
): string => {
  const deviceSpecificClasses = deviceClasses[deviceType] || '';
  return `${baseClasses} ${deviceSpecificClasses}`.trim();
};

/**
 * Hook que devuelve datos específicos según el dispositivo
 * @param options - Objeto con opciones por dispositivo
 * @returns - Datos para el dispositivo actual
 */
export const useResponsiveValue = <T>(options: ResponsiveValues<T>): T | null => {
  const deviceType = useDeviceType();
  return options[deviceType] || options.default || null;
};

/**
 * Constantes para breakpoints (útil para styled-components o emotion)
 */
export const BREAKPOINTS = {
  xs: '480px',
  sm: '768px',
  md: '1024px',
  lg: '1280px',
  xl: '1440px'
};

/**
 * Media queries para uso con styled-components
 */
export const MEDIA_QUERIES = {
  xs: `@media (max-width: ${BREAKPOINTS.xs})`,
  sm: `@media (max-width: ${BREAKPOINTS.sm})`,
  md: `@media (max-width: ${BREAKPOINTS.md})`,
  lg: `@media (max-width: ${BREAKPOINTS.lg})`,
  xl: `@media (max-width: ${BREAKPOINTS.xl})`,
  mobile: `@media (max-width: ${BREAKPOINTS.sm})`,
  tablet: `@media (min-width: ${BREAKPOINTS.sm}) and (max-width: ${BREAKPOINTS.md})`,
  desktop: `@media (min-width: ${BREAKPOINTS.md})`,
};
