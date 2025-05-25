export const CacheService = {
  clearAllCache: () => {
    // Limpiar localStorage
    localStorage.clear();
    
    // Limpiar sessionStorage
    sessionStorage.clear();
    
    // Limpiar caché de service workers si existen
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
  }
};