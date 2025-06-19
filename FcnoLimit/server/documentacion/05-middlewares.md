# 🔧 Middlewares FCnoLimit

## 🎯 Visión General
Los middlewares son funciones que se ejecutan entre el request del cliente y la respuesta del servidor, proporcionando funcionalidades transversales como autenticación, autorización, validación y logging.

## 🏗️ Arquitectura de Middlewares

### **Orden de Ejecución**
```
Request → CORS → Body Parser → Auth → Role Check → Controller → Response
```

### **Tipos de Middlewares**
- **🔐 Autenticación**: Verificar identidad del usuario
- **👑 Autorización**: Verificar permisos del usuario
- **✅ Validación**: Validar datos de entrada
- **📝 Logging**: Registrar actividad del sistema

## 🔐 Middleware de Autenticación

### **`/middlewares/auth.js`** - Verificación JWT

#### **Función Principal**
```javascript
async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      error: 'Token requerido',
      code: 'AUTH_REQUIRED'
    });
  }

  try {
    // Verificar Access Token con nueva función de seguridad
    const user = await verifyAccessToken(token);
    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ 
      error: 'Token inválido',
      code: 'INVALID_TOKEN',
      details: err.message
    });
  }
}
```

#### **¿Cómo funciona?**

**1. Extracción del Token**
```javascript
// Busca en header: Authorization: Bearer <token>
const authHeader = req.headers['authorization'];
const token = authHeader && authHeader.split(' ')[1];
```

**2. Verificación**
```javascript
// Usa la nueva función de seguridad avanzada
const user = await verifyAccessToken(token);
// Verifica: firma, expiración, formato, audiencia
```

**3. Inyección en Request**
```javascript
// Hace disponible el usuario en todo el request
req.user = {
  id: 123,
  rol: 'jugador',
  correo: 'user@email.com',
  iat: 1671234567,
  exp: 1671235467
};
```

#### **Uso en Rutas**
```javascript
// Proteger una ruta específica
router.get('/profile', authenticateToken, getUserProfile);

// Proteger múltiples rutas
router.use('/admin/*', authenticateToken);

// Middleware opcional (no bloquea si no hay token)
router.get('/public-or-private', optionalAuth, getContent);
```

#### **Respuestas de Error**
```javascript
// Token faltante (401)
{
  "error": "Token requerido",
  "code": "AUTH_REQUIRED",
  "timestamp": "2025-06-19T10:30:00Z"
}

// Token inválido (403)
{
  "error": "Token inválido",
  "code": "INVALID_TOKEN",
  "details": "jwt expired",
  "timestamp": "2025-06-19T10:30:00Z"
}

// Token malformado (403)
{
  "error": "Token inválido",
  "code": "MALFORMED_TOKEN",
  "details": "jwt malformed",
  "timestamp": "2025-06-19T10:30:00Z"
}
```

## 👑 Middleware de Autorización

### **`/middlewares/isAdmin.js`** - Control de Rol Administrador

#### **Función Principal**
```javascript
function isAdmin(req, res, next) {
  // Requiere que authenticateToken se haya ejecutado antes
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Autenticación requerida',
      code: 'AUTH_REQUIRED'
    });
  }

  if (req.user.rol !== 'administrador') {
    return res.status(403).json({ 
      error: 'Acceso solo para administradores',
      code: 'INSUFFICIENT_PERMISSIONS',
      required_role: 'administrador',
      user_role: req.user.rol
    });
  }

  next();
}
```

#### **¿Cómo funciona?**

**1. Verificación de Autenticación Previa**
```javascript
// Asegura que authenticateToken ya se ejecutó
if (!req.user) {
  return res.status(401).json({ ... });
}
```

**2. Verificación de Rol**
```javascript
// Compara rol exacto
if (req.user.rol !== 'administrador') {
  return res.status(403).json({ ... });
}
```

**3. Continuación**
```javascript
// Si pasa las verificaciones, continúa al controlador
next();
```

#### **Uso en Rutas**
```javascript
// Uso típico: Auth + Admin
router.get('/admin/users', authenticateToken, isAdmin, getAllUsers);

// Aplicar a múltiples rutas
router.use('/admin/*', authenticateToken, isAdmin);

// En definición de ruta específica
module.exports = (pool) => {
  router.get('/usuarios', authenticateToken, isAdmin, async (req, res) => {
    // Solo administradores pueden ver todos los usuarios
  });
};
```

#### **Respuestas de Error**
```javascript
// No autenticado (401)
{
  "error": "Autenticación requerida",
  "code": "AUTH_REQUIRED"
}

// Sin permisos (403)
{
  "error": "Acceso solo para administradores",
  "code": "INSUFFICIENT_PERMISSIONS",
  "required_role": "administrador",
  "user_role": "jugador"
}
```

## 🔧 Middlewares Adicionales (Implementación Futura)

### **Middleware de Roles Múltiples** ⭐ *Próxima implementación*
```javascript
// /middlewares/requireRoles.js
function requireRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Autenticación requerida' });
    }

    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({ 
        error: 'Permisos insuficientes',
        required_roles: allowedRoles,
        user_role: req.user.rol
      });
    }

    next();
  };
}

// Uso:
router.get('/teams', authenticateToken, requireRoles('entrenador', 'administrador'), getTeams);
```

