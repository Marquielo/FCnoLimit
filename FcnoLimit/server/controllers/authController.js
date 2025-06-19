const { signAccessToken, verifyRefreshToken } = require('../utils/jwt');
const { findRefreshToken, revokeRefreshToken, revokeAllUserTokens, getUserTokenStats } = require('../utils/refreshTokens');

// ==========================================
// CONTROLADOR DE AUTENTICACIÓN AVANZADA
// ==========================================

/**
 * Renovar Access Token usando Refresh Token
 * POST /api/auth/refresh
 */
async function refreshAccessToken(pool, refreshTokenString) {
  try {
    console.log('🔄 Iniciando renovación de access token');

    // 1. Buscar y validar refresh token en base de datos
    const tokenData = await findRefreshToken(pool, refreshTokenString);
    
    if (!tokenData) {
      console.log('⚠️ Refresh token inválido o expirado');
      throw new Error('Refresh token inválido o expirado');
    }

    // 2. Generar nuevo access token
    const newAccessToken = signAccessToken({
      id: tokenData.user_id,
      rol: tokenData.rol,
      correo: tokenData.correo
    });

    console.log(`✅ Access token renovado para usuario: ${tokenData.user_id}`);

    return {
      accessToken: newAccessToken,
      expiresIn: 900, // 15 minutos en segundos
      tokenType: 'Bearer'
    };

  } catch (error) {
    console.error('❌ Error al renovar token:', error.message);
    throw error;
  }
}

/**
 * Cerrar sesión y revocar tokens
 * POST /api/auth/logout
 */
async function logoutUser(pool, userId, refreshTokenString, logoutAll = false) {
  try {
    console.log(`🚪 Iniciando logout para usuario: ${userId}`);

    if (logoutAll) {
      // Revocar todos los tokens del usuario
      const revokedCount = await revokeAllUserTokens(pool, userId, 'logout_all');
      console.log(`✅ ${revokedCount} sesiones cerradas para usuario: ${userId}`);
      
      return {
        message: 'Todas las sesiones han sido cerradas',
        sessions_closed: revokedCount
      };
    } else {
      // Revocar solo el token específico
      const tokenData = await findRefreshToken(pool, refreshTokenString);
      if (tokenData) {
        await revokeRefreshToken(pool, tokenData.id, 'logout');
        console.log(`✅ Sesión específica cerrada para usuario: ${userId}`);
      }
      
      return {
        message: 'Sesión cerrada exitosamente',
        sessions_closed: 1
      };
    }

  } catch (error) {
    console.error('❌ Error al cerrar sesión:', error.message);
    throw error;
  }
}

/**
 * Obtener sesiones activas del usuario
 * GET /api/auth/sessions
 */
async function getUserSessions(pool, userId) {
  try {
    console.log(`📊 Obteniendo sesiones para usuario: ${userId}`);

    const result = await pool.query(`
      SELECT 
        id,
        device_info,
        ip_address,
        created_at,
        last_used_at,
        expires_at
      FROM "fcnolimit".refresh_tokens 
      WHERE user_id = $1 
        AND is_revoked = FALSE 
        AND expires_at > NOW()
      ORDER BY last_used_at DESC
    `, [userId]);

    const sessions = result.rows.map(session => ({
      id: session.id,
      device: session.device_info,
      ip: session.ip_address,
      created: session.created_at,
      last_used: session.last_used_at,
      expires: session.expires_at,
      is_current: false // Se marcará en el frontend basado en el token actual
    }));

    console.log(`✅ ${sessions.length} sesiones activas encontradas para usuario: ${userId}`);
    
    return {
      sessions,
      total: sessions.length
    };

  } catch (error) {
    console.error('❌ Error al obtener sesiones:', error.message);
    throw error;
  }
}

/**
 * Revocar una sesión específica
 * DELETE /api/auth/sessions/:sessionId
 */
async function revokeSession(pool, userId, sessionId) {
  try {
    console.log(`🗑️ Revocando sesión ${sessionId} para usuario: ${userId}`);

    // Verificar que la sesión pertenece al usuario
    const sessionCheck = await pool.query(
      'SELECT id FROM "fcnolimit".refresh_tokens WHERE id = $1 AND user_id = $2 AND is_revoked = FALSE',
      [sessionId, userId]
    );

    if (sessionCheck.rows.length === 0) {
      throw new Error('Sesión no encontrada o no pertenece al usuario');
    }

    // Revocar la sesión
    const success = await revokeRefreshToken(pool, sessionId, 'manual_revoke');
    
    if (success) {
      console.log(`✅ Sesión ${sessionId} revocada exitosamente`);
      return {
        message: 'Sesión revocada exitosamente',
        session_id: sessionId
      };
    } else {
      throw new Error('No se pudo revocar la sesión');
    }

  } catch (error) {
    console.error('❌ Error al revocar sesión:', error.message);
    throw error;
  }
}

/**
 * Obtener estadísticas de tokens del usuario
 * GET /api/auth/stats
 */
async function getTokenStats(pool, userId) {
  try {
    console.log(`📈 Obteniendo estadísticas de tokens para usuario: ${userId}`);

    const stats = await getUserTokenStats(pool, userId);
    
    console.log(`✅ Estadísticas obtenidas para usuario: ${userId}`);
    
    return {
      total_tokens: parseInt(stats.total_tokens) || 0,
      active_tokens: parseInt(stats.active_tokens) || 0,
      revoked_tokens: parseInt(stats.revoked_tokens) || 0,
      unique_devices: parseInt(stats.unique_devices) || 0,
      last_activity: stats.last_activity,
      first_token_created: stats.first_token_created
    };

  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error.message);
    throw error;
  }
}

module.exports = {
  refreshAccessToken,
  logoutUser,
  getUserSessions,
  revokeSession,
  getTokenStats
};
