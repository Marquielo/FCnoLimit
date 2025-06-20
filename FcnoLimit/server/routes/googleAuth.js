// Endpoint para autenticación con Google OAuth
const express = require('express');
const https = require('https');
const router = express.Router();

module.exports = (pool) => {
  // Las funciones y rutas van aquí, con acceso al pool
  
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
   * Busca un usuario por email en la base de datos
   */
  async function findUserByEmail(email) {
    try {
      const result = await pool.query(
        'SELECT id, nombre_completo, correo, rol, creado_en FROM "fcnolimit".usuarios WHERE correo = $1',
        [email]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('❌ Error buscando usuario:', error);
      throw error;
    }
  }

  /**
   * Crea un nuevo usuario desde datos de Google
   */
  async function createUserFromGoogle(googleUser) {
    try {
      const result = await pool.query(`
        INSERT INTO "fcnolimit".usuarios 
        (nombre_completo, correo, rol, creado_en, google_id)
        VALUES ($1, $2, $3, NOW(), $4)
        RETURNING id, nombre_completo, correo, rol, creado_en
      `, [
        googleUser.name,
        googleUser.email,
        'persona_natural', // rol por defecto
        googleUser.googleId
      ]);
      
      console.log('✅ Usuario creado desde Google:', googleUser.email);
      return result.rows[0];
    } catch (error) {
      console.error('❌ Error creando usuario desde Google:', error);
      throw error;
    }
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
    }    console.log('📧 Token de Google recibido:', googleToken.substring(0, 50) + '...');    // Validar el token con Google API
    const googleUser = await validateGoogleToken(googleToken);
    console.log('👤 Usuario Google validado:', googleUser.email);

    // Buscar si el usuario ya existe
    let user = await findUserByEmail(googleUser.email);
    
    if (user) {
      console.log('👤 Usuario existente encontrado:', user.correo);
    } else {
      console.log('👤 Creando nuevo usuario desde Google...');
      user = await createUserFromGoogle(googleUser);
    }

    // TODO: Aquí generaremos JWT + refresh tokens

    // Por ahora, respuesta con usuario encontrado/creado
    res.json({
      message: 'Usuario procesado exitosamente',
      user: {
        id: user.id,
        nombre_completo: user.nombre_completo,
        correo: user.correo,
        rol: user.rol
      },
      isNewUser: !user.creado_en, // Si no tenía creado_en antes, es nuevo
      next: 'Generar JWT + refresh tokens'
    });

  } catch (error) {
    console.error('❌ Error en autenticación Google:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      code: 'GOOGLE_AUTH_ERROR',
      details: error.message
    });
  }
});

return router;

};
