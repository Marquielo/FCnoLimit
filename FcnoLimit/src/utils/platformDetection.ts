/**
 * Utilidades para detectar la plataforma de ejecución
 * NO MODIFICA funcionalidad existente - solo agrega capacidades
 */

/**
 * Detecta si la app está corriendo en un dispositivo móvil nativo (Capacitor)
 */
export const isMobileApp = (): boolean => {
  try {
    return (window as any).Capacitor?.isNativePlatform?.() || false;
  } catch {
    return false;
  }
};

/**
 * Detecta si la app está corriendo en un navegador web
 */
export const isWebApp = (): boolean => {
  return !isMobileApp();
};

/**
 * Obtiene información de la plataforma para debugging
 */
export const getPlatformInfo = () => {
  const mobile = isMobileApp();
  return {
    isMobile: mobile,
    isWeb: !mobile,
    platform: mobile ? 'mobile' : 'web',
    capacitor: mobile ? (window as any).Capacitor : null,
    userAgent: navigator.userAgent
  };
};

/**
 * Logger específico para plataforma móvil
 * Solo hace log adicional en móvil, no interfiere con web
 */
export const mobileLog = (message: string, data?: any) => {
  if (isMobileApp()) {
    console.log(`📱 [MOBILE] ${message}`, data || '');
  }
};

/**
 * Logger específico para plataforma web
 * Solo hace log adicional en web, no interfiere con móvil
 */
export const webLog = (message: string, data?: any) => {
  if (isWebApp()) {
    console.log(`🌐 [WEB] ${message}`, data || '');
  }
};
