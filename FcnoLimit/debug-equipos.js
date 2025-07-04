// Script para debuggear el endpoint de equipos
const apiBaseUrl = 'https://fcnolimit-back.onrender.com';

async function checkEquipos() {
  try {
    console.log('Consultando endpoint:', `${apiBaseUrl}/api/equipos`);
    
    const response = await fetch(`${apiBaseUrl}/api/equipos`);
    console.log('Status:', response.status);
    console.log('OK:', response.ok);
    
    if (!response.ok) {
      console.error('Error en la respuesta:', response.statusText);
      return;
    }
    
    const equipos = await response.json();
    console.log('Cantidad de equipos:', equipos.length);
    console.log('Primeros 3 equipos:');
    
    equipos.slice(0, 3).forEach((equipo, index) => {
      console.log(`\n--- Equipo ${index + 1} ---`);
      console.log('ID:', equipo.id);
      console.log('Nombre:', equipo.nombre);
      console.log('imagen_url:', equipo.imagen_url);
      console.log('Categoría:', equipo.categoria);
      console.log('Liga ID:', equipo.liga_id);
      
      // Verificar si la imagen_url está disponible
      if (equipo.imagen_url) {
        console.log('✅ Tiene imagen_url');
        // Intentar verificar si la URL es accesible
        if (equipo.imagen_url.startsWith('http')) {
          console.log('🌐 URL completa');
        } else {
          console.log('📁 URL relativa');
        }
      } else {
        console.log('❌ NO tiene imagen_url');
      }
    });
    
  } catch (error) {
    console.error('Error al consultar equipos:', error);
  }
}

// Ejecutar si estamos en Node.js
if (typeof window === 'undefined') {
  checkEquipos();
} else {
  // Ejecutar si estamos en el navegador
  window.checkEquipos = checkEquipos;
}
