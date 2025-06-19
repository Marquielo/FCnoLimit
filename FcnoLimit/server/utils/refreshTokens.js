const crypto = require('crypto');

// ==========================================
// GESTIÓN DE REFRESH TOKENS EN BASE DE DATOS
// ==========================================

/**
 * Crea un hash SHA-256 del refresh token
 * (Nunca almacenamos el token real, solo su hash)
 * @param {String} token - Refresh token original
 * @returns {String} Hash SHA-256
 */
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Almacena un refresh token en la base de datos
 * @param {Object} pool - Conexión a PostgreSQL
 * @param {Object} params - { userId, token, deviceInfo, ipAddress, userAgent }
 * @returns {Promise<Object>} Registro creado
 */
async function storeRefreshToken(pool, { userId, token, deviceInfo, ipAddress, userAgent }) {
  try {
    // Calcular fecha de expiración (7 días)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    // Hash del token para almacenamiento seguro
    const tokenHash = hashToken(token);
    
    // Verificar si ya existe un token para este usuario y dispositivo
    const existingToken = await pool.query(
      'SELECT id FROM "fcnolimit".refresh_tokens WHERE user_id = $1 AND device_info = $2 AND is_revoked = FALSE',
      [userId, deviceInfo]
    );
    
    // Si existe, lo revocamos (solo un token activo por dispositivo)
    if (existingToken.rows.length > 0) {
      await pool.query(
        'UPDATE "fcnolimit".refresh_tokens SET is_revoked = TRUE, revoked_at = NOW(), revoked_reason = $1 WHERE id = $2',
        ['new_login', existingToken.rows[0].id]
      );
    }
    
    // Insertar nuevo refresh token
    const result = await pool.query(`
      INSERT INTO "fcnolimit".refresh_tokens 
      (user_id, token_hash, device_info, ip_address, user_agent, expires_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, created_at
    `, [userId, tokenHash, deviceInfo, ipAddress, userAgent, expiresAt]);
    
    console.log(`✅ Refresh token almacenado para usuario ${userId}`);
    return result.rows[0];
    
  } catch (error) {
    console.error('❌ Error al almacenar refresh token:', error);
    throw new Error('Error al almacenar refresh token');
  }
}

/**
 * Busca y valida un refresh token en la base de datos
 * @param {Object} pool - Conexión a PostgreSQL
 * @param {String} token - Refresh token a buscar
 * @returns {Promise<Object|null>} Datos del token o null si no es válido
 */
async function findRefreshToken(pool, token) {
  try {
    const tokenHash = hashToken(token);
    
    const result = await pool.query(`
      SELECT 
        rt.id,
        rt.user_id,
        rt.token_version,
        rt.device_info,
        rt.expires_at,
        rt.is_revoked,
        rt.last_used_at,
        u.nombre_completo,
        u.correo,
        u.rol
      FROM "fcnolimit".refresh_tokens rt
      JOIN "fcnolimit".usuarios u ON rt.user_id = u.id
      WHERE rt.token_hash = $1
    `, [tokenHash]);
    
    if (result.rows.length === 0) {
      console.log('⚠️ Refresh token no encontrado');
      return null;
    }
    
    const tokenData = result.rows[0];
    
    // Verificar si el token está revocado
    if (tokenData.is_revoked) {
      console.log('⚠️ Refresh token revocado');
      return null;
    }
    
    // Verificar si el token ha expirado
    if (new Date() > new Date(tokenData.expires_at)) {
      console.log('⚠️ Refresh token expirado');
      // Marcar como revocado automáticamente
      await revokeRefreshToken(pool, tokenData.id, 'expired');
      return null;
    }
    
    // Actualizar última vez usado
    await pool.query(
      'UPDATE "fcnolimit".refresh_tokens SET last_used_at = NOW() WHERE id = $1',
      [tokenData.id]
    );
    
    console.log(`✅ Refresh token válido para usuario ${tokenData.user_id}`);
    return tokenData;
    
  } catch (error) {
    console.error('❌ Error al buscar refresh token:', error);
    throw new Error('Error al buscar refresh token');
  }
}

