export const clearPageCache = async () => {
  try {
    // Limpiar caché de navegación
    if ('caches' in window) {
      const names = await caches.keys();
      await Promise.all(names.map(name => caches.delete(name)));
    }

    // Limpiar sessionStorage
    sessionStorage.clear();

    // Forzar recarga de recursos
    const images = document.getElementsByTagName('img');
    for (let i = 0; i < images.length; i++) {
      const src = images[i].src;
      images[i].src = '';
      images[i].src = src;
    }

    console.log('✨ Caché limpiado exitosamente');
  } catch (error) {
    console.error('❌ Error al limpiar caché:', error);
  }
};