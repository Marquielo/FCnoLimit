import React from 'react';
import { useIsMobile, useIsTablet, useDeviceType, DeviceType } from '../../hooks/useResponsive';

interface ResponsiveWrapperProps {
  children: React.ReactNode;
  className?: string;
  mobileClassName?: string;
  tabletClassName?: string;
  desktopClassName?: string;
  style?: React.CSSProperties;
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  hideOnDesktop?: boolean;
  showOnlyOnMobile?: boolean;
  showOnlyOnTablet?: boolean;
  showOnlyOnDesktop?: boolean;
  as?: React.ElementType;
  enableMobileLayout?: boolean;
  [key: string]: any;
}

/**
 * Componente envoltorio que aplica clases responsivas automáticamente
 */
const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({
  children,
  className = '',
  mobileClassName = '',
  tabletClassName = '',
  desktopClassName = '',
  style = {},
  hideOnMobile = false,
  hideOnTablet = false,
  hideOnDesktop = false,
  showOnlyOnMobile = false,
  showOnlyOnTablet = false,
  showOnlyOnDesktop = false,
  as: Component = 'div',
  enableMobileLayout = false,
  ...props
}) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const deviceType = useDeviceType();
  
  // Si debe ocultarse en el dispositivo actual
  if (
    (hideOnMobile && isMobile) ||
    (hideOnTablet && isTablet) ||
    (hideOnDesktop && !isMobile && !isTablet) ||
    (showOnlyOnMobile && !isMobile) ||
    (showOnlyOnTablet && !isTablet) ||
    (showOnlyOnDesktop && (isMobile || isTablet))
  ) {
    return null;
  }
  
  // Determinar las clases según el dispositivo
  const responsiveClasses = [
    className,
    isMobile ? mobileClassName : '',
    isTablet ? tabletClassName : '',
    (!isMobile && !isTablet) ? desktopClassName : '',
    isMobile && enableMobileLayout ? 'mobile-layout' : ''
  ].filter(Boolean).join(' ');
  
  // Aplicar clase de visibilidad por dispositivo
  const visibilityClass = 
    showOnlyOnMobile ? 'mobile-only' :
    showOnlyOnTablet ? 'tablet-only' : 
    showOnlyOnDesktop ? 'desktop-only' : '';
    
  const allClasses = [responsiveClasses, visibilityClass].filter(Boolean).join(' ');
  
  return (
    <Component className={allClasses} style={style} {...props}>
      {children}
    </Component>
  );
};

export default ResponsiveWrapper;
