# 🔐 Sistema de Autenticación FCnoLimit

## 🎯 Visión General
Sistema de autenticación moderno con JWT tokens duales (Access + Refresh) que proporciona seguridad robusta y experiencia de usuario fluida.

## 🏗️ Arquitectura de Autenticación

### **Flujo de Autenticación Dual**
```
Login → Access Token (15min) + Refresh Token (7días)
Request → Access Token validation
Expired → Refresh Token → New Access Token
```

## 🔑 Tipos de Tokens

### **Access Token**
- **Duración**: 15 minutos
- **Propósito**: Autorizar requests a la API
- **Contenido**: `{ id, rol, correo, type: 'access' }`
- **Uso**: Header `Authorization: Bearer <token>`

### **Refresh Token**
- **Duración**: 7 días
- **Propósito**: Obtener nuevos Access Tokens
- **Contenido**: `{ id, tokenVersion, type: 'refresh' }`
- **Almacenamiento**: Base de datos (hasheado)

## 📁 Archivos del Sistema

### **`/utils/jwt.js`** - Gestión de JWT
```javascript
// Funciones principales:
signAccessToken(payload)    // Crear access token
signRefreshToken(payload)   // Crear refresh token
verifyAccessToken(token)    // Verificar access token
verifyRefreshToken(token)   // Verificar refresh token

// Funciones legacy (compatibilidad):
signToken(payload)          // Token original (8h)
verifyToken(token)          // Verificación original
```

### **`/utils/refreshTokens.js`** - Gestión de Base de Datos
```javascript
// Almacenamiento:
storeRefreshToken(pool, params)     // Guardar token en DB
findRefreshToken(pool, token)       // Buscar y validar token

// Control:
revokeRefreshToken(pool, id)        // Revocar token específico
revokeAllUserTokens(pool, userId)   // Revocar todos los tokens

// Mantenimiento:
cleanExpiredTokens(pool)            // Limpiar tokens expirados
getUserTokenStats(pool, userId)     // Estadísticas de usuario
```

### **`/middlewares/auth.js`** - Middleware de Autenticación
```javascript
// Función principal:
authenticateToken(req, res, next)   // Verificar Access Token en requests

// Flujo:
1. Extraer token del header Authorization
2. Verificar con verifyAccessToken()
3. Inyectar usuario en req.user
4. Continuar al siguiente middleware
```

### **`/middlewares/isAdmin.js`** - Middleware de Autorización
```javascript
// Función principal:
isAdmin(req, res, next)             // Verificar rol de administrador

// Requisitos:
- Debe ejecutarse DESPUÉS de authenticateToken
- Verifica req.user.rol === 'administrador'
- Bloquea acceso si no es admin
```

## 🗄️ Base de Datos

### **Tabla `refresh_tokens`**
```sql
Campos principales:
- user_id: Referencia al usuario
- token_hash: SHA-256 del token (NO el token real)
- token_version: Para invalidar masivamente
- device_info: Identificación del dispositivo
- expires_at: Fecha de expiración
- is_revoked: Estado de revocación

Seguridad:
- Nunca almacenamos tokens reales
- Solo hashes SHA-256
- Un token activo por dispositivo
- Limpieza automática de expirados
```

## 🔄 Flujos de Autenticación

### **1. Login (Registro de Sesión)**
```javascript
// En controllers/logicUser.js
async function loginUser(pool, { correo, contraseña }) {
  // 1. Verificar credenciales
  const user = await findUserByEmail(correo);
  const valid = await bcrypt.compare(contraseña, user.contraseña);
  
  // 2. Generar tokens
  const accessToken = signAccessToken({ id, rol, correo });
  const refreshToken = signRefreshToken({ id, tokenVersion: 0 });
  
  // 3. Almacenar refresh token
  await storeRefreshToken(pool, {
    userId: id,
    token: refreshToken,
    deviceInfo: req.headers['user-agent'],
    ipAddress: req.ip
  });
  
  // 4. Retornar ambos tokens
  return { accessToken, refreshToken, user };
}
```

### **2. Request Autorizado**
```javascript
// Middleware auth.js
async function authenticateToken(req, res, next) {
  // 1. Extraer Access Token
  const token = req.headers['authorization']?.split(' ')[1];
  
  // 2. Verificar token
  const user = await verifyAccessToken(token);
  
  // 3. Inyectar usuario
  req.user = user;
  next();
}
```

