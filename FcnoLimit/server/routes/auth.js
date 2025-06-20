const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth');
const { 
  refreshAccessToken, 
  logoutUser, 
  getUserSessions, 
  revokeSession, 
  getTokenStats 
} = require('../controllers/authController');

module.exports = (pool) => {
  
  // ==========================================
  // RENOVACIÓN DE ACCESS TOKEN
  // ==========================================
  
  /**
   * POST /api/auth/refresh
   * Renovar access token usando refresh token
   */
  router.post('/refresh', async (req, res) => {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(400).json({
          error: 'Refresh token requerido',
          code: 'REFRESH_TOKEN_REQUIRED'
        });
      }

      const result = await refreshAccessToken(pool, refreshToken);
      
      res.json({
        message: 'Access token renovado exitosamente',
        ...result,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Error al renovar token:', error);
      
      // Determinar tipo de error
      if (error.message.includes('inválido') || error.message.includes('expirado')) {
        return res.status(401).json({
          error: 'Refresh token inválido o expirado',
          code: 'INVALID_REFRESH_TOKEN',
          action: 'login_required'
        });
      }
      
      res.status(500).json({
        error: 'Error interno al renovar token',
        code: 'REFRESH_ERROR'
      });
    }
  });
  // ==========================================
  // LOGOUT / CERRAR SESIÓN
  // ==========================================
  
  /**
   * POST /api/auth/logout
   * Cerrar sesión (revocar refresh tokens)
   * Puede funcionar con access token (logout del usuario) o solo con refresh token (logout específico)
   */
  router.post('/logout', async (req, res) => {
    try {
      const { refreshToken, logoutAll = false } = req.body;
      
      // Verificar si hay access token (opcional)
      const authHeader = req.headers['authorization'];
      const accessToken = authHeader && authHeader.split(' ')[1];
      
      let userId = null;
      
      // Si hay access token, obtener el userId del token
      if (accessToken) {
        try {
          const { verifyAccessToken } = require('../utils/jwt');
          const user = await verifyAccessToken(accessToken);
          userId = user.id;
          console.log(`🔓 Logout con access token para usuario: ${userId}`);
        } catch (error) {
          console.log('⚠️ Access token inválido, usando solo refresh token');
        }
      }

      // Si no hay refresh token y no es logout all, error
      if (!refreshToken && !logoutAll) {
        return res.status(400).json({
          error: 'Refresh token requerido para logout específico',
          code: 'REFRESH_TOKEN_REQUIRED'
        });
      }

      // Si hay refresh token pero no userId, obtener userId del refresh token
      if (refreshToken && !userId) {
        try {
          const { verifyRefreshToken } = require('../utils/jwt');
          const payload = await verifyRefreshToken(refreshToken);
          userId = payload.id;
          console.log(`🔓 Logout con refresh token para usuario: ${userId}`);
        } catch (error) {
          return res.status(401).json({
            error: 'Refresh token inválido',
            code: 'INVALID_REFRESH_TOKEN'
          });
        }
      }

      const result = await logoutUser(pool, userId, refreshToken, logoutAll);
      
      res.json({
        ...result,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Error en logout:', error);
      res.status(500).json({
        error: 'Error interno al cerrar sesión',
        code: 'LOGOUT_ERROR'
      });
    }
  });

  // ==========================================
  // GESTIÓN DE SESIONES
  // ==========================================
  
  /**
   * GET /api/auth/sessions
   * Obtener sesiones activas del usuario
   */
  router.get('/sessions', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const result = await getUserSessions(pool, userId);
      
      res.json({
        message: 'Sesiones obtenidas exitosamente',
        data: result,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Error al obtener sesiones:', error);
      res.status(500).json({
        error: 'Error interno al obtener sesiones',
        code: 'SESSIONS_ERROR'
      });
    }
  });

  /**
   * DELETE /api/auth/sessions/:sessionId
   * Revocar una sesión específica
   */
  router.delete('/sessions/:sessionId', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const sessionId = parseInt(req.params.sessionId);

      if (!sessionId || isNaN(sessionId)) {
        return res.status(400).json({
          error: 'ID de sesión inválido',
          code: 'INVALID_SESSION_ID'
        });
      }

      const result = await revokeSession(pool, userId, sessionId);
      
      res.json({
        ...result,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Error al revocar sesión:', error);
      
      if (error.message.includes('no encontrada') || error.message.includes('no pertenece')) {
        return res.status(404).json({
          error: 'Sesión no encontrada o no autorizada',
          code: 'SESSION_NOT_FOUND'
        });
      }
      
      res.status(500).json({
        error: 'Error interno al revocar sesión',
        code: 'REVOKE_SESSION_ERROR'
      });
    }
  });

  // ==========================================
  // ESTADÍSTICAS Y MONITOREO
  // ==========================================
  
  /**
   * GET /api/auth/stats
   * Obtener estadísticas de tokens del usuario
   */
  router.get('/stats', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const stats = await getTokenStats(pool, userId);
      
      res.json({
        message: 'Estadísticas obtenidas exitosamente',
        data: stats,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({
        error: 'Error interno al obtener estadísticas',
        code: 'STATS_ERROR'
      });
    }
  });

  // ==========================================
  // VALIDACIÓN DE TOKEN
  // ==========================================
  
  /**
   * GET /api/auth/validate
   * Validar si el access token actual es válido
   */
  router.get('/validate', authenticateToken, (req, res) => {
    try {
      // Si llegamos aquí, el token es válido (pasó el middleware)
      res.json({
        valid: true,
        user: {
          id: req.user.id,
          rol: req.user.rol,
          correo: req.user.correo
        },
        expires_at: new Date(req.user.exp * 1000).toISOString(),
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Error en validación:', error);
      res.status(500).json({
        error: 'Error interno en validación',
        code: 'VALIDATION_ERROR'
      });
    }
  });

  // ==========================================
  // HEALTH CHECK
  // ==========================================
  
  /**
   * GET /api/auth/health
   * Health check específico para el sistema de auth
   */
  router.get('/health', async (req, res) => {
    try {
      // Test básico de base de datos
      const dbTest = await pool.query('SELECT COUNT(*) FROM "fcnolimit".refresh_tokens');
      
      res.json({
        status: 'healthy',
        database: 'connected',
        total_refresh_tokens: parseInt(dbTest.rows[0].count),
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Error en health check auth:', error);
      res.status(503).json({
        status: 'unhealthy',
        error: 'Database connection failed',
        timestamp: new Date().toISOString()
      });
    }
  });

  return router;
};
