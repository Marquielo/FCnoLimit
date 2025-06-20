// Script específico para debuggear el error de storeRefreshToken
require('dotenv').config();

const BASE_URL = 'https://fcnolimit-back.onrender.com/api';

async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Debug-Test/1.0',
        ...options.headers
      },
      ...options
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { rawResponse: text };
    }
    
    return { success: response.ok, data, status: response.status, headers: response.headers };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function testSpecificError() {
  console.log('🔍 === DEBUG ESPECÍFICO DEL ERROR 500 ===\n');

  const testUser = {
    correo: 'test.refresh.1750426854940@fcnolimit.test',
    contraseña: 'TestRefresh123!'
  };

  console.log('1️⃣ Verificando estado actual del usuario...');
  
  // Intentar login con contraseña incorrecta para confirmar que el usuario existe
  const wrongPasswordTest = await makeRequest(`${BASE_URL}/usuarios/login`, {
    method: 'POST',
    body: JSON.stringify({
      correo: testUser.correo,
      contraseña: 'contraseña_incorrecta'
    })
  });

  console.log(`   Status: ${wrongPasswordTest.status}`);
  if (wrongPasswordTest.status === 401) {
    console.log('   ✅ Usuario existe (error 401 con contraseña incorrecta)');
  } else {
    console.log('   ❌ Usuario no existe o hay otro problema');
    console.log(`   Respuesta: ${JSON.stringify(wrongPasswordTest.data)}`);
    return;
  }

  console.log('\n2️⃣ Intentando login con credenciales correctas...');
  
  const loginResult = await makeRequest(`${BASE_URL}/usuarios/login`, {
    method: 'POST',
    body: JSON.stringify(testUser)
  });

  console.log(`   Status: ${loginResult.status}`);
  console.log(`   Respuesta: ${JSON.stringify(loginResult.data, null, 2)}`);

  if (loginResult.status === 500) {
    console.log('\n🚨 ERROR 500 CONFIRMADO');
    console.log('\n📊 Análisis del problema:');
    console.log('   ❌ El usuario existe pero el login falla');
    console.log('   ❌ Problema específico en el backend con refresh tokens');
    console.log('   ❌ Posibles causas:');
    console.log('      1. Error en storeRefreshToken()');
    console.log('      2. Problema con la constraint unique_user_device');
    console.log('      3. Error en la lógica de UPSERT');
    console.log('      4. Problema con JWT token generation');
    console.log('      5. Error de base de datos en la inserción');

    console.log('\n💡 Recomendaciones:');
    console.log('   1. Revisar logs del servidor en Render');
    console.log('   2. Simplificar la lógica de storeRefreshToken');
    console.log('   3. Verificar que todas las funciones JWT estén funcionando');
    console.log('   4. Probar con un usuario completamente nuevo');
  }

  console.log('\n📋 === FIN DEL DEBUG ===');
}

// Ejecutar debug
testSpecificError().catch(console.error);
