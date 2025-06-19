#!/usr/bin/env node

const axios = require('axios');

const API_BASE = 'https://fcnolimit-back.onrender.com/api';

// Configurar axios para manejar errores mejor
axios.defaults.timeout = 10000;

async function testCompleteAuthFlow() {
  console.log('🧪 === PRUEBA COMPLETA DEL FLUJO DE AUTENTICACIÓN ===\n');

  try {
    // 1. Health Check
    console.log('1️⃣ Verificando conectividad del servidor...');
    try {
      const healthResponse = await axios.get(`${API_BASE}/health`);
      console.log(`   ✅ Servidor activo: ${healthResponse.data.status}`);
      console.log(`   🗄️ Base de datos: ${healthResponse.data.database}`);
      console.log(`   🌍 Entorno: ${healthResponse.data.environment}\n`);
    } catch (error) {
      console.log('   ❌ Error en health check:', error.message);
      return;
    }

    // 2. Crear usuario de prueba
    console.log('2️⃣ Creando usuario de prueba...');
    const testUser = {
      nombre_completo: 'Usuario Prueba Refresh Tokens',
      correo: `test-refresh-${Date.now()}@fcnolimit.test`,
      contraseña: 'TestPassword123!',
      rol: 'persona_natural'
    };

    let registerResponse;
    try {
      registerResponse = await axios.post(`${API_BASE}/usuarios/register`, testUser);
      console.log('   ✅ Usuario de prueba creado exitosamente');
      console.log(`   👤 Email: ${testUser.correo}`);
      console.log(`   🔑 Contraseña: ${testUser.contraseña}\n`);
    } catch (error) {
      if (error.response?.data?.error?.includes('duplicate') || 
          error.response?.data?.error?.includes('ya existe')) {
        console.log('   ⚠️ Usuario ya existe, continuando con login...\n');
      } else {
        console.log('   ❌ Error creando usuario:', error.response?.data?.error || error.message);
        return;
      }
    }

    // 3. Probar Login con Refresh Tokens
    console.log('3️⃣ Probando login con sistema de refresh tokens...');
    try {
      const loginResponse = await axios.post(`${API_BASE}/usuarios/login`, {
        correo: testUser.correo,
        contraseña: testUser.contraseña
      });

      const loginData = loginResponse.data;
      console.log('   ✅ Login exitoso!');

      // Verificar si tenemos tokens modernos o legacy
      if (loginData.accessToken && loginData.refreshToken) {
        console.log('   🔒 Sistema moderno detectado - Refresh Tokens');
        console.log(`   🎫 Access Token: ${loginData.accessToken.substring(0, 20)}...`);
        console.log(`   🔄 Refresh Token: ${loginData.refreshToken.substring(0, 20)}...`);
        console.log(`   ⏰ Expira en: ${loginData.expiresIn} segundos (${Math.round(loginData.expiresIn/60)} minutos)`);
        console.log(`   👤 Usuario: ${loginData.user.nombre_completo} (${loginData.user.rol})\n`);

        // 4. Probar refresh de token
        console.log('4️⃣ Probando renovación de access token...');
        try {
          const refreshResponse = await axios.post(`${API_BASE}/auth/refresh`, {
            refreshToken: loginData.refreshToken
          });

          console.log('   ✅ Token renovado exitosamente!');
          console.log(`   🎫 Nuevo Access Token: ${refreshResponse.data.accessToken.substring(0, 20)}...`);
          console.log(`   ⏰ Nueva expiración: ${refreshResponse.data.expiresIn} segundos\n`);

          // 5. Probar endpoint protegido
          console.log('5️⃣ Probando endpoint protegido con nuevo token...');
          try {
            const protectedResponse = await axios.get(`${API_BASE}/usuarios`, {
              headers: {
                'Authorization': `Bearer ${refreshResponse.data.accessToken}`
              }
            });

            console.log('   ✅ Endpoint protegido accesible con token renovado');
            console.log(`   📊 Usuarios encontrados: ${protectedResponse.data.length}\n`);
          } catch (error) {
            console.log('   ❌ Error accediendo endpoint protegido:', error.response?.data?.error || error.message);
          }

          // 6. Probar logout
          console.log('6️⃣ Probando logout...');
          try {
            const logoutResponse = await axios.post(`${API_BASE}/auth/logout`, {
              refreshToken: loginData.refreshToken
            });

            console.log('   ✅ Logout exitoso');
            console.log(`   📝 Mensaje: ${logoutResponse.data.message}\n`);

            // 7. Verificar que el refresh token fue invalidado
            console.log('7️⃣ Verificando invalidación del refresh token...');
            try {
              await axios.post(`${API_BASE}/auth/refresh`, {
                refreshToken: loginData.refreshToken
              });
              console.log('   ❌ ERROR: El refresh token debería estar invalidado');
            } catch (error) {
              if (error.response?.status === 401 || error.response?.status === 403) {
                console.log('   ✅ Refresh token correctamente invalidado después del logout');
              } else {
                console.log('   ⚠️ Error inesperado:', error.response?.data?.error || error.message);
              }
            }

          } catch (error) {
            console.log('   ❌ Error en logout:', error.response?.data?.error || error.message);
          }

        } catch (error) {
          console.log('   ❌ Error renovando token:', error.response?.data?.error || error.message);
        }

      } else if (loginData.token) {
        console.log('   🔒 Sistema legacy detectado - Token único');
        console.log(`   🎫 Token: ${loginData.token.substring(0, 20)}...`);
        console.log(`   👤 Usuario: ${loginData.user.nombre_completo} (${loginData.user.rol})`);
        console.log('   ⚠️ Refresh tokens no implementados en este endpoint\n');
      } else {
        console.log('   ❌ Respuesta de login inesperada:', loginData);
      }

    } catch (error) {
      console.log('   ❌ Error en login:', error.response?.data?.error || error.message);
      console.log('   📊 Status code:', error.response?.status);
      
      if (error.response?.status === 401) {
        console.log('   💡 Esto puede indicar que las credenciales no son correctas o el usuario no existe');
      }
    }

    // 8. Probar estadísticas de sesiones (si el usuario existe)
    console.log('\n8️⃣ Probando estadísticas de refresh tokens...');
    try {
      // Intentar con el primer usuario administrador que encontremos
      const adminLoginResponse = await axios.post(`${API_BASE}/usuarios/login`, {
        correo: 'admin@fcnolimit.cl',
        contraseña: 'admin123' // Contraseña común
      });

      if (adminLoginResponse.data.accessToken) {
        try {
          const statsResponse = await axios.get(`${API_BASE}/auth/stats`, {
            headers: {
              'Authorization': `Bearer ${adminLoginResponse.data.accessToken}`
            }
          });

          console.log('   ✅ Estadísticas obtenidas:');
          console.log(`   📊 Total tokens: ${statsResponse.data.totalTokens}`);
          console.log(`   ✅ Tokens activos: ${statsResponse.data.activeTokens}`);
          console.log(`   ❌ Tokens revocados: ${statsResponse.data.revokedTokens}`);
        } catch (error) {
          console.log('   ⚠️ No se pudieron obtener estadísticas (normal si no eres admin)');
        }
      }
    } catch (error) {
      console.log('   ⚠️ No se pudo hacer login de admin para estadísticas');
    }

  } catch (error) {
    console.log('\n❌ Error general en las pruebas:', error.message);
  }

  console.log('\n🎉 === PRUEBAS COMPLETADAS ===');
}

// Ejecutar las pruebas
testCompleteAuthFlow().catch(console.error);