/**
 * Revoca un refresh token específico
 * @param {Object} pool - Conexión a PostgreSQL
 * @param {Number} tokenId - ID del token a revocar
 * @param {String} reason - Razón de revocación
 * @returns {Promise<Boolean>} True si se revocó exitosamente
 */
async function revokeRefreshToken(pool, tokenId, reason = 'manual') {
  try {
    const result = await pool.query(`
      UPDATE "fcnolimit".refresh_tokens 
      SET is_revoked = TRUE, revoked_at = NOW(), revoked_reason = $1
      WHERE id = $2 AND is_revoked = FALSE
      RETURNING id
    `, [reason, tokenId]);
    
    if (result.rows.length > 0) {
      console.log(`✅ Token ${tokenId} revocado por: ${reason}`);
      return true;
    }
    
    console.log(`⚠️ Token ${tokenId} no encontrado o ya revocado`);
    return false;
    
  } catch (error) {
    console.error('❌ Error al revocar refresh token:', error);
    throw new Error('Error al revocar refresh token');
  }
}

/**
 * Revoca todos los refresh tokens de un usuario
 * @param {Object} pool - Conexión a PostgreSQL
 * @param {Number} userId - ID del usuario
 * @param {String} reason - Razón de revocación
 * @returns {Promise<Number>} Cantidad de tokens revocados
 */
async function revokeAllUserTokens(pool, userId, reason = 'logout_all') {
  try {
    const result = await pool.query(`
      UPDATE "fcnolimit".refresh_tokens 
      SET is_revoked = TRUE, revoked_at = NOW(), revoked_reason = $1
      WHERE user_id = $2 AND is_revoked = FALSE
      RETURNING id
    `, [reason, userId]);
    
    console.log(`✅ ${result.rows.length} tokens revocados para usuario ${userId}`);
    return result.rows.length;
    
  } catch (error) {
    console.error('❌ Error al revocar tokens del usuario:', error);
    throw new Error('Error al revocar tokens del usuario');
  }
}

/**
 * Limpia tokens expirados de la base de datos
 * (Función para ejecutar periódicamente)
 * @param {Object} pool - Conexión a PostgreSQL
 * @returns {Promise<Number>} Cantidad de tokens eliminados
 */
async function cleanExpiredTokens(pool) {
  try {
    const result = await pool.query(`
      DELETE FROM "fcnolimit".refresh_tokens 
      WHERE expires_at < NOW() OR (is_revoked = TRUE AND revoked_at < NOW() - INTERVAL '30 days')
      RETURNING id
    `);
    
    if (result.rows.length > 0) {
      console.log(`🧹 ${result.rows.length} tokens expirados eliminados`);
    }
    
    return result.rows.length;
    
  } catch (error) {
    console.error('❌ Error al limpiar tokens expirados:', error);
    throw new Error('Error al limpiar tokens expirados');
  }
}

/**
 * Obtiene estadísticas de tokens para un usuario
 * @param {Object} pool - Conexión a PostgreSQL
 * @param {Number} userId - ID del usuario
 * @returns {Promise<Object>} Estadísticas de tokens
 */
async function getUserTokenStats(pool, userId) {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_tokens,
        COUNT(*) FILTER (WHERE is_revoked = FALSE AND expires_at > NOW()) as active_tokens,
        COUNT(*) FILTER (WHERE is_revoked = TRUE) as revoked_tokens,
        MAX(last_used_at) as last_activity
      FROM "fcnolimit".refresh_tokens 
      WHERE user_id = $1
    `, [userId]);
    
    return result.rows[0];
    
  } catch (error) {
    console.error('❌ Error al obtener estadísticas de tokens:', error);
    throw new Error('Error al obtener estadísticas de tokens');
  }
}

module.exports = {
  storeRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens,
  cleanExpiredTokens,
  getUserTokenStats,
  hashToken
};
