# 🛣️ Rutas y APIs FCnoLimit

## 🎯 Visión General
Sistema de APIs RESTful organizadas por dominios funcionales, con autenticación JWT y control de roles granular.

## 🏗️ Estructura Base

### **URL Base**
```
Desarrollo:  http://localhost:3001/api
Producción:  https://fcnolimit-back.onrender.com/api
```

### **Formato de Respuesta**
```javascript
// Respuesta Exitosa
{
  "data": { ... },
  "message": "Operación exitosa",
  "timestamp": "2025-06-19T10:30:00Z"
}

// Respuesta de Error
{
  "error": "Descripción del error",
  "code": "ERROR_CODE",
  "timestamp": "2025-06-19T10:30:00Z"
}

// Respuesta de Lista
{
  "data": [...],
  "total": 150,
  "page": 1,
  "limit": 20,
  "hasNext": true
}
```

### **Headers Requeridos**
```
Content-Type: application/json
Authorization: Bearer <access_token>  // Para rutas protegidas
User-Agent: FCnoLimit-Client/1.0      // Opcional pero recomendado
```

## 👥 APIs de Usuarios y Autenticación

### **`/api/usuarios`** - Gestión de Usuarios

#### **POST /api/usuarios/register** 🟢 *Público*
Registro de nuevos usuarios
```javascript
// Request Body
{
  "nombre_completo": "Juan Pérez",
  "correo": "juan@email.com",
  "contraseña": "password123",
  "rol": "jugador" // jugador|entrenador|persona_natural
}

// Response 201
{
  "data": {
    "id": 123,
    "nombre_completo": "Juan Pérez",
    "correo": "juan@email.com",
    "rol": "jugador",
    "created_at": "2025-06-19T10:30:00Z"
  },
  "message": "Usuario creado exitosamente"
}

// Errores comunes:
// 400: Datos inválidos
// 409: Email ya registrado
```

#### **POST /api/usuarios/login** 🟢 *Público*
Inicio de sesión con tokens duales
```javascript
// Request Body
{
  "correo": "juan@email.com",
  "contraseña": "password123"
}

// Response 200
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",  // 15 minutos
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...", // 7 días
  "user": {
    "id": 123,
    "nombre_completo": "Juan Pérez",
    "rol": "jugador",
    "correo": "juan@email.com"
  }
}

// Errores comunes:
// 401: Credenciales incorrectas
// 400: Datos faltantes
```

#### **GET /api/usuarios** 🔒 *Admin*
Listar todos los usuarios
```javascript
// Headers: Authorization: Bearer <admin_access_token>

// Response 200
{
  "data": [
    {
      "id": 1,
      "nombre_completo": "Admin User",
      "correo": "admin@fcnolimit.com",
      "rol": "administrador",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 1
}
```

#### **GET /api/usuarios/buscar** 🔒 *Admin*
Búsqueda avanzada de usuarios
```javascript
// Query Parameters
?id=123&nombre=Juan&correo=juan@email.com&rol=jugador

// Response 200
{
  "data": [...],
  "total": 5,
  "filters": {
    "nombre": "Juan",
    "rol": "jugador"
  }
}
```

### **`/api/auth`** - Gestión de Autenticación ⭐ *Nueva sección*

#### **POST /api/auth/refresh** 🟡 *Semi-público*
Renovar access token con refresh token
```javascript
// Request Body
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

// Response 200
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",  // Nuevo token 15min
  "expiresIn": 900  // Segundos hasta expiración
}

// Errores comunes:
// 401: Refresh token inválido/expirado
// 403: Token revocado
```

#### **POST /api/auth/logout** 🔒 *Autenticado*
Cerrar sesión y revocar tokens
```javascript
// Headers: Authorization: Bearer <access_token>
// Request Body
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "logoutAll": false  // true para cerrar todas las sesiones
}

// Response 200
{
  "message": "Sesión cerrada exitosamente",
  "tokensRevoked": 1
}
```

