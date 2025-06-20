// Script para debuggear por qué funciona en create-test-user pero no en test-frontend-refresh
require('dotenv').config();

const BASE_URL = 'https://fcnolimit-back.onrender.com/api';

const TEST_USER = {
  correo: 'test.refresh.1750397295395@fcnolimit.test',
  contraseña: 'TestRefresh123!'
};

async function makeRequest(url, options = {}) {
  try {
    console.log(`🔗 Haciendo request a: ${url}`);
    console.log(`📦 Método: ${options.method || 'GET'}`);
    console.log(`📝 Body: ${options.body || 'Sin body'}`);
    console.log(`🔧 Headers: ${JSON.stringify(options.headers || {})}`);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    console.log(`📡 Response status: ${response.status}`);
    console.log(`📋 Response headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}`);
    
    let data;
    try {
      const text = await response.text();
      console.log(`📄 Response text: ${text.substring(0, 500)}...`);
      data = JSON.parse(text);
    } catch (parseError) {
      console.log(`❌ Error parsing JSON: ${parseError.message}`);
      data = { error: 'Respuesta no es JSON válido' };
    }
    
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    console.log(`❌ Error de conexión: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function debugLogin() {
  console.log('🔍 === DEBUG DETALLADO DEL LOGIN ===\n');

  console.log('📋 Datos del usuario de prueba:');
  console.log(`   Email: ${TEST_USER.correo}`);
  console.log(`   Password: ${TEST_USER.contraseña}`);
  console.log(`   Password length: ${TEST_USER.contraseña.length}`);
  console.log(`   Email length: ${TEST_USER.correo.length}`);

  console.log('\n1️⃣ Intentando login paso a paso...');
  
  const result = await makeRequest(`${BASE_URL}/usuarios/login`, {
    method: 'POST',
    body: JSON.stringify(TEST_USER)
  });

  console.log('\n📊 Resultado final:');
  console.log(`   Success: ${result.success}`);
  console.log(`   Status: ${result.status}`);
  console.log(`   Data: ${JSON.stringify(result.data, null, 2)}`);

  if (!result.success) {
    console.log('\n🔍 Análisis del error:');
    
    // Verificar si el usuario aún existe
    console.log('\n2️⃣ Verificando si el usuario aún existe...');
    
    // Como no tenemos endpoint para verificar directamente, intentemos con credenciales incorrectas
    const wrongPasswordTest = await makeRequest(`${BASE_URL}/usuarios/login`, {
      method: 'POST',
      body: JSON.stringify({
        correo: TEST_USER.correo,
        contraseña: 'contraseña_incorrecta'
      })
    });
    
    console.log(`   Test con contraseña incorrecta - Status: ${wrongPasswordTest.status}`);
    console.log(`   Error: ${wrongPasswordTest.data?.error}`);
    
    if (wrongPasswordTest.status === 401) {
      console.log('   ✅ El usuario existe (error 401 con contraseña incorrecta)');
    } else if (wrongPasswordTest.status === 500) {
      console.log('   ❌ Error 500 también con contraseña incorrecta - problema del servidor');
    }

    // Verificar headers
    console.log('\n3️⃣ Verificando headers de la request...');
    const testHeaders = await makeRequest(`${BASE_URL}/usuarios/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Test-Debug-Script/1.0'
      },
      body: JSON.stringify(TEST_USER)
    });
    
    console.log(`   Test con headers específicos - Status: ${testHeaders.status}`);
  }

  console.log('\n📋 === FIN DEL DEBUG ===');
}

// Ejecutar debug
debugLogin().catch(console.error);