### **3. Renovación de Token**
```javascript
// Endpoint: POST /api/auth/refresh
async function refreshToken(req, res) {
  // 1. Recibir refresh token
  const { refreshToken } = req.body;
  
  // 2. Verificar en base de datos
  const tokenData = await findRefreshToken(pool, refreshToken);
  
  // 3. Generar nuevo access token
  const newAccessToken = signAccessToken({
    id: tokenData.user_id,
    rol: tokenData.rol,
    correo: tokenData.correo
  });
  
  // 4. Retornar nuevo token
  return { accessToken: newAccessToken };
}
```

### **4. Logout (Revocación)**
```javascript
// Endpoint: POST /api/auth/logout
async function logout(req, res) {
  // Opción A: Logout específico
  await revokeRefreshToken(pool, tokenId, 'logout');
  
  // Opción B: Logout de todos los dispositivos
  await revokeAllUserTokens(pool, userId, 'logout_all');
}
```

## 👥 Sistema de Roles

### **Roles Disponibles**
- **`administrador`**: Control total del sistema
- **`entrenador`**: Gestión de equipos y jugadores
- **`jugador`**: Perfil de jugador, estadísticas
- **`persona_natural`**: Usuario básico, consultas

### **Protección de Rutas**
```javascript
// Solo autenticación
router.get('/profile', authenticateToken, getProfile);

// Autenticación + Rol admin
router.get('/admin', authenticateToken, isAdmin, adminPanel);

// Múltiples roles (futuro)
router.get('/team', authenticateToken, isCoachOrAdmin, teamData);
```

## 🛡️ Características de Seguridad

### **1. Tokens Hasheados**
- Refresh tokens nunca se almacenan en texto plano
- Solo hashes SHA-256 en base de datos
- Imposible recuperar token original

### **2. Sesión por Dispositivo**
- Un refresh token activo por dispositivo
- Login nuevo revoca token anterior
- Previene acumulación de tokens

### **3. Detección de Anomalías**
- Tracking de IP y User-Agent
- Logs de última actividad
- Identificación de dispositivos sospechosos

### **4. Expiración Progresiva**
- Access tokens expiran rápido (15 min)
- Refresh tokens duración moderada (7 días)
- Limpieza automática de expirados

### **5. Revocación Granular**
- Revocar token específico
- Revocar todos los tokens de usuario
- Razones de revocación trackadas

## 📊 Monitoreo y Estadísticas

### **Métricas por Usuario**
```javascript
const stats = await getUserTokenStats(pool, userId);
// Retorna:
{
  total_tokens: 5,
  active_tokens: 2,
  revoked_tokens: 3,
  last_activity: '2025-06-19T10:30:00Z'
}
```

### **Mantenimiento Automático**
```javascript
// Ejecutar periódicamente (cron job)
const cleaned = await cleanExpiredTokens(pool);
console.log(`${cleaned} tokens expirados eliminados`);
```

## 🚨 Manejo de Errores

### **Errores Comunes**
- `401 Unauthorized`: Token inválido o expirado
- `403 Forbidden`: Token válido pero sin permisos
- `400 Bad Request`: Formato de token incorrecto

### **Respuestas Estructuradas**
```javascript
// Token expirado
{
  error: 'Token expirado',
  code: 'TOKEN_EXPIRED',
  action: 'refresh_required'
}

// Token inválido
{
  error: 'Token inválido',
  code: 'INVALID_TOKEN',
  action: 'login_required'
}
```

## 🔧 Configuración

### **Variables de Entorno**
```env
JWT_SECRET=your-super-secure-secret-key
NODE_ENV=development|production
```

### **Duración de Tokens**
```javascript
// En utils/jwt.js - Configurables
ACCESS_TOKEN_DURATION = '15m'
REFRESH_TOKEN_DURATION = '7d'
```

---

## 🚀 Próximas Mejoras de Seguridad

1. **Two-Factor Authentication (2FA)**
2. **Rate Limiting por IP**
3. **Detección de Dispositivos Sospechosos**
4. **Geo-blocking Configurable**
5. **Audit Logs Completos**

---
*Última actualización: $(new Date().toLocaleDateString())*