#### **GET /api/auth/sessions** 🔒 *Autenticado*
Ver sesiones activas del usuario
```javascript
// Headers: Authorization: Bearer <access_token>

// Response 200
{
  "data": [
    {
      "id": 1,
      "device_info": "Mozilla/5.0 Chrome/91.0",
      "ip_address": "192.168.1.100",
      "created_at": "2025-06-19T08:00:00Z",
      "last_used_at": "2025-06-19T10:30:00Z",
      "is_current": true
    }
  ],
  "total": 2
}
```

## ⚽ APIs de Entidades Deportivas

### **`/api/equipos`** - Gestión de Equipos

#### **GET /api/equipos** 🟢 *Público*
Listar equipos
```javascript
// Query Parameters (opcionales)
?division=1&asociacion=2&page=1&limit=20

// Response 200
{
  "data": [
    {
      "id": 1,
      "nombre": "FC Barcelona Amateur",
      "logo_url": "https://...",
      "division": "Primera División",
      "entrenador": "Carlos Pérez",
      "total_jugadores": 25
    }
  ],
  "total": 150,
  "page": 1,
  "hasNext": true
}
```

#### **POST /api/equipos** 🔒 *Admin/Entrenador*
Crear nuevo equipo
```javascript
// Headers: Authorization: Bearer <access_token>
// Request Body
{
  "nombre": "Nuevo FC",
  "division_id": 1,
  "entrenador_id": 123,
  "estadio_id": 5,
  "asociacion_id": 2
}

// Response 201
{
  "data": {
    "id": 456,
    "nombre": "Nuevo FC",
    "created_at": "2025-06-19T10:30:00Z"
  }
}
```

#### **GET /api/equipos/:id** 🟢 *Público*
Obtener equipo específico
```javascript
// Response 200
{
  "data": {
    "id": 1,
    "nombre": "FC Barcelona Amateur",
    "logo_url": "https://...",
    "fecha_fundacion": "2020-01-15",
    "division": {
      "id": 1,
      "nombre": "Primera División"
    },
    "entrenador": {
      "id": 123,
      "nombre_completo": "Carlos Pérez"
    },
    "estadio": {
      "id": 5,
      "nombre": "Estadio Municipal"
    },
    "jugadores": [
      {
        "id": 789,
        "nombre": "Lionel Messi",
        "numero_camiseta": 10,
        "posicion": "Delantero"
      }
    ]
  }
}
```

### **`/api/jugadores`** - Gestión de Jugadores

#### **GET /api/jugadores** 🟢 *Público*
Listar jugadores
```javascript
// Query Parameters
?equipo=1&posicion=delantero&edad_min=18&edad_max=30

// Response 200
{
  "data": [
    {
      "id": 789,
      "nombre": "Lionel Messi",
      "equipo": "FC Barcelona Amateur",
      "numero_camiseta": 10,
      "posicion": "Delantero",
      "edad": 25,
      "estadisticas": {
        "goles_temporada": 15,
        "asistencias_temporada": 8
      }
    }
  ]
}
```

#### **POST /api/jugadores** 🔒 *Admin/Entrenador*
Registrar nuevo jugador
```javascript
// Request Body
{
  "user_id": 123,
  "equipo_id": 1,
  "numero_camiseta": 10,
  "posicion": "Delantero",
  "fecha_nacimiento": "1998-06-24",
  "altura": 1.70,
  "peso": 72.5,
  "pie_dominante": "izquierdo"
}

// Response 201
{
  "data": {
    "id": 789,
    "numero_camiseta": 10,
    "created_at": "2025-06-19T10:30:00Z"
  }
}
```

### **`/api/partidos`** - Gestión de Partidos

