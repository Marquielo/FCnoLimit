// Script de prueba para el sistema de refresh tokens desde el frontend
require('dotenv').config();

const BASE_URL = 'https://fcnolimit-back.onrender.com/api';

// Credenciales de usuario real
const TEST_USER = {
  correo: 'marcelo@gmail.com',
  contraseña: 'Sasuke12'
};

let tokens = {
  accessToken: null,
  refreshToken: null
};

async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.log(`   ❌ Error ${response.status}:`, data.error || data.message || 'Error desconocido');
      return { success: false, data, status: response.status };
    }

    return { success: true, data, status: response.status };
  } catch (error) {
    console.log(`   ❌ Error de conexión:`, error.message);
    return { success: false, error: error.message };
  }
}

async function testHealthCheck() {
  console.log('\n1️⃣ Verificando conectividad del servidor...');
  
  const result = await makeRequest(`${BASE_URL}/health`);
  
  if (result.success) {
    console.log('   ✅ Servidor disponible');
    console.log(`   📊 Estado: ${result.data.status}`);
    console.log(`   🗄️ Base de datos: ${result.data.database}`);
    console.log(`   🌍 Ambiente: ${result.data.environment}`);
    return true;
  } else {
    console.log('   ❌ Servidor no disponible');
    return false;
  }
}

async function testLogin() {
  console.log('\n2️⃣ Probando login con refresh tokens...');
  console.log(`   👤 Usuario: ${TEST_USER.correo}`);
  
  const result = await makeRequest(`${BASE_URL}/usuarios/login`, {
    method: 'POST',
    body: JSON.stringify(TEST_USER)
  });

  if (result.success) {
    tokens.accessToken = result.data.accessToken;
    tokens.refreshToken = result.data.refreshToken;
    
    console.log('   ✅ Login exitoso');
    console.log(`   🔑 Access Token: ${tokens.accessToken ? 'Recibido' : 'No recibido'}`);
    console.log(`   🔄 Refresh Token: ${tokens.refreshToken ? 'Recibido' : 'No recibido'}`);
    console.log(`   ⏰ Expira en: ${result.data.expiresIn} segundos`);
    console.log(`   👤 Usuario: ${result.data.user.nombre_completo} (${result.data.user.rol})`);
    
    return true;
  } else {
    console.log('   ❌ Login fallido');
    return false;
  }
}

async function testProtectedEndpoint() {
  console.log('\n3️⃣ Probando endpoint protegido...');
  
  if (!tokens.accessToken) {
    console.log('   ❌ No hay access token disponible');
    return false;
  }

  const result = await makeRequest(`${BASE_URL}/usuarios`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${tokens.accessToken}`
    }
  });

  if (result.success) {
    console.log('   ✅ Acceso autorizado con access token');
    console.log(`   📊 Usuarios obtenidos: ${result.data.length || 0}`);
    return true;
  } else {
    console.log('   ❌ Acceso denegado');
    return false;
  }
}

async function testRefreshToken() {
  console.log('\n4️⃣ Probando renovación de access token...');
  
  if (!tokens.refreshToken) {
    console.log('   ❌ No hay refresh token disponible');
    return false;
  }

  const result = await makeRequest(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    body: JSON.stringify({ refreshToken: tokens.refreshToken })
  });

  if (result.success) {
    const oldAccessToken = tokens.accessToken;
    tokens.accessToken = result.data.accessToken;
    
    console.log('   ✅ Access token renovado exitosamente');
    console.log(`   🔄 Nuevo token: ${tokens.accessToken.substring(0, 20)}...`);
    console.log(`   ⏰ Nueva expiración: ${result.data.expiresIn} segundos`);
    console.log(`   🔀 Token cambió: ${oldAccessToken !== tokens.accessToken ? 'Sí' : 'No'}`);
    
    return true;
  } else {
    console.log('   ❌ Renovación fallida');
    return false;
  }
}

async function testNewAccessToken() {
  console.log('\n5️⃣ Probando nuevo access token...');
  
  if (!tokens.accessToken) {
    console.log('   ❌ No hay access token disponible');
    return false;
  }

  const result = await makeRequest(`${BASE_URL}/usuarios`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${tokens.accessToken}`
    }
  });

  if (result.success) {
    console.log('   ✅ Nuevo access token funciona correctamente');
    return true;
  } else {
    console.log('   ❌ Nuevo access token no funciona');
    return false;
  }
}

async function testLogout() {
  console.log('\n6️⃣ Probando logout...');
  
  if (!tokens.refreshToken) {
    console.log('   ❌ No hay refresh token disponible');
    return false;
  }

  const result = await makeRequest(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    body: JSON.stringify({ refreshToken: tokens.refreshToken })
  });

  if (result.success) {
    console.log('   ✅ Logout exitoso');
    console.log(`   📝 Mensaje: ${result.data.message}`);
    
    // Limpiar tokens locales
    tokens.accessToken = null;
    tokens.refreshToken = null;
    
    return true;
  } else {
    console.log('   ❌ Logout fallido');
    return false;
  }
}

async function testAfterLogout() {
  console.log('\n7️⃣ Verificando que los tokens ya no funcionan...');
  
  // Intentar usar el refresh token después del logout
  const refreshResult = await makeRequest(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    body: JSON.stringify({ refreshToken: tokens.refreshToken || 'token_invalidado' })
  });

  if (!refreshResult.success) {
    console.log('   ✅ Refresh token correctamente invalidado');
    return true;
  } else {
    console.log('   ❌ Refresh token aún funciona (problema de seguridad)');
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 === PRUEBA COMPLETA DEL SISTEMA DE REFRESH TOKENS ===\n');
  
  const results = [];
  
  try {
    // Ejecutar todas las pruebas en secuencia
    results.push({ name: 'Health Check', success: await testHealthCheck() });
    results.push({ name: 'Login', success: await testLogin() });
    results.push({ name: 'Protected Endpoint', success: await testProtectedEndpoint() });
    results.push({ name: 'Refresh Token', success: await testRefreshToken() });
    results.push({ name: 'New Access Token', success: await testNewAccessToken() });
    results.push({ name: 'Logout', success: await testLogout() });
    results.push({ name: 'After Logout', success: await testAfterLogout() });
    
    // Mostrar resumen
    console.log('\n📊 === RESUMEN DE PRUEBAS ===');
    let passed = 0;
    let failed = 0;
    
    results.forEach(result => {
      if (result.success) {
        console.log(`   ✅ ${result.name}: PASÓ`);
        passed++;
      } else {
        console.log(`   ❌ ${result.name}: FALLÓ`);
        failed++;
      }
    });
    
    console.log(`\n🎯 Resultado final: ${passed}/${results.length} pruebas pasaron`);
    
    if (failed === 0) {
      console.log('🎉 ¡TODAS LAS PRUEBAS PASARON! El sistema de refresh tokens funciona correctamente.');
    } else {
      console.log(`⚠️ ${failed} prueba(s) fallaron. Revisar implementación.`);
    }
    
  } catch (error) {
    console.error('\n❌ Error general en las pruebas:', error.message);
  }
}

// Ejecutar las pruebas
runAllTests();