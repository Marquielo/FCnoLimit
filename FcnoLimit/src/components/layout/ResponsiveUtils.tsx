import React from 'react';
import '../../styles/responsive.css';
import ResponsiveWrapper from './ResponsiveWrapper';
import { useIsMobile, useIsTablet, useDeviceType, DeviceType } from '../../hooks/useResponsive';

/**
 * Props para el componente ResponsiveProvider
 */
interface ResponsiveProviderProps {
  children: React.ReactNode;
}

/**
 * Props para el HOC withResponsive
 */
interface WithResponsiveOptions {
  mobileClassName?: string;
  tabletClassName?: string;
  desktopClassName?: string;
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  hideOnDesktop?: boolean;
  showOnlyOnMobile?: boolean;
  showOnlyOnTablet?: boolean;
  showOnlyOnDesktop?: boolean;
  enableMobileLayout?: boolean;
}

/**
 * Props para el componente ResponsiveText
 */
interface ResponsiveTextProps {
  children: React.ReactNode;
  mobile?: React.ReactNode;
  tablet?: React.ReactNode;
  desktop?: React.ReactNode;
  [key: string]: any;
}

/**
 * Componente que debe incluirse una vez en la aplicación para habilitar
 * todas las utilidades de responsividad globales
 */
export const ResponsiveProvider: React.FC<ResponsiveProviderProps> = ({ children }) => {
  return (
    <>
      {/* Este componente simplemente importa los estilos CSS y renderiza los hijos */}
      {children}
    </>
  );
};

/**
 * HOC (High Order Component) que envuelve cualquier componente con ResponsiveWrapper
 * para simplificar la aplicación de estilos responsivos
 */
export const withResponsive = <P extends {}>(
  Component: React.ComponentType<P>, 
  options: WithResponsiveOptions = {}
): React.FC<P> => {
  const {
    mobileClassName = '',
    tabletClassName = '',
    desktopClassName = '',
    hideOnMobile = false,
    hideOnTablet = false,
    hideOnDesktop = false,
    showOnlyOnMobile = false,
    showOnlyOnTablet = false,
    showOnlyOnDesktop = false,
    enableMobileLayout = false
  } = options;

  return function WithResponsiveComponent(props: P) {
    return (
      <ResponsiveWrapper
        mobileClassName={mobileClassName}
        tabletClassName={tabletClassName}
        desktopClassName={desktopClassName}
        hideOnMobile={hideOnMobile}
        hideOnTablet={hideOnTablet}
        hideOnDesktop={hideOnDesktop}
        showOnlyOnMobile={showOnlyOnMobile}
        showOnlyOnTablet={showOnlyOnTablet}
        showOnlyOnDesktop={showOnlyOnDesktop}
        enableMobileLayout={enableMobileLayout}
        as="div"
      >
        <Component {...props} />
      </ResponsiveWrapper>
    );
  };
};

/**
 * Componente de texto que se adapta según el dispositivo
 */
export const ResponsiveText: React.FC<ResponsiveTextProps> = ({ 
  children, 
  mobile, 
  tablet, 
  desktop,
  ...props 
}) => {
  const deviceType = useDeviceType();
  
  let content;
  switch (deviceType) {
    case 'mobile':
      content = mobile !== undefined ? mobile : children;
      break;
    case 'tablet':
      content = tablet !== undefined ? tablet : children;
      break;
    case 'desktop':
      content = desktop !== undefined ? desktop : children;
      break;
    default:
      content = children;
  }
  
  return <span {...props}>{content}</span>;
};

/**
 * Re-exporta los hooks de responsividad para usarlos en componentes
 */
export { useIsMobile, useIsTablet, useDeviceType };
