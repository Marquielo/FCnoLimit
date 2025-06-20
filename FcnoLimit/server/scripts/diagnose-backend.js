// Script de diagnóstico para verificar el estado del backend
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
    
    return { success: response.ok, data, status: response.status, response };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function diagnose() {
  console.log('🔍 === DIAGNÓSTICO DEL BACKEND ===\n');

  // 1. Health check general
  console.log('1️⃣ Health check general...');
  const health = await makeRequest(`${BASE_URL}/health`);
  console.log(`   Status: ${health.status}`);
  if (health.success) {
    console.log('   ✅ Servidor saludable');
    console.log(`   📊 Estado: ${health.data.status}`);
    console.log(`   🗄️ BD: ${health.data.database}`);
  } else {
    console.log('   ❌ Problema en el servidor');
    console.log(`   Error: ${health.data?.error || health.error}`);
  }

  // 2. Health check de auth
  console.log('\n2️⃣ Health check del sistema de auth...');
  const authHealth = await makeRequest(`${BASE_URL}/auth/health`);
  console.log(`   Status: ${authHealth.status}`);
  if (authHealth.success) {
    console.log('   ✅ Sistema de auth saludable');
    console.log(`   🔄 Refresh tokens en BD: ${authHealth.data.total_refresh_tokens}`);
  } else {
    console.log('   ❌ Problema en el sistema de auth');
    console.log(`   Error: ${authHealth.data?.error || authHealth.error}`);
  }

  // 3. Test de endpoints básicos
  console.log('\n3️⃣ Verificando endpoints...');
  
  const endpoints = [
    { name: 'Ping', url: `${BASE_URL}/ping` },
    { name: 'DB Test', url: `${BASE_URL}/dbtest` },
    { name: 'Usuarios (sin auth)', url: `${BASE_URL}/usuarios` }
  ];

  for (const endpoint of endpoints) {
    const result = await makeRequest(endpoint.url);
    if (result.success) {
      console.log(`   ✅ ${endpoint.name}: OK (${result.status})`);
    } else {
      console.log(`   ❌ ${endpoint.name}: FALLO (${result.status})`);
      if (result.data?.error) {
        console.log(`      Error: ${result.data.error}`);
      }
    }
  }

  // 4. Test de login específico con logging detallado
  console.log('\n4️⃣ Test de login detallado...');
  console.log('   Probando credenciales: marcelo@gmail.com');
  
  const loginResult = await makeRequest(`${BASE_URL}/usuarios/login`, {
    method: 'POST',
    body: JSON.stringify({
      correo: 'marcelo@gmail.com',
      contraseña: 'Sasuke12'
    })
  });

  console.log(`   Status HTTP: ${loginResult.status}`);
  
  if (loginResult.success) {
    console.log('   ✅ Login exitoso');
    console.log('   Respuesta recibida:', Object.keys(loginResult.data));
    
    // Verificar qué tipo de tokens se recibieron
    if (loginResult.data.accessToken && loginResult.data.refreshToken) {
      console.log('   🔑 Sistema NUEVO: accessToken + refreshToken');
    } else if (loginResult.data.token) {
      console.log('   🔒 Sistema LEGACY: token único');
    } else {
      console.log('   ⚠️ Respuesta inesperada: no se encontraron tokens');
    }
  } else {
    console.log('   ❌ Login fallido');
    console.log('   Error completo:', loginResult.data);
    
    // Información adicional para debugging
    if (loginResult.status === 500) {
      console.log('   🚨 Error 500: Problema interno del servidor');
      console.log('   💡 Posibles causas:');
      console.log('      - Error en authController.js');
      console.log('      - Problema con base de datos');
      console.log('      - Función no exportada correctamente');
    }
  }

  // 5. Verificar que las rutas estén registradas
  console.log('\n5️⃣ Verificando rutas registradas...');
  
  const routeTests = [
    { name: 'Auth Refresh', url: `${BASE_URL}/auth/refresh`, method: 'POST' },
    { name: 'Auth Health', url: `${BASE_URL}/auth/health`, method: 'GET' }
  ];

  for (const route of routeTests) {
    const result = await makeRequest(route.url, { 
      method: route.method,
      body: route.method === 'POST' ? JSON.stringify({}) : undefined
    });
    
    if (result.status === 404) {
      console.log(`   ❌ ${route.name}: Ruta no encontrada (404)`);
    } else if (result.status >= 400 && result.status < 500) {
      console.log(`   ✅ ${route.name}: Ruta existe (${result.status} - error esperado)`);
    } else {
      console.log(`   ✅ ${route.name}: Ruta funcional (${result.status})`);
    }
  }

  console.log('\n📋 === FIN DEL DIAGNÓSTICO ===');
}

// Ejecutar diagnóstico
diagnose().catch(console.error);
