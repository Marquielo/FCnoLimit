const bcrypt = require('bcrypt');
const { signToken, signAccessToken, signRefreshToken } = require('../utils/jwt');
const { storeRefreshToken } = require('../utils/refreshTokens');

// ==========================================
// LÓGICA PARA CREAR USUARIO
// ==========================================

async function createUser(pool, { nombre_completo, correo, contraseña, rol }) {
  try {
    // Validar que el email no exista
    const existingUser = await pool.query(
      'SELECT id FROM "fcnolimit".usuarios WHERE correo = $1',
      [correo]
    );
    
    if (existingUser.rows.length > 0) {
      throw new Error('El correo electrónico ya está registrado');
    }

    // Hash de contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    
    // Insertar usuario
    const result = await pool.query(
      'INSERT INTO "fcnolimit".usuarios (nombre_completo, correo, contraseña, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre_completo, correo, rol, created_at',
      [nombre_completo, correo, hashedPassword, rol]
    );
    
    const newUser = result.rows[0];
    console.log(`✅ Usuario creado: ${newUser.nombre_completo} (${newUser.rol})`);
    
    return {
      id: newUser.id,
      nombre_completo: newUser.nombre_completo,
      correo: newUser.correo,
      rol: newUser.rol,
      created_at: newUser.created_at
    };
    
  } catch (error) {
    console.error('❌ Error al crear usuario:', error.message);
    throw error;
  }
}

// ==========================================
// LÓGICA PARA LOGIN CON REFRESH TOKENS
// ==========================================

async function loginUser(pool, { correo, contraseña }, deviceInfo = {}) {
  try {
    // 1. Buscar usuario por email
    const result = await pool.query(
      'SELECT * FROM "fcnolimit".usuarios WHERE correo = $1', 
      [correo]
    );
    
    const user = result.rows[0];
    if (!user) {
      console.log(`⚠️ Intento de login con email inexistente: ${correo}`);
      return null;
    }

    // 2. Verificar contraseña
    const valid = await bcrypt.compare(contraseña, user.contraseña);
    if (!valid) {
      console.log(`⚠️ Contraseña incorrecta para usuario: ${correo}`);
      return null;
    }

    // 3. Generar Access Token (15 minutos)
    const accessToken = signAccessToken({
      id: user.id,
      rol: user.rol,
      correo: user.correo
    });

    // 4. Generar Refresh Token (7 días)
    const refreshToken = signRefreshToken({
      id: user.id,
      tokenVersion: 0
    });

    // 5. Almacenar Refresh Token en base de datos
    await storeRefreshToken(pool, {
      userId: user.id,
      token: refreshToken,
      deviceInfo: deviceInfo.userAgent || 'unknown',
      ipAddress: deviceInfo.ip || 'unknown',
      userAgent: deviceInfo.userAgent || 'unknown'
    });

    // 6. Preparar respuesta con datos seguros
    const userResponse = {
      id: user.id,
      nombre_completo: user.nombre_completo,
      rol: user.rol,
      correo: user.correo
    };

    console.log(`✅ Login exitoso con refresh tokens: ${user.nombre_completo} (${user.rol})`);
    
    return {
      accessToken,
      refreshToken,
      user: userResponse,
      expiresIn: 900 // 15 minutos en segundos
    };

  } catch (error) {
    console.error('❌ Error en login:', error.message);
    throw error;
  }
}

// ==========================================
// LÓGICA LEGACY (Compatibilidad)
// ==========================================

async function loginUserLegacy(pool, { correo, contraseña }) {
  try {
    const result = await pool.query(
      'SELECT * FROM "fcnolimit".usuarios WHERE correo = $1', 
      [correo]
    );
    
    const user = result.rows[0];
    if (!user) return null;
    
    const valid = await bcrypt.compare(contraseña, user.contraseña);
    if (!valid) return null;
    
    // Usar función legacy para compatibilidad
    const token = signToken({
      id: user.id, 
      rol: user.rol, 
      correo: user.correo
    });
    
    return { 
      token, 
      user: { 
        id: user.id, 
        nombre_completo: user.nombre_completo, 
        rol: user.rol, 
        correo: user.correo 
      } 
    };
    
  } catch (error) {
    console.error('❌ Error en login legacy:', error.message);
    throw error;
  }
}

module.exports = {
  createUser,
  loginUser,      // Nueva función con refresh tokens
  loginUserLegacy // Función legacy para compatibilidad
};