// Endpoint para autenticación con Google OAuth
const express = require('express');
const router = express.Router();

/**
 * POST /auth/google 
 * Recibe un token de Google del frontend y lo valida
 * Si es válido, crea/encuentra el usuario y devuelve JWT + refresh tokens
 */
router.post('/google', async (req, res) => {
  try {
    console.log('🔍 Iniciando autenticación con Google...');
    
    // 1. Obtener el token de Google del request
    const { googleToken } = req.body;
    
    if (!googleToken) {
      return res.status(400).json({
        error: 'Token de Google requerido',
        code: 'MISSING_GOOGLE_TOKEN'
      });
    }

    console.log('📧 Token de Google recibido:', googleToken.substring(0, 50) + '...');

    // TODO: Aquí validaremos el token con Google
    // TODO: Aquí crearemos/buscaremos el usuario
    // TODO: Aquí generaremos JWT + refresh tokens

    // Por ahora, respuesta temporal
    res.json({
      message: 'Endpoint funcionando - implementación en progreso',
      received: 'Google token recibido correctamente'
    });

  } catch (error) {
    console.error('❌ Error en autenticación Google:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      code: 'GOOGLE_AUTH_ERROR'
    });
  }
});

module.exports = router;
