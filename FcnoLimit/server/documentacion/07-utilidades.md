# 🛠️ Utilidades FCnoLimit

## 🎯 Visión General
Las utilidades son funciones reutilizables que proporcionan funcionalidades comunes a través de todo el sistema. Incluyen gestión de JWT, refresh tokens, helpers de base de datos y funciones de validación.

## 🔑 Gestión de JWT

### **`/utils/jwt.js`** - Autenticación con Tokens

#### **Configuración Base**
```javascript
const jwt = require('jsonwebtoken');

// Secret key desde variables de entorno
const JWT_SECRET = process.env.JWT_SECRET || 'secreto_super_seguro';

// Configuración de emisor y audiencia para mayor seguridad
const JWT_ISSUER = 'fcnolimit-auth';
const ACCESS_AUDIENCE = 'fcnolimit-api';
const REFRESH_AUDIENCE = 'fcnolimit-refresh';
```

#### **Funciones Legacy (Compatibilidad)**
```javascript
/**
 * Función original para compatibilidad con código existente
 * @param {Object} payload - Datos a incluir en el token
 * @param {Object} options - Opciones adicionales
 * @returns {String} JWT token con 8h de duración
 */
function signToken(payload, options = {}) {
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: '8h', 
    issuer: JWT_ISSUER,
    ...options 
  });
}

/**
 * Verificación de token original
 * @param {String} token - Token a verificar
 * @returns {Object} Payload decodificado
 */
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
```

#### **Funciones de Seguridad Avanzada** ⭐

##### **Access Tokens (15 minutos)**
```javascript
/**
 * Crea un Access Token para autenticación de API requests
 * @param {Object} payload - { id, rol, correo }
 * @returns {String} JWT Access Token
 */
function signAccessToken(payload) {
  // Validación estricta del payload
  if (!payload.id) {
    throw new Error('ID de usuario requerido para access token');
  }
  if (!payload.rol) {
    throw new Error('Rol de usuario requerido para access token');
  }

  // Payload específico para access token
  const accessPayload = {
    id: payload.id,
    rol: payload.rol,
    correo: payload.correo,
    type: 'access' // Identificador del tipo
  };

  return jwt.sign(accessPayload, JWT_SECRET, { 
    expiresIn: '15m',
    issuer: JWT_ISSUER,
    audience: ACCESS_AUDIENCE
  });
}

/**
 * Verifica un Access Token específicamente
 * @param {String} token - Access Token a verificar
 * @returns {Object} Payload decodificado y validado
 */
function verifyAccessToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: ACCESS_AUDIENCE
    });
    
    // Verificación adicional del tipo
    if (decoded.type !== 'access') {
      throw new Error('Token inválido: no es un access token');
    }
    
    return decoded;
  } catch (error) {
    throw new Error(`Access token inválido: ${error.message}`);
  }
}
```

##### **Refresh Tokens (7 días)**
```javascript
/**
 * Crea un Refresh Token para renovación de access tokens
 * @param {Object} payload - { id, tokenVersion }
 * @returns {String} JWT Refresh Token
 */
function signRefreshToken(payload) {
  // Validación mínima (menos datos = mayor seguridad)
  if (!payload.id) {
    throw new Error('ID de usuario requerido para refresh token');
  }

  // Payload mínimo para refresh token
  const refreshPayload = {
    id: payload.id,
    tokenVersion: payload.tokenVersion || 0,
    type: 'refresh'
  };

  return jwt.sign(refreshPayload, JWT_SECRET, { 
    expiresIn: '7d',
    issuer: JWT_ISSUER,
    audience: REFRESH_AUDIENCE
  });
}

/**
 * Verifica un Refresh Token específicamente
 * @param {String} token - Refresh Token a verificar
 * @returns {Object} Payload decodificado y validado
 */
function verifyRefreshToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: REFRESH_AUDIENCE
    });
    
    // Verificación adicional del tipo
    if (decoded.type !== 'refresh') {
      throw new Error('Token inválido: no es un refresh token');
    }
    
    return decoded;
  } catch (error) {
    throw new Error(`Refresh token inválido: ${error.message}`);
  }
}
```

#### **Utilidades de Token**
```javascript
/**
 * Decodifica un token sin verificar (para debugging)
 * @param {String} token - Token a decodificar
 * @returns {Object} Payload decodificado
 */
function decodeToken(token) {
  return jwt.decode(token);
}

/**
 * Verifica si un token está expirado
 * @param {String} token - Token a verificar
 * @returns {Boolean} true si está expirado
 */
function isTokenExpired(token) {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return true;
    
    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
}

/**
 * Obtiene tiempo restante de un token en segundos
 * @param {String} token - Token a analizar
 * @returns {Number} Segundos hasta expiración (0 si expirado)
 */
function getTokenRemainingTime(token) {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return 0;
    
    const remaining = decoded.exp * 1000 - Date.now();
    return Math.max(0, Math.floor(remaining / 1000));
  } catch {
    return 0;
  }
}
```