#### **GET /api/partidos** 🟢 *Público*
Listar partidos
```javascript
// Query Parameters
?fecha_desde=2025-06-01&fecha_hasta=2025-06-30&division=1&estado=programado

// Response 200
{
  "data": [
    {
      "id": 1,
      "equipo_local": "FC Barcelona Amateur",
      "equipo_visitante": "Real Madrid Amateur",
      "fecha_partido": "2025-06-25T15:00:00Z",
      "estadio": "Estadio Municipal",
      "division": "Primera División",
      "estado": "programado",
      "goles_local": null,
      "goles_visitante": null
    }
  ]
}
```

#### **POST /api/partidos** 🔒 *Admin*
Programar nuevo partido
```javascript
// Request Body
{
  "equipo_local_id": 1,
  "equipo_visitante_id": 2,
  "fecha_partido": "2025-06-25T15:00:00Z",
  "estadio_id": 5,
  "division_id": 1
}

// Response 201
{
  "data": {
    "id": 123,
    "estado": "programado",
    "created_at": "2025-06-19T10:30:00Z"
  }
}
```

#### **PUT /api/partidos/:id/resultado** 🔒 *Admin*
Actualizar resultado del partido
```javascript
// Request Body
{
  "goles_local": 2,
  "goles_visitante": 1,
  "estado": "finalizado"
}

// Response 200
{
  "data": {
    "id": 123,
    "goles_local": 2,
    "goles_visitante": 1,
    "estado": "finalizado",
    "updated_at": "2025-06-19T17:45:00Z"
  }
}
```

## 📊 APIs de Estadísticas

### **`/api/estadisticas_partido`** - Estadísticas de Partidos

#### **GET /api/estadisticas_partido/:partido_id** 🟢 *Público*
Estadísticas de un partido específico
```javascript
// Response 200
{
  "data": {
    "partido_id": 123,
    "total_goles": 3,
    "total_tarjetas_amarillas": 4,
    "total_tarjetas_rojas": 1,
    "posesion_local": 65.5,
    "posesion_visitante": 34.5,
    "corners_local": 7,
    "corners_visitante": 3
  }
}
```

#### **POST /api/estadisticas_partido** 🔒 *Admin*
Crear estadísticas de partido
```javascript
// Request Body
{
  "partido_id": 123,
  "total_goles": 3,
  "total_tarjetas_amarillas": 4,
  "posesion_local": 65.5,
  "corners_local": 7
}
```

### **`/api/estadisticas_jugador_partido`** - Estadísticas de Jugadores

#### **GET /api/estadisticas_jugador_partido** 🟢 *Público*
Estadísticas de jugadores por partido
```javascript
// Query Parameters
?jugador_id=789&partido_id=123

// Response 200
{
  "data": [
    {
      "jugador": "Lionel Messi",
      "partido": "FC Barcelona vs Real Madrid",
      "goles": 2,
      "asistencias": 1,
      "tarjetas_amarillas": 0,
      "minutos_jugados": 90
    }
  ]
}
```

## 🏛️ APIs de Entidades Organizacionales

### **`/api/divisiones`** - Divisiones/Categorías

#### **GET /api/divisiones** 🟢 *Público*
```javascript
// Response 200
{
  "data": [
    {
      "id": 1,
      "nombre": "Primera División",
      "nivel": 1,
      "total_equipos": 20
    }
  ]
}
```

### **`/api/asociaciones`** - Asociaciones Deportivas

#### **GET /api/asociaciones** 🟢 *Público*
```javascript
// Response 200
{
  "data": [
    {
      "id": 1,
      "nombre": "Asociación de Fútbol Santiago",
      "region": "Metropolitana",
      "total_equipos": 150
    }
  ]
}
```

### **`/api/estadios`** - Estadios y Canchas

#### **GET /api/estadios** 🟢 *Público*
```javascript
// Response 200
{
  "data": [
    {
      "id": 1,
      "nombre": "Estadio Municipal",
      "direccion": "Av. Principal 123",
      "capacidad": 5000,
      "tipo_cancha": "césped_natural"
    }
  ]
}
```

