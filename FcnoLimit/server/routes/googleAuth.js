// Endpoint para autenticación con Google OAuth
const express = require('express');
const https = require('https');
const router = express.Router();

/**
 * Valida un token de Google ID con la API de Google
 */
async function validateGoogleToken(googleToken) {
  return new Promise((resolve, reject) => {
    const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${googleToken}`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const googleUser = JSON.parse(data);
          
          // Verificar que el token sea válido
          if (googleUser.error) {
            reject(new Error(`Token inválido: ${googleUser.error_description}`));
            return;
          }
          
          // Verificar que tenga los campos necesarios
          if (!googleUser.email || !googleUser.name) {
            reject(new Error('Token no contiene información necesaria'));
            return;
          }
          
          console.log('✅ Token de Google validado para:', googleUser.email);
          resolve({
            email: googleUser.email,
            name: googleUser.name,
            picture: googleUser.picture,
            googleId: googleUser.sub
          });
          
        } catch (error) {
          reject(new Error('Error parsing Google response'));
        }
      });
      
    }).on('error', (error) => {
      reject(new Error(`Error validando con Google: ${error.message}`));
    });
  });
}

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
    }    console.log('📧 Token de Google recibido:', googleToken.substring(0, 50) + '...');

    // Validar el token con Google API
    const googleUser = await validateGoogleToken(googleToken);
    console.log('👤 Usuario Google validado:', googleUser.email);

    // TODO: Aquí buscaremos/crearemos el usuario en la BD
    // TODO: Aquí generaremos JWT + refresh tokens

    // Por ahora, respuesta con datos de Google
    res.json({
      message: 'Token de Google validado exitosamente',
      googleUser: {
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture
      },
      next: 'Crear/buscar usuario en BD'
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
