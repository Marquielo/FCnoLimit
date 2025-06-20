// Script para debuggear el login paso a paso
require('dotenv').config();
const { Pool } = require('pg');
const { loginUser } = require('../controllers/logicUser');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function debugLogin() {
  console.log('🔍 === DEBUG DEL LOGIN ===\n');

  try {
    // 1. Verificar que el usuario existe
    console.log('1️⃣ Verificando si el usuario existe...');
    const userCheck = await pool.query(
      'SELECT id, nombre_completo, rol, correo FROM "fcnolimit".usuarios WHERE correo = $1',
      ['marcelo@gmail.com']
    );

    if (userCheck.rows.length === 0) {
      console.log('   ❌ Usuario no encontrado');
      return;
    }

    const user = userCheck.rows[0];
    console.log('   ✅ Usuario encontrado:');
    console.log(`      ID: ${user.id}`);
    console.log(`      Nombre: ${user.nombre_completo}`);
    console.log(`      Rol: ${user.rol}`);
    console.log(`      Email: ${user.correo}`);    // 2. Verificar tabla refresh_tokens
    console.log('\n2️⃣ Verificando tabla refresh_tokens...');
    const tableCheck = await pool.query(`
      SELECT COUNT(*) as total,
             COUNT(CASE WHEN is_revoked = false THEN 1 END) as active,
             COUNT(CASE WHEN is_revoked = true THEN 1 END) as revoked
      FROM "fcnolimit".refresh_tokens
    `);

    console.log(`   📊 Total tokens: ${tableCheck.rows[0].total}`);
    console.log(`   ✅ Activos: ${tableCheck.rows[0].active}`);
    console.log(`   ❌ Revocados: ${tableCheck.rows[0].revoked}`);

    // 3. Test directo de la función loginUser
    console.log('\n3️⃣ Probando función loginUser directamente...');
    
    const deviceInfo = {
      userAgent: 'Test-Script/1.0',
      ip: '127.0.0.1'
    };

    const loginData = {
      correo: 'marcelo@gmail.com',
      contraseña: 'Sasuke12'
    };

    console.log('   📤 Llamando loginUser...');
    const result = await loginUser(pool, loginData, deviceInfo);

    if (result) {
      console.log('   ✅ Login exitoso');
      console.log('   📊 Resultado:');
      console.log(`      Access Token: ${result.accessToken ? 'Presente' : 'Ausente'}`);
      console.log(`      Refresh Token: ${result.refreshToken ? 'Presente' : 'Ausente'}`);
      console.log(`      Expira en: ${result.expiresIn} segundos`);
      console.log(`      Usuario: ${result.user.nombre_completo} (${result.user.rol})`);      // 4. Verificar que el refresh token se guardó
      console.log('\n4️⃣ Verificando que el refresh token se guardó...');
      const tokenCheck = await pool.query(
        'SELECT id, user_id, device_info, created_at, is_revoked FROM "fcnolimit".refresh_tokens WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
        [user.id]
      );

      if (tokenCheck.rows.length > 0) {
        const token = tokenCheck.rows[0];
        console.log('   ✅ Refresh token guardado:');
        console.log(`      ID: ${token.id}`);
        console.log(`      Usuario: ${token.user_id}`);
        console.log(`      Dispositivo: ${token.device_info}`);
        console.log(`      Creado: ${token.created_at}`);
        console.log(`      Revocado: ${token.is_revoked}`);
      } else {
        console.log('   ❌ No se encontró el refresh token en la BD');
      }

    } else {
      console.log('   ❌ Login falló - resultado null');
    }

  } catch (error) {
    console.error('\n❌ Error durante el debug:', error);
    console.error('Stack trace:', error.stack);
    
    // Información adicional para debugging
    if (error.message.includes('storeRefreshToken')) {
      console.log('\n💡 Problema con storeRefreshToken:');
      console.log('   - Verificar que la función existe en refreshTokens.js');
      console.log('   - Verificar que está correctamente exportada');
    }
    
    if (error.message.includes('signAccessToken') || error.message.includes('signRefreshToken')) {
      console.log('\n💡 Problema con funciones JWT:');
      console.log('   - Verificar que las funciones existen en jwt.js');
      console.log('   - Verificar que están correctamente exportadas');
    }
  } finally {
    await pool.end();
  }
}

// Ejecutar debug
debugLogin();
