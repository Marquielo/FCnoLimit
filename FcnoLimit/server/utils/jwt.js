const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secreto_super_seguro'; // Usa variable de entorno en producción

// ==========================================
// FUNCIONES EXISTENTES (Compatibilidad)
// ==========================================

function signToken(payload, options = {}) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h', ...options });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

// ==========================================
// NUEVAS FUNCIONES DE SEGURIDAD AVANZADA
// ==========================================

/**
 * Crea un Access Token con duración corta (15 minutos)
 * Se usa para todas las peticiones a la API
 * @param {Object} payload - { id, rol, correo }
 * @returns {String} JWT Access Token
 */
function signAccessToken(payload) {
  // Validar que el payload tenga la información necesaria
  if (!payload.id) {
    throw new Error('ID de usuario requerido para access token');
  }
  if (!payload.rol) {
    throw new Error('Rol de usuario requerido para access token');
  }

  // Crear payload específico para access token
  const accessPayload = {
    id: payload.id,
    rol: payload.rol,
    correo: payload.correo,
    type: 'access' // Identificador del tipo de token
  };

  return jwt.sign(accessPayload, JWT_SECRET, { 
    expiresIn: '15m',
    issuer: 'fcnolimit-auth',
    audience: 'fcnolimit-api'
  });
}

/**
 * Crea un Refresh Token con duración larga (7 días)
 * Se usa solo para renovar access tokens
 * @param {Object} payload - { id, tokenVersion }
 * @returns {String} JWT Refresh Token
 */
function signRefreshToken(payload) {
  // Validar que el payload tenga la información mínima
  if (!payload.id) {
    throw new Error('ID de usuario requerido para refresh token');
  }

  // Crear payload mínimo para refresh token (menor información = mayor seguridad)
  const refreshPayload = {
    id: payload.id,
    tokenVersion: payload.tokenVersion || 0, // Para invalidar tokens si es necesario
    type: 'refresh' // Identificador del tipo de token
  };

  return jwt.sign(refreshPayload, JWT_SECRET, { 
    expiresIn: '7d',
    issuer: 'fcnolimit-auth',
    audience: 'fcnolimit-refresh'
  });
}

/**
 * Verifica un Access Token
 * @param {String} token - Access Token a verificar
 * @returns {Object} Payload decodificado
 */
function verifyAccessToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'fcnolimit-auth',
      audience: 'fcnolimit-api'
    });
    
    // Verificar que sea realmente un access token
    if (decoded.type !== 'access') {
      throw new Error('Token inválido: no es un access token');
    }
    
    return decoded;
  } catch (error) {
    throw new Error(`Access token inválido: ${error.message}`);
  }
}

/**
 * Verifica un Refresh Token
 * @param {String} token - Refresh Token a verificar
 * @returns {Object} Payload decodificado
 */
function verifyRefreshToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'fcnolimit-auth',
      audience: 'fcnolimit-refresh'
    });
    
    // Verificar que sea realmente un refresh token
    if (decoded.type !== 'refresh') {
      throw new Error('Token inválido: no es un refresh token');
    }
    
    return decoded;
  } catch (error) {
    throw new Error(`Refresh token inválido: ${error.message}`);
  }
}

module.exports = {
  // Funciones existentes (compatibilidad)
  signToken,
  verifyToken,
  
  // Nuevas funciones de seguridad avanzada
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};