## 🔄 Gestión de Refresh Tokens

### **`/utils/refreshTokens.js`** - Base de Datos de Tokens

#### **Funciones de Hash**
```javascript
const crypto = require('crypto');

/**
 * Crea hash SHA-256 de un refresh token
 * Nunca almacenamos tokens reales, solo hashes
 * @param {String} token - Token original
 * @returns {String} Hash SHA-256
 */
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Verifica un token contra su hash
 * @param {String} token - Token original
 * @param {String} hash - Hash almacenado
 * @returns {Boolean} true si coinciden
 */
function verifyTokenHash(token, hash) {
  return hashToken(token) === hash;
}
```

#### **Almacenamiento de Tokens**
```javascript
/**
 * Almacena un refresh token en la base de datos de forma segura
 * @param {Object} pool - Conexión PostgreSQL
 * @param {Object} params - { userId, token, deviceInfo, ipAddress, userAgent }
 * @returns {Promise<Object>} Registro creado
 */
async function storeRefreshToken(pool, { userId, token, deviceInfo, ipAddress, userAgent }) {
  try {
    // 1. Calcular fecha de expiración
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 días
    
    // 2. Hash seguro del token
    const tokenHash = hashToken(token);
    
    // 3. Política: Solo un token activo por dispositivo
    const existingToken = await pool.query(
      'SELECT id FROM "fcnolimit".refresh_tokens WHERE user_id = $1 AND device_info = $2 AND is_revoked = FALSE',
      [userId, deviceInfo]
    );
    
    // 4. Revocar token existente si lo hay
    if (existingToken.rows.length > 0) {
      await pool.query(
        'UPDATE "fcnolimit".refresh_tokens SET is_revoked = TRUE, revoked_at = NOW(), revoked_reason = $1 WHERE id = $2',
        ['new_login', existingToken.rows[0].id]
      );
    }
    
    // 5. Insertar nuevo token
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
```

#### **Búsqueda y Validación**
```javascript
/**
 * Busca y valida un refresh token en la base de datos
 * @param {Object} pool - Conexión PostgreSQL
 * @param {String} token - Refresh token a buscar
 * @returns {Promise<Object|null>} Datos del token o null
 */
async function findRefreshToken(pool, token) {
  try {
    const tokenHash = hashToken(token);
    
    // Query con JOIN para obtener datos del usuario
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
    
    // Verificaciones de seguridad
    if (tokenData.is_revoked) {
      console.log('⚠️ Refresh token revocado');
      return null;
    }
    
    if (new Date() > new Date(tokenData.expires_at)) {
      console.log('⚠️ Refresh token expirado');
      // Auto-revocar token expirado
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
```

#### **Control de Tokens**
```javascript
/**
 * Revoca un refresh token específico
 * @param {Object} pool - Conexión PostgreSQL
 * @param {Number} tokenId - ID del token
 * @param {String} reason - Razón de revocación
 * @returns {Promise<Boolean>} Éxito de la operación
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
 * @param {Object} pool - Conexión PostgreSQL
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
```

#### **Mantenimiento y Estadísticas**
```javascript
/**
 * Limpia tokens expirados automáticamente
 * @param {Object} pool - Conexión PostgreSQL
 * @returns {Promise<Number>} Cantidad de tokens eliminados
 */
async function cleanExpiredTokens(pool) {
  try {
    const result = await pool.query(`
      DELETE FROM "fcnolimit".refresh_tokens 
      WHERE expires_at < NOW() 
         OR (is_revoked = TRUE AND revoked_at < NOW() - INTERVAL '30 days')
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
 * @param {Object} pool - Conexión PostgreSQL
 * @param {Number} userId - ID del usuario
 * @returns {Promise<Object>} Estadísticas detalladas
 */
