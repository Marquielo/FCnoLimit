#!/usr/bin/env node

/**
 * Script de prueba para el sistema de refresh tokens
 * Ejecutar con: node scripts/test-refresh-tokens.js
 */

require('dotenv').config();
const { Pool } = require('pg');
const { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } = require('../utils/jwt');
const { storeRefreshToken, findRefreshToken, revokeRefreshToken, cleanExpiredTokens } = require('../utils/refreshTokens');

async function testRefreshTokenSystem() {
  console.log('🧪 === PRUEBA DEL SISTEMA DE REFRESH TOKENS ===\n');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // ==========================================
    // TEST 1: Verificar tabla refresh_tokens
    // ==========================================
    console.log('1️⃣ Verificando tabla refresh_tokens...');
    
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'fcnolimit' 
        AND table_name = 'refresh_tokens'
      )
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log('   ✅ Tabla refresh_tokens existe');
    } else {
      console.log('   ❌ Tabla refresh_tokens NO existe');
      return;
    }    // ==========================================
    // TEST 1.5: Buscar usuario real para pruebas
    // ==========================================
    console.log('\n1.5️⃣ Buscando usuario real para pruebas...');
    
    const userResult = await pool.query('SELECT id, nombre_completo, rol, correo FROM "fcnolimit".usuarios LIMIT 1');
    
    if (userResult.rows.length === 0) {
      console.log('   ❌ No hay usuarios en la base de datos. Crea un usuario primero.');
      return;
    }

    const realUser = userResult.rows[0];
    console.log(`   ✅ Usuario encontrado: ${realUser.nombre_completo} (ID: ${realUser.id})`);

    // ==========================================
    // TEST 2: Generar tokens JWT
    // ==========================================
    console.log('\n2️⃣ Generando tokens JWT...');
    
    const testUser = {
      id: realUser.id,
      rol: realUser.rol,
      correo: realUser.correo
    };

    const accessToken = signAccessToken(testUser);
    const refreshToken = signRefreshToken({ id: testUser.id, tokenVersion: 0 });
    
    console.log('   ✅ Access token generado:', accessToken.substring(0, 50) + '...');
    console.log('   ✅ Refresh token generado:', refreshToken.substring(0, 50) + '...');

    // ==========================================
    // TEST 3: Verificar tokens
    // ==========================================
    console.log('\n3️⃣ Verificando tokens...');
    
    try {
      const accessPayload = verifyAccessToken(accessToken);
      console.log('   ✅ Access token válido:', accessPayload.id, accessPayload.rol);
    } catch (error) {
      console.log('   ❌ Access token inválido:', error.message);
    }

    try {
      const refreshPayload = verifyRefreshToken(refreshToken);
      console.log('   ✅ Refresh token válido:', refreshPayload.id, refreshPayload.type);
    } catch (error) {
      console.log('   ❌ Refresh token inválido:', error.message);
    }

    // ==========================================
    // TEST 4: Almacenar refresh token
    // ==========================================
    console.log('\n4️⃣ Almacenando refresh token en BD...');
    
    try {
      const stored = await storeRefreshToken(pool, {
        userId: testUser.id,
        token: refreshToken,
        deviceInfo: 'Test Device Chrome/91.0',
        ipAddress: '127.0.0.1',
        userAgent: 'Test-Script/1.0'
      });
      
      console.log('   ✅ Refresh token almacenado con ID:', stored.id);
    } catch (error) {
      console.log('   ❌ Error almacenando token:', error.message);
    }

    // ==========================================
    // TEST 5: Buscar refresh token
    // ==========================================
    console.log('\n5️⃣ Buscando refresh token...');
    
    try {
      const found = await findRefreshToken(pool, refreshToken);
      if (found) {
        console.log('   ✅ Token encontrado para usuario:', found.user_id);
        console.log('   ✅ Device info:', found.device_info);
      } else {
        console.log('   ❌ Token no encontrado');
      }
    } catch (error) {
      console.log('   ❌ Error buscando token:', error.message);
    }

    // ==========================================
    // TEST 6: Revocar refresh token
    // ==========================================
    console.log('\n6️⃣ Revocando refresh token...');
    
    try {
      const tokenData = await findRefreshToken(pool, refreshToken);
      if (tokenData) {
        const revoked = await revokeRefreshToken(pool, tokenData.id, 'test');
        console.log('   ✅ Token revocado:', revoked);
      }
    } catch (error) {
      console.log('   ❌ Error revocando token:', error.message);
    }

    // ==========================================
    // TEST 7: Limpiar tokens expirados
    // ==========================================
    console.log('\n7️⃣ Limpiando tokens expirados...');
    
    try {
      const cleaned = await cleanExpiredTokens(pool);
      console.log(`   ✅ ${cleaned} tokens expirados eliminados`);
    } catch (error) {
      console.log('   ❌ Error limpiando tokens:', error.message);
    }

    // ==========================================
    // TEST 8: Estadísticas finales
    // ==========================================
    console.log('\n8️⃣ Estadísticas finales...');
    
    try {
      const stats = await pool.query(`
        SELECT 
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE is_revoked = FALSE) as active,
          COUNT(*) FILTER (WHERE is_revoked = TRUE) as revoked
        FROM "fcnolimit".refresh_tokens
      `);
      
      const { total, active, revoked } = stats.rows[0];
      console.log(`   📊 Total tokens: ${total}`);
      console.log(`   📊 Tokens activos: ${active}`);
      console.log(`   📊 Tokens revocados: ${revoked}`);
    } catch (error) {
      console.log('   ❌ Error obteniendo estadísticas:', error.message);
    }

    console.log('\n🎉 === PRUEBAS COMPLETADAS ===');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  } finally {
    await pool.end();
  }
}

// Ejecutar pruebas
testRefreshTokenSystem();
