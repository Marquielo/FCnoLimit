# 🔐 Sistema de Refresh Tokens - FCnoLimit

## 📋 Resumen

Se ha implementado un sistema completo de **refresh tokens** que mejora significativamente la seguridad y experiencia de usuario de la aplicación FCnoLimit.

## ✨ Características Implementadas

### 🛡️ **Seguridad Mejorada**
- **Tokens de corta duración**: Access tokens de 15 minutos
- **Renovación automática**: Sin interrupciones para el usuario
- **Gestión de sesiones**: Control total sobre dispositivos conectados
- **Revocación inmediata**: Cierre de sesiones comprometidas

### 🔄 **Sistema Dual de Tokens**
- **Access Token**: 15 minutos de duración para operaciones
- **Refresh Token**: 7 días de duración para renovación
- **Compatibilidad**: Fallback al sistema legacy

### 📱 **Frontend Inteligente**
- **Renovación automática**: Interceptores de axios
- **Notificaciones**: Alertas de expiración
- **Gestión de sesiones**: Panel de control
- **Experiencia fluida**: Sin relogins forzados

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│    Frontend     │◄──►│     Backend      │◄──►│   PostgreSQL    │
│                 │    │                  │    │                 │
│ • AuthService   │    │ • JWT Utils      │    │ • Users Table   │
│ • useAuth Hook  │    │ • Auth Controller│    │ • Refresh Tokens│
│ • Interceptors  │    │ • Middlewares    │    │ • Session Data  │
│ • Components    │    │ • Routes         │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📁 Archivos Implementados

### **Backend**
```
server/
├── utils/
│   ├── jwt.js                    # Funciones JWT duales
│   └── refreshTokens.js          # Gestión de BD
├── controllers/
│   ├── logicUser.js             # Login con refresh tokens
│   └── authController.js        # Controladores de auth
├── routes/
│   ├── auth.js                  # Rutas de autenticación
│   └── usuarios.js              # Login actualizado
├── middlewares/
│   └── auth.js                  # Verificación JWT
└── scripts/
    ├── test-refresh-tokens.js   # Pruebas backend
    └── test-frontend-refresh.js # Pruebas frontend
```

### **Frontend**
```
src/
├── services/
│   └── authService.ts           # Servicio principal
├── hooks/
│   └── useAuth.ts               # Hook personalizado
├── components/
│   ├── TokenNotification.tsx    # Notificaciones
│   ├── SessionManager.tsx       # Gestión sesiones
│   └── ProtectedRoute.tsx       # Rutas protegidas
├── pages/
│   ├── auth/AuthPage.tsx        # Login actualizado
│   └── SecurityPage.tsx         # Panel seguridad
└── api/
    └── axios.ts                 # Interceptores
```

## 🚀 Flujo de Autenticación

### 1. **Login Inicial**
```typescript
// Usuario inicia sesión
const response = await authService.login(email, password);

// Servidor responde con tokens duales
{
  accessToken: "eyJhbGciOiJIUzI1NiIs...",
  refreshToken: "eyJhbGciOiJIUzI1NiIs...",
  user: { id: 1, rol: "jugador", ... },
  expiresIn: 900 // 15 minutos
}
```

### 2. **Renovación Automática**
```typescript
// Interceptor detecta token próximo a expirar
api.interceptors.request.use(async (config) => {
  const token = await authService.getValidAccessToken();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### 3. **Manejo de Errores**
```typescript
// Response interceptor maneja tokens expirados
api.interceptors.response.use(null, async (error) => {
  if (error.response?.status === 401) {
    const newToken = await authService.refreshAccessToken();
    // Reintenta request con nuevo token
  }
});
```

## 🔧 Configuración

### **Variables de Entorno**
```env
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
```

### **Base de Datos**
```sql
-- Tabla ya creada automáticamente
CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES usuarios(id),
  token_hash VARCHAR(255) NOT NULL,
  device_info TEXT,
  ip_address VARCHAR(45),
  expires_at TIMESTAMP,
  revoked BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🧪 Pruebas

### **Backend**
```bash
cd server
node scripts/test-refresh-tokens.js
```

### **Frontend**
```bash
cd server
node scripts/test-frontend-refresh.js
```

## 📊 Estados del Sistema

### **✅ Sistema Nuevo (Refresh Tokens)**
- Access Token: 15 minutos
- Refresh Token: 7 días
- Renovación automática
- Gestión de sesiones
- Notificaciones de usuario

### **⚠️ Sistema Legacy (Fallback)**
- Token único: 8 horas
- Sin renovación automática
- Compatibilidad mantenida
- Migración gradual

## 🎯 Beneficios

### **Para la Seguridad**
- ✅ Menor ventana de vulnerabilidad
- ✅ Revocación inmediata de sesiones
- ✅ Monitoreo de dispositivos
- ✅ Detección de acceso no autorizado

### **Para la Experiencia**
- ✅ Sin interrupciones de sesión
- ✅ Login automático mantenido
- ✅ Notificaciones informativas
- ✅ Control total de sesiones

### **Para el Desarrollo**
- ✅ Sistema modular y escalable
- ✅ Fácil mantenimiento
- ✅ Documentación completa
- ✅ Pruebas automatizadas

## 🔮 Próximos Pasos

1. **Migrar usuarios legacy** al nuevo sistema
2. **Implementar rate limiting** en endpoints de auth
3. **Agregar 2FA** para mayor seguridad
4. **Métricas de sesiones** en dashboard admin
5. **Push notifications** para eventos de seguridad

## 🆘 Troubleshooting

### **Token no se renueva automáticamente**
- Verificar que `tokenExpiresAt` esté en localStorage
- Comprobar que el refresh token sea válido
- Revisar logs del servidor para errores

### **Usuario deslogueado inesperadamente**
- Verificar que el refresh token no haya expirado
- Comprobar si fue revocado manualmente
- Revisar errores de red en las peticiones

### **Compatibilidad con sistema legacy**
- El sistema funciona con ambos tipos de token
- La migración es gradual y transparente
- No hay breaking changes para usuarios existentes

---

**🎉 ¡Sistema de Refresh Tokens implementado exitosamente!**

*Para más información, consultar la documentación técnica en `/server/documentacion/`*
