// Script para comparar entorno local vs remoto
require('dotenv').config();

const BASE_URL = 'https://fcnolimit-back.onrender.com/api';

async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    let data;
    try {
      data = await response.json();
    } catch {
      data = { error: 'Respuesta no es JSON válido' };
    }
    
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function compareEnvironments() {
  console.log('🔍 === COMPARACIÓN DE ENTORNOS ===\n');

  // 1. Verificar que las rutas auth existen en producción
  console.log('1️⃣ Verificando rutas de auth en producción...');
  
  const authRoutes = [
    { name: 'Auth Health', url: `${BASE_URL}/auth/health` },
    { name: 'Auth Refresh', url: `${BASE_URL}/auth/refresh`, method: 'POST' },
    { name: 'Auth Logout', url: `${BASE_URL}/auth/logout`, method: 'POST' }
  ];

  for (const route of authRoutes) {
    const result = await makeRequest(route.url, { 
      method: route.method || 'GET',
      body: route.method === 'POST' ? JSON.stringify({}) : undefined
    });
    
    if (result.status === 404) {
      console.log(`   ❌ ${route.name}: RUTA NO EXISTE (404)`);
    } else if (result.status >= 400 && result.status < 500) {
      console.log(`   ✅ ${route.name}: Ruta existe (${result.status})`);
    } else {
      console.log(`   ✅ ${route.name}: Funcionando (${result.status})`);
    }
  }

  // 2. Verificar tabla refresh_tokens en producción
  console.log('\n2️⃣ Verificando tabla refresh_tokens en producción...');
  
  const dbTestResult = await makeRequest(`${BASE_URL}/dbtest`);
  if (dbTestResult.success) {
    console.log('   ✅ Conexión a BD exitosa');
    console.log(`   🗄️ Host: ${dbTestResult.data.host}`);
    console.log(`   📊 Conexiones: ${dbTestResult.data.total_connections}`);
  } else {
    console.log('   ❌ Error en conexión a BD');
  }

  // 3. Test específico de auth health
  const authHealthResult = await makeRequest(`${BASE_URL}/auth/health`);
  if (authHealthResult.success) {
    console.log('   ✅ Auth system healthy');
    console.log(`   🔄 Refresh tokens en BD: ${authHealthResult.data.total_refresh_tokens}`);
  } else {
    console.log('   ❌ Auth system problema');
    console.log(`   Error: ${authHealthResult.data?.error}`);
  }

  // 4. Test específico de login con más detalle
  console.log('\n3️⃣ Test de login con logging detallado...');
  
  const detailedLogin = await makeRequest(`${BASE_URL}/usuarios/login`, {
    method: 'POST',
    body: JSON.stringify({
      correo: 'marcelo@gmail.com',
      contraseña: 'Sasuke12'
    })
  });

  console.log(`   📡 Status HTTP: ${detailedLogin.status}`);
  console.log(`   📦 Headers: ${JSON.stringify(detailedLogin.data)}`);
  
  if (!detailedLogin.success) {
    console.log('   ❌ Login falló en producción');
    console.log('   🔍 Detalles del error:', detailedLogin.data);
    
    // Análisis del error
    if (detailedLogin.data?.code === 'INTERNAL_ERROR') {
      console.log('\n   💡 Error interno del servidor - posibles causas:');
      console.log('      1. Función loginUser no exportada correctamente');
      console.log('      2. Error en storeRefreshToken');
      console.log('      3. Problema con JWT functions');
      console.log('      4. Variables de entorno diferentes');
    }
  } else {
    console.log('   ✅ Login exitoso en producción');
  }

  // 5. Comparar variables críticas
  console.log('\n4️⃣ Verificando variables críticas...');
  
  console.log('   Local:');
  console.log(`      JWT_SECRET: ${process.env.JWT_SECRET ? 'Presente' : 'Ausente'}`);
  console.log(`      JWT_REFRESH_SECRET: ${process.env.JWT_REFRESH_SECRET ? 'Presente' : 'Ausente'}`);
  console.log(`      DATABASE_URL: ${process.env.DATABASE_URL ? 'Presente' : 'Ausente'}`);

  // 6. Test de funciones críticas localmente
  console.log('\n5️⃣ Verificando funciones críticas localmente...');
  
  try {
    const { signAccessToken, signRefreshToken } = require('../utils/jwt');
    const testAccessToken = signAccessToken({ id: 1, rol: 'test' });
    const testRefreshToken = signRefreshToken({ id: 1 });
    
    console.log(`   ✅ signAccessToken: ${testAccessToken ? 'Funciona' : 'Falla'}`);
    console.log(`   ✅ signRefreshToken: ${testRefreshToken ? 'Funciona' : 'Falla'}`);
  } catch (error) {
    console.log(`   ❌ Error en funciones JWT: ${error.message}`);
  }

  try {
    const { storeRefreshToken } = require('../utils/refreshTokens');
    console.log('   ✅ storeRefreshToken: Importada correctamente');
  } catch (error) {
    console.log(`   ❌ Error importando storeRefreshToken: ${error.message}`);
  }

  console.log('\n📋 === FIN DE LA COMPARACIÓN ===');
}

// Ejecutar comparación
compareEnvironments().catch(console.error);