async function getUserTokenStats(pool, userId) {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_tokens,
        COUNT(*) FILTER (WHERE is_revoked = FALSE AND expires_at > NOW()) as active_tokens,
        COUNT(*) FILTER (WHERE is_revoked = TRUE) as revoked_tokens,
        COUNT(DISTINCT device_info) as unique_devices,
        MAX(last_used_at) as last_activity,
        MIN(created_at) as first_token_created
      FROM "fcnolimit".refresh_tokens 
      WHERE user_id = $1
    `, [userId]);
    
    return result.rows[0];
    
  } catch (error) {
    console.error('❌ Error al obtener estadísticas de tokens:', error);
    throw new Error('Error al obtener estadísticas de tokens');
  }
}
```

## 🛠️ Utilidades de Base de Datos

### **`/utils/database.js`** ⭐ *Futura implementación*

#### **Helpers de Consulta**
```javascript
/**
 * Construye queries dinámicas con filtros
 * @param {String} baseQuery - Query base
 * @param {Object} filters - Filtros a aplicar
 * @returns {Object} { query, params }
 */
function buildDynamicQuery(baseQuery, filters) {
  const conditions = [];
  const params = [];
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      conditions.push(`${key} = $${params.length + 1}`);
      params.push(value);
    }
  });
  
  let query = baseQuery;
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }
  
  return { query, params };
}

/**
 * Pagina resultados de una query
 * @param {String} baseQuery - Query sin LIMIT/OFFSET
 * @param {Array} params - Parámetros de la query
 * @param {Number} page - Página actual (1-based)
 * @param {Number} limit - Elementos por página
 * @returns {Object} { query, params, offset }
 */
function paginateQuery(baseQuery, params, page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const paginatedQuery = `${baseQuery} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  const paginatedParams = [...params, limit, offset];
  
  return {
    query: paginatedQuery,
    params: paginatedParams,
    offset,
    limit,
    page
  };
}
```

#### **Transacciones Seguras**
```javascript
/**
 * Ejecuta múltiples queries en una transacción
 * @param {Object} pool - Pool de conexiones
 * @param {Function} callback - Función con las operaciones
 * @returns {Promise} Resultado de la transacción
 */
async function executeTransaction(pool, callback) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    
    console.log('✅ Transacción completada exitosamente');
    return result;
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error en transacción, rollback ejecutado:', error);
    throw error;
    
  } finally {
    client.release();
  }
}

// Uso de transacciones:
const result = await executeTransaction(pool, async (client) => {
  // Múltiples operaciones que deben ser atómicas
  const user = await client.query('INSERT INTO usuarios ...');
  const profile = await client.query('INSERT INTO profiles ...');
  return { user: user.rows[0], profile: profile.rows[0] };
});
```

## 🔧 Utilidades de Validación

### **`/utils/validators.js`** ⭐ *Futura implementación*

#### **Validadores Comunes**
```javascript
/**
 * Valida formato de email
 * @param {String} email - Email a validar
 * @returns {Boolean} true si es válido
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida fortaleza de contraseña
 * @param {String} password - Contraseña a validar
 * @returns {Object} { isValid, errors }
 */
function validatePassword(password) {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Debe tener al menos 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Debe contener al menos una mayúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Debe contener al menos una minúscula');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Debe contener al menos un número');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Sanitiza input del usuario
 * @param {String} input - Input a sanitizar
 * @returns {String} Input sanitizado
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remover < y >
    .replace(/javascript:/gi, '') // Remover javascript:
    .substring(0, 1000); // Limitar longitud
}
```

## 📊 Utilidades de Logging

### **`/utils/logger.js`** ⭐ *Futura implementación*

#### **Sistema de Logs Estructurado**
```javascript
const winston = require('winston');

// Configuración de Winston
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

/**
 * Log de eventos de seguridad
 * @param {String} event - Tipo de evento
 * @param {Object} req - Request object
 * @param {Object} details - Detalles adicionales
 */
function logSecurityEvent(event, req, details = {}) {
  logger.warn('SECURITY_EVENT', {
    event,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    userId: req.user?.id,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
    ...details
  });
}

/**
 * Log de errores de aplicación
 * @param {Error} error - Error ocurrido
 * @param {Object} context - Contexto del error
 */
function logError(error, context = {}) {
  logger.error('APPLICATION_ERROR', {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    ...context
  });
}
```

## 🔒 Utilidades de Seguridad

### **`/utils/security.js`** ⭐ *Futura implementación*

#### **Rate Limiting Helpers**
```javascript
const rateLimitStore = new Map();

/**
 * Verifica rate limit por IP
 * @param {String} ip - IP del cliente
 * @param {Number} maxRequests - Máximo de requests
 * @param {Number} windowMs - Ventana de tiempo en ms
 * @returns {Boolean} true si está dentro del límite
 */
function checkRateLimit(ip, maxRequests = 100, windowMs = 60000) {
  const now = Date.now();
  const key = `${ip}:${Math.floor(now / windowMs)}`;
  
  const current = rateLimitStore.get(key) || 0;
  
  if (current >= maxRequests) {
    return false;
  }
  
  rateLimitStore.set(key, current + 1);
  
  // Limpieza de entries antiguos
  setTimeout(() => {
    rateLimitStore.delete(key);
  }, windowMs);
  
  return true;
}
```

---

## 🚀 Próximas Utilidades

1. **File Upload Utils** - Manejo de archivos
2. **Email Utils** - Envío de emails
3. **Cache Utils** - Sistema de cache
4. **Crypto Utils** - Encriptación adicional
5. **Date Utils** - Manejo de fechas/timezone
6. **API Utils** - Helpers para responses
7. **Test Utils** - Utilidades para testing

---
*Última actualización: $(new Date().toLocaleDateString())*