### **Middleware de Validación** ⭐ *Próxima implementación*
```javascript
// /middlewares/validate.js
function validateRequest(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Datos inválidos',
        code: 'VALIDATION_ERROR',
        details: error.details.map(d => ({
          field: d.path.join('.'),
          message: d.message
        }))
      });
    }

    req.body = value; // Datos sanitizados
    next();
  };
}

// Uso:
router.post('/users', validateRequest(userSchema), createUser);
```

### **Middleware de Rate Limiting** ⭐ *Próxima implementación*
```javascript
// /middlewares/rateLimit.js
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 intentos por IP
  message: {
    error: 'Demasiados intentos de login',
    code: 'RATE_LIMIT_EXCEEDED',
    retry_after: 900 // segundos
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Uso:
router.post('/login', loginLimiter, loginController);
```

### **Middleware de Logging** ⭐ *Próxima implementación*
```javascript
// /middlewares/logger.js
function requestLogger(req, res, next) {
  const start = Date.now();
  
  // Log del request
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
  
  // Interceptar response para logging
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `${new Date().toISOString()} - ${req.method} ${req.path} - ` +
      `${res.statusCode} - ${duration}ms - User: ${req.user?.id || 'anonymous'}`
    );
  });

  next();
}

// Uso global:
app.use(requestLogger);
```

### **Middleware de CORS Personalizado** ⭐ *Próxima implementación*
```javascript
// /middlewares/cors.js
function customCORS(req, res, next) {
  const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  next();
}
```

## 🔄 Cadena de Middlewares Típica

### **Rutas Públicas**
```javascript
// Solo validación básica
router.get('/public-data', validateRequest(schema), getPublicData);
```

### **Rutas Autenticadas**
```javascript
// Auth básico
router.get('/profile', authenticateToken, getUserProfile);
```

### **Rutas de Administración**
```javascript
// Auth + Role
router.get('/admin/users', authenticateToken, isAdmin, getAllUsers);
```

### **Rutas Complejas** ⭐ *Futuro*
```javascript
// Chain completa de middlewares
router.post('/admin/users', 
  loginLimiter,              // Rate limiting
  authenticateToken,         // Autenticación
  isAdmin,                   // Autorización
  validateRequest(userSchema), // Validación
  createUser                 // Controlador
);
```

## 🛡️ Patrones de Seguridad

### **Principio de Defensa en Profundidad**
```javascript
// Múltiples capas de validación
router.post('/sensitive-action',
  rateLimit,           // 1. Limitar requests
  authenticateToken,   // 2. Verificar identidad
  requireRole('admin'), // 3. Verificar permisos
  validateInput,       // 4. Validar datos
  auditLog,           // 5. Registrar acción
  controller          // 6. Ejecutar lógica
);
```

### **Manejo de Errores Consistente**
```javascript
// Estructura estándar de respuesta de error
function sendError(res, status, error, code, details = null) {
  res.status(status).json({
    error,
    code,
    details,
    timestamp: new Date().toISOString()
  });
}

// Uso en middlewares
if (!req.user) {
  return sendError(res, 401, 'Autenticación requerida', 'AUTH_REQUIRED');
}
```

### **Logging de Seguridad**
```javascript
// Log eventos de seguridad importantes
function logSecurityEvent(event, req, details = {}) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    event,
    ip: req.ip,
    user_agent: req.headers['user-agent'],
    user_id: req.user?.id,
    path: req.path,
    method: req.method,
    ...details
  }));
}

// Uso en middlewares
catch (err) {
  logSecurityEvent('INVALID_TOKEN_ATTEMPT', req, { error: err.message });
  return sendError(res, 403, 'Token inválido', 'INVALID_TOKEN');
}
```

## 📊 Performance y Optimización

### **Middleware Caching** ⭐ *Futuro*
```javascript
// Cache de verificación de tokens
const tokenCache = new Map();

function authenticateTokenCached(req, res, next) {
  const token = extractToken(req);
  
  // Check cache first
  if (tokenCache.has(token)) {
    req.user = tokenCache.get(token);
    return next();
  }

  // Verify and cache
  verifyAccessToken(token)
    .then(user => {
      tokenCache.set(token, user);
      req.user = user;
      next();
    })
    .catch(err => sendError(res, 403, 'Token inválido', 'INVALID_TOKEN'));
}
```

### **Middleware Asíncrono Optimizado**
```javascript
// Wrapper para middlewares async
function asyncMiddleware(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Uso:
router.get('/data', asyncMiddleware(authenticateToken), getData);
```

## 🧪 Testing de Middlewares

### **Unit Tests** ⭐ *Futuro*
```javascript
// test/middlewares/auth.test.js
describe('authenticateToken middleware', () => {
  test('should reject request without token', async () => {
    const req = { headers: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
    await authenticateToken(req, res, jest.fn());
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Token requerido',
      code: 'AUTH_REQUIRED'
    });
  });
});
```

---

## 🚀 Próximas Mejoras de Middlewares

1. **Rate Limiting Avanzado** - Por usuario, endpoint
2. **Request Validation** - Joi/Yup schemas
3. **Audit Logging** - Todas las acciones críticas
4. **Error Handling** - Middleware centralizado
5. **Compression** - Gzip responses automático
6. **Security Headers** - Helmet.js integration
7. **API Versioning** - Version-based routing

---
*Última actualización: $(new Date().toLocaleDateString())*