## 📝 APIs de Gestión Administrativa

### **`/api/solicitudes`** - Solicitudes Generales

#### **GET /api/solicitudes** 🔒 *Admin*
```javascript
// Response 200
{
  "data": [
    {
      "id": 1,
      "usuario": "Juan Pérez",
      "tipo_solicitud": "inscripcion_jugador",
      "estado": "pendiente",
      "fecha_solicitud": "2025-06-19T10:00:00Z"
    }
  ]
}
```

### **`/api/solicitudinscripcion`** - Solicitudes de Inscripción

#### **POST /api/solicitudinscripcion** 🔒 *Autenticado*
```javascript
// Request Body
{
  "tipo_solic_inscripcion": "jugador",
  "nombre_equipo": "FC Barcelona Amateur",
  "asociacion": "Asociación Santiago",
  "fecha_nacimiento": "1998-06-24"
}
```

## 🔍 Endpoints de Utilidad

### **`/api/ping`** 🟢 *Público*
Health check del servidor
```javascript
// Response 200
{
  "message": "pong",
  "timestamp": "2025-06-19T10:30:00Z",
  "version": "1.0.0"
}
```

### **`/api/dbtest`** 🟢 *Público*
Test de conexión a base de datos
```javascript
// Response 200
{
  "connected": true,
  "timestamp": "2025-06-19T10:30:00Z",
  "database_version": "PostgreSQL 15.0",
  "host": "dpg-d0ljklbuibrs73acq6rg-a.ohio-postgres.render.com",
  "status": "Render PostgreSQL connection successful"
}
```

### **`/api/vistas`** - Vistas Personalizadas

#### **GET /api/vistas/tabla-posiciones** 🟢 *Público*
```javascript
// Query Parameters
?division_id=1

// Response 200
{
  "data": [
    {
      "posicion": 1,
      "equipo": "FC Barcelona Amateur",
      "partidos_jugados": 10,
      "puntos": 25,
      "goles_favor": 20,
      "goles_contra": 8,
      "diferencia_goles": 12
    }
  ]
}
```

## 🛡️ Códigos de Estado y Errores

### **Códigos de Estado HTTP**
- `200 OK` - Operación exitosa
- `201 Created` - Recurso creado
- `400 Bad Request` - Datos inválidos
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - Sin permisos
- `404 Not Found` - Recurso no encontrado
- `409 Conflict` - Conflicto (ej: email duplicado)
- `500 Internal Server Error` - Error del servidor

### **Códigos de Error Personalizados**
```javascript
{
  "error": "Token expirado",
  "code": "TOKEN_EXPIRED",
  "action": "refresh_required",
  "timestamp": "2025-06-19T10:30:00Z"
}

// Códigos comunes:
// AUTH_REQUIRED - Autenticación requerida
// INVALID_CREDENTIALS - Credenciales incorrectas
// INSUFFICIENT_PERMISSIONS - Sin permisos
// RESOURCE_NOT_FOUND - Recurso no encontrado
// VALIDATION_ERROR - Error de validación
// DUPLICATE_RESOURCE - Recurso duplicado
```

## 📊 Rate Limiting y Límites

### **Límites Actuales** (Próxima implementación)
- **Registro**: 5 intentos por IP por hora
- **Login**: 10 intentos por IP por 15 minutos
- **API General**: 100 requests por IP por minuto
- **Upload**: 10 uploads por usuario por hora

---

## 🚀 Próximas APIs

1. **File Upload**: `/api/upload` para logos, fotos, documentos
2. **Real-time**: WebSocket para partidos en vivo
3. **Search**: `/api/search` búsqueda global
4. **Analytics**: `/api/analytics` métricas del sistema
5. **Notifications**: `/api/notifications` sistema de notificaciones

---
*Última actualización: $(new Date().toLocaleDateString())*
