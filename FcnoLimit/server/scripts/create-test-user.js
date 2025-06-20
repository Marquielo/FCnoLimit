// Script para crear un usuario de prueba específico para refresh tokens
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

async function createTestUser() {
  console.log('👤 === CREAR USUARIO DE PRUEBA PARA REFRESH TOKENS ===\n');

  // Generar datos únicos para el usuario de prueba
  const timestamp = Date.now();
  const testUser = {
    nombre_completo: `Usuario Test Refresh ${timestamp}`,
    correo: `test.refresh.${timestamp}@fcnolimit.test`,
    contraseña: 'TestRefresh123!',
    rol: 'persona_natural'
  };

  console.log('1️⃣ Creando nuevo usuario de prueba...');
  console.log(`   📧 Email: ${testUser.correo}`);
  console.log(`   👤 Nombre: ${testUser.nombre_completo}`);
  console.log(`   🔒 Contraseña: ${testUser.contraseña}`);
  console.log(`   👥 Rol: ${testUser.rol}`);

  // Intentar crear el usuario
  const createResult = await makeRequest(`${BASE_URL}/usuarios/register`, {
    method: 'POST',
    body: JSON.stringify(testUser)
  });

  if (!createResult.success) {
    console.log('   ❌ Error al crear usuario:');
    console.log(`      Status: ${createResult.status}`);
    console.log(`      Error: ${createResult.data?.error || createResult.error}`);
    return null;
  }

  console.log('   ✅ Usuario creado exitosamente');
  console.log(`   🆔 ID: ${createResult.data.user?.id || 'No disponible'}`);

  // Esperar un momento para que se complete la creación
  console.log('\n2️⃣ Esperando 2 segundos...');
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Probar login inmediatamente
  console.log('\n3️⃣ Probando login con el nuevo usuario...');
  
  const loginCredentials = {
    correo: testUser.correo,
    contraseña: testUser.contraseña
  };

  const loginResult = await makeRequest(`${BASE_URL}/usuarios/login`, {
    method: 'POST',
    body: JSON.stringify(loginCredentials)
  });

  if (loginResult.success) {
    console.log('   ✅ Login exitoso');
    console.log('   📊 Tokens recibidos:');
    console.log(`      Access Token: ${loginResult.data.accessToken ? 'Presente' : 'Ausente'}`);
    console.log(`      Refresh Token: ${loginResult.data.refreshToken ? 'Presente' : 'Ausente'}`);
    console.log(`      Expira en: ${loginResult.data.expiresIn || 'No especificado'} segundos`);
    console.log(`      Usuario: ${loginResult.data.user?.nombre_completo} (${loginResult.data.user?.rol})`);
    
    return {
      credentials: loginCredentials,
      user: loginResult.data.user,
      tokens: {
        accessToken: loginResult.data.accessToken,
        refreshToken: loginResult.data.refreshToken,
        expiresIn: loginResult.data.expiresIn
      }
    };
  } else {
    console.log('   ❌ Error en login:');
    console.log(`      Status: ${loginResult.status}`);
    console.log(`      Error: ${loginResult.data?.error || loginResult.error}`);
    return null;
  }
}

async function testWithNewUser() {
  const userInfo = await createTestUser();
  
  if (!userInfo) {
    console.log('\n❌ No se pudo crear/verificar el usuario de prueba');
    return;
  }

  console.log('\n🎉 === USUARIO DE PRUEBA LISTO ===');
  console.log('\n📋 Para usar en las pruebas:');
  console.log(`const TEST_USER = {`);
  console.log(`  correo: '${userInfo.credentials.correo}',`);
  console.log(`  contraseña: '${userInfo.credentials.contraseña}'`);
  console.log(`};`);

  console.log('\n🚀 Ejecuta ahora:');
  console.log('node scripts/test-frontend-refresh.js');
  console.log('\n(Pero primero actualiza el script con las credenciales de arriba)');
}

// Ejecutar creación
testWithNewUser().catch(console.error);
