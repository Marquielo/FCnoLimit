// Endpoint para autenticación con Google OAuth
const express = require('express');
const https = require('https');
const { signAccessToken, signRefreshToken } = require('../utils/jwt');
const { storeRefreshToken } = require('../utils/refreshTokens');
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
   * Busca un usuario por email O google_id en la base de datos
   */
  async function findUserByEmailOrGoogleId(email, googleId) {
    try {
      const result = await pool.query(
        'SELECT id, nombre_completo, correo, rol, creado_en, google_id FROM "fcnolimit".usuarios WHERE correo = $1 OR google_id = $2',
        [email, googleId]
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
        RETURNING id, nombre_completo, correo, rol, creado_en, google_id
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
   * Actualiza google_id de usuario existente
   */
  async function linkGoogleToUser(userId, googleId) {
    try {
      await pool.query(
        'UPDATE "fcnolimit".usuarios SET google_id = $1 WHERE id = $2',
        [googleId, userId]
      );
      console.log('✅ Google ID vinculado a usuario existente:', userId);
    } catch (error) {
      console.error('❌ Error vinculando Google ID:', error);
      throw error;
    }
  }

  /**
   * POST /oauth/google 
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
      console.log('👤 Usuario Google validado:', googleUser.email);    // Buscar si el usuario ya existe (por email O google_id)
      let user = await findUserByEmailOrGoogleId(googleUser.email, googleUser.googleId);
      
      if (user) {
        console.log('👤 Usuario existente encontrado:', user.correo);
        
        // Si el usuario existe pero no tiene google_id, vincularlo
        if (!user.google_id) {
          await linkGoogleToUser(user.id, googleUser.googleId);
          user.google_id = googleUser.googleId;
        }
      } else {
        console.log('👤 Creando nuevo usuario desde Google...');
        user = await createUserFromGoogle(googleUser);
      }

      // Generar JWT + refresh tokens
      console.log('🔐 Generando tokens para usuario:', user.id);
      
      const accessToken = signAccessToken({ 
        userId: user.id, 
        email: user.correo, 
        rol: user.rol 
      });
      
      const refreshToken = signRefreshToken({ 
        userId: user.id 
      });

      // Almacenar refresh token en la base de datos
      const deviceInfo = req.headers['user-agent'] || 'Unknown Device';
      const ipAddress = req.ip || req.connection.remoteAddress || 'Unknown IP';
      
      await storeRefreshToken(
        pool, 
        refreshToken, 
        user.id, 
        deviceInfo, 
        ipAddress, 
        req.headers['user-agent'] || 'Google-OAuth-Login'
      );

      console.log('✅ Login con Google completado para:', user.correo);

      // Respuesta final con tokens
      res.json({
        message: 'Login con Google exitoso',
        accessToken,
        refreshToken,
        expiresIn: 900, // 15 minutos
        user: {
          id: user.id,
          nombre_completo: user.nombre_completo,
          correo: user.correo,
          rol: user.rol
        }
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
