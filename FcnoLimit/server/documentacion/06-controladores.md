# 🎮 Controladores FCnoLimit

## 🎯 Visión General
Los controladores contienen la lógica de negocio del sistema, actuando como intermediarios entre las rutas y la base de datos. Procesan requests, validan datos, ejecutan operaciones y retornan respuestas estructuradas.

## 🏗️ Arquitectura de Controladores

### **Patrón MVC**
```
Route → Middleware → Controller → Database → Response
```

### **Principios de Diseño**
- **Single Responsibility**: Un controlador por dominio
- **Thin Controllers**: Lógica mínima, delegar a servicios
- **Error Handling**: Manejo consistente de errores
- **Response Format**: Respuestas estandarizadas

## 👥 Controller de Usuarios

### **`/controllers/logicUser.js`** - Gestión de Usuarios

#### **Funciones Principales**

##### **`createUser(pool, userData)`** - Registro de Usuario
```javascript
async function createUser(pool, { nombre_completo, correo, contraseña, rol }) {
  try {
    // 1. Validación de datos
    if (!nombre_completo || !correo || !contraseña || !rol) {
      throw new Error('Todos los campos son requeridos');
    }

    // 2. Validar email único
    const existingUser = await pool.query(
      'SELECT id FROM "fcnolimit".usuarios WHERE correo = $1',
      [correo]
    );
    
    if (existingUser.rows.length > 0) {
      throw new Error('El correo electrónico ya está registrado');
    }

    // 3. Hash de contraseña con bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

    // 4. Insertar usuario en base de datos
    const result = await pool.query(`
      INSERT INTO "fcnolimit".usuarios 
      (nombre_completo, correo, contraseña, rol) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id, nombre_completo, correo, rol, created_at
    `, [nombre_completo, correo, hashedPassword, rol]);

    // 5. Retornar usuario sin contraseña
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
```

**¿Qué hace esta función?**
1. **Valida** datos de entrada
2. **Verifica** que el email no exista
3. **Hashea** la contraseña con bcrypt
4. **Inserta** el usuario en PostgreSQL
5. **Retorna** datos seguros (sin contraseña)

##### **`loginUser(pool, credentials)`** - Autenticación
```javascript
async function loginUser(pool, { correo, contraseña }) {
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

    // 2. Verificar contraseña con bcrypt
    const isValidPassword = await bcrypt.compare(contraseña, user.contraseña);
    if (!isValidPassword) {
      console.log(`⚠️ Contraseña incorrecta para usuario: ${correo}`);
      return null;
    }

    // 3. Generar JWT token (usando función legacy por compatibilidad)
    const token = signToken({
      id: user.id,
      rol: user.rol,
      correo: user.correo
    });

    // 4. Preparar respuesta sin datos sensibles
    const userResponse = {
      id: user.id,
      nombre_completo: user.nombre_completo,
      rol: user.rol,
      correo: user.correo
    };

    console.log(`✅ Login exitoso: ${user.nombre_completo} (${user.rol})`);
    
    return {
      token,
      user: userResponse
    };

  } catch (error) {
    console.error('❌ Error en login:', error.message);
    throw error;
  }
}
```

**¿Qué hace esta función?**
1. **Busca** usuario por email en PostgreSQL
2. **Compara** contraseña hasheada con bcrypt
3. **Genera** JWT token para autenticación
4. **Retorna** token + datos de usuario
5. **Registra** evento de login en logs

#### **Mejoras de Seguridad Implementadas** ⭐ *Con Refresh Tokens*

##### **`loginUserAdvanced(pool, credentials, deviceInfo)`** - Login con Tokens Duales
```javascript
async function loginUserAdvanced(pool, { correo, contraseña }, deviceInfo = {}) {
  try {
    // 1-2. Validación igual que loginUser básico
    const user = await validateUserCredentials(pool, correo, contraseña);
    if (!user) return null;

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

    // 6. Preparar respuesta con ambos tokens
    const userResponse = {
      id: user.id,
      nombre_completo: user.nombre_completo,
      rol: user.rol,
      correo: user.correo
    };

    console.log(`✅ Login avanzado exitoso: ${user.nombre_completo} (${user.rol})`);
    
    return {
      accessToken,
      refreshToken,
      user: userResponse,
      expiresIn: 900 // 15 minutos en segundos
    };

  } catch (error) {
    console.error('❌ Error en login avanzado:', error.message);
    throw error;
  }
}
```

## 🔄 Controller de Autenticación Avanzada

### **`/controllers/authController.js`** ⭐ *Nueva implementación*

#### **`refreshAccessToken(pool, refreshToken)`** - Renovar Token
```javascript
async function refreshAccessToken(pool, refreshTokenString) {
  try {
    // 1. Buscar y validar refresh token en base de datos
    const tokenData = await findRefreshToken(pool, refreshTokenString);
    if (!tokenData) {
      throw new Error('Refresh token inválido o expirado');
    }

    // 2. Generar nuevo access token
    const newAccessToken = signAccessToken({
      id: tokenData.user_id,
      rol: tokenData.rol,
      correo: tokenData.correo
    });

    console.log(`✅ Access token renovado para usuario: ${tokenData.user_id}`);

    return {
      accessToken: newAccessToken,
      expiresIn: 900, // 15 minutos
      tokenType: 'Bearer'
    };

  } catch (error) {
    console.error('❌ Error al renovar token:', error.message);
    throw error;
  }
}
```

#### **`logoutUser(pool, userId, refreshToken, logoutAll)`** - Cerrar Sesión
```javascript
async function logoutUser(pool, userId, refreshTokenString, logoutAll = false) {
  try {
    if (logoutAll) {
      // Revocar todos los tokens del usuario
      const revokedCount = await revokeAllUserTokens(pool, userId, 'logout_all');
      console.log(`✅ ${revokedCount} sesiones cerradas para usuario: ${userId}`);
      
      return {
        message: 'Todas las sesiones han sido cerradas',
        sessions_closed: revokedCount
      };
    } else {
      // Revocar solo el token específico
      const tokenData = await findRefreshToken(pool, refreshTokenString);
      if (tokenData) {
        await revokeRefreshToken(pool, tokenData.id, 'logout');
        console.log(`✅ Sesión cerrada para usuario: ${userId}`);
      }
      
      return {
        message: 'Sesión cerrada exitosamente',
        sessions_closed: 1
      };
    }

  } catch (error) {
    console.error('❌ Error al cerrar sesión:', error.message);
    throw error;
  }
}
```

#### **`getUserSessions(pool, userId)`** - Obtener Sesiones Activas
```javascript
async function getUserSessions(pool, userId) {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        device_info,
        ip_address,
        created_at,
        last_used_at,
        expires_at
      FROM "fcnolimit".refresh_tokens 
      WHERE user_id = $1 
        AND is_revoked = FALSE 
        AND expires_at > NOW()
      ORDER BY last_used_at DESC
    `, [userId]);

    const sessions = result.rows.map(session => ({
      id: session.id,
      device: session.device_info,
      ip: session.ip_address,
      created: session.created_at,
      last_used: session.last_used_at,
      expires: session.expires_at,
      is_current: false // Se marcará en el frontend
    }));

    console.log(`✅ ${sessions.length} sesiones activas para usuario: ${userId}`);
    
    return {
      sessions,
      total: sessions.length
    };

  } catch (error) {
    console.error('❌ Error al obtener sesiones:', error.message);
    throw error;
  }
}
```

## ⚽ Controllers de Entidades Deportivas

### **Patrón Típico de Controller**
```javascript
// Ejemplo: /controllers/equiposController.js
class EquiposController {
  
  // GET /api/equipos
  static async getAllEquipos(pool, filters = {}) {
    try {
      let query = `
        SELECT 
          e.id,
          e.nombre,
          e.logo_url,
          d.nombre as division,
          u.nombre_completo as entrenador,
          COUNT(j.id) as total_jugadores
        FROM "fcnolimit".equipos e
        LEFT JOIN "fcnolimit".divisiones d ON e.division_id = d.id
        LEFT JOIN "fcnolimit".usuarios u ON e.entrenador_id = u.id
        LEFT JOIN "fcnolimit".jugadores j ON e.id = j.equipo_id
      `;
      
      const conditions = [];
      const params = [];
      
      // Filtros dinámicos
      if (filters.division_id) {
        conditions.push(`e.division_id = $${params.length + 1}`);
        params.push(filters.division_id);
      }
      
      if (filters.asociacion_id) {
        conditions.push(`e.asociacion_id = $${params.length + 1}`);
        params.push(filters.asociacion_id);
      }
      
      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }
      
      query += ` GROUP BY e.id, e.nombre, d.nombre, u.nombre_completo ORDER BY e.nombre`;
      
      const result = await pool.query(query, params);
      
      return {
        equipos: result.rows,
        total: result.rows.length,
        filters_applied: filters
      };
      
    } catch (error) {
      console.error('❌ Error al obtener equipos:', error.message);
      throw error;
    }
  }

  // POST /api/equipos
  static async createEquipo(pool, equipoData, userId) {
    try {
      // Validación de datos
      const { nombre, division_id, entrenador_id, estadio_id, asociacion_id } = equipoData;
      
      if (!nombre || !division_id) {
        throw new Error('Nombre y división son requeridos');
      }

      // Verificar que la división existe
      const divisionCheck = await pool.query(
        'SELECT id FROM "fcnolimit".divisiones WHERE id = $1',
        [division_id]
      );
      
      if (divisionCheck.rows.length === 0) {
        throw new Error('División no encontrada');
      }

      // Crear equipo
      const result = await pool.query(`
        INSERT INTO "fcnolimit".equipos 
        (nombre, division_id, entrenador_id, estadio_id, asociacion_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, nombre, created_at
      `, [nombre, division_id, entrenador_id, estadio_id, asociacion_id]);

      const newEquipo = result.rows[0];
      console.log(`✅ Equipo creado: ${newEquipo.nombre} por usuario: ${userId}`);
      
      return newEquipo;

    } catch (error) {
      console.error('❌ Error al crear equipo:', error.message);
      throw error;
    }
  }

  // GET /api/equipos/:id
  static async getEquipoById(pool, equipoId) {
    try {
      // Query compleja con múltiples JOINs
      const result = await pool.query(`
        SELECT 
          e.*,
          d.nombre as division_nombre,
          d.nivel as division_nivel,
          u.nombre_completo as entrenador_nombre,
          u.correo as entrenador_correo,
          est.nombre as estadio_nombre,
          est.direccion as estadio_direccion,
          a.nombre as asociacion_nombre
        FROM "fcnolimit".equipos e
        LEFT JOIN "fcnolimit".divisiones d ON e.division_id = d.id
        LEFT JOIN "fcnolimit".usuarios u ON e.entrenador_id = u.id
        LEFT JOIN "fcnolimit".estadios est ON e.estadio_id = est.id
        LEFT JOIN "fcnolimit".asociaciones a ON e.asociacion_id = a.id
        WHERE e.id = $1
      `, [equipoId]);

      if (result.rows.length === 0) {
        return null;
      }

      // Obtener jugadores del equipo
      const jugadoresResult = await pool.query(`
        SELECT 
          j.*,
          u.nombre_completo
        FROM "fcnolimit".jugadores j
        JOIN "fcnolimit".usuarios u ON j.user_id = u.id
        WHERE j.equipo_id = $1
        ORDER BY j.numero_camiseta
      `, [equipoId]);

      const equipo = result.rows[0];
      const equipoCompleto = {
        id: equipo.id,
        nombre: equipo.nombre,
        logo_url: equipo.logo_url,
        fecha_fundacion: equipo.fecha_fundacion,
        division: {
          id: equipo.division_id,
          nombre: equipo.division_nombre,
          nivel: equipo.division_nivel
        },
        entrenador: equipo.entrenador_id ? {
          id: equipo.entrenador_id,
          nombre: equipo.entrenador_nombre,
          correo: equipo.entrenador_correo
        } : null,
        estadio: equipo.estadio_id ? {
          id: equipo.estadio_id,
          nombre: equipo.estadio_nombre,
          direccion: equipo.estadio_direccion
        } : null,
        asociacion: equipo.asociacion_id ? {
          id: equipo.asociacion_id,
          nombre: equipo.asociacion_nombre
        } : null,
        jugadores: jugadoresResult.rows,
        total_jugadores: jugadoresResult.rows.length
      };

      return equipoCompleto;

    } catch (error) {
      console.error('❌ Error al obtener equipo:', error.message);
      throw error;
    }
  }
}
```

## 📊 Controllers de Estadísticas

### **`/controllers/estadisticasController.js`** - Análisis de Datos

#### **Estadísticas de Partidos**
```javascript
static async getEstadisticasPartido(pool, partidoId) {
  try {
    // Estadísticas generales del partido
    const partidoStats = await pool.query(`
      SELECT 
        ep.*,
        p.equipo_local_id,
        p.equipo_visitante_id,
        p.goles_local,
        p.goles_visitante
      FROM "fcnolimit".estadisticas_partido ep
      JOIN "fcnolimit".partidos p ON ep.partido_id = p.id
      WHERE ep.partido_id = $1
    `, [partidoId]);

    // Estadísticas individuales de jugadores
    const jugadorStats = await pool.query(`
      SELECT 
        ejp.*,
        u.nombre_completo,
        j.numero_camiseta,
        j.posicion
      FROM "fcnolimit".estadisticas_jugador_partido ejp
      JOIN "fcnolimit".jugadores j ON ejp.jugador_id = j.id
      JOIN "fcnolimit".usuarios u ON j.user_id = u.id
      WHERE ejp.partido_id = $1
      ORDER BY ejp.goles DESC, ejp.asistencias DESC
    `, [partidoId]);

    return {
      partido_general: partidoStats.rows[0] || null,
      estadisticas_jugadores: jugadorStats.rows,
      resumen: {
        total_jugadores_con_stats: jugadorStats.rows.length,
        goleadores: jugadorStats.rows.filter(j => j.goles > 0),
        tarjetas_amarillas: jugadorStats.rows.reduce((sum, j) => sum + j.tarjetas_amarillas, 0),
        tarjetas_rojas: jugadorStats.rows.reduce((sum, j) => sum + j.tarjetas_rojas, 0)
      }
    };

  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error.message);
    throw error;
  }
}
```

## 🛡️ Manejo de Errores en Controllers

### **Patrón de Error Handling**
```javascript
// Wrapper para controllers async
function asyncController(fn) {
  return async (req, res, next) => {
    try {
      const result = await fn(req, res);
      
      // Si el controller retorna datos, enviar respuesta exitosa
      if (result) {
        res.status(200).json({
          data: result,
          timestamp: new Date().toISOString()
        });
      }
      
    } catch (error) {
      // Log del error
      console.error(`❌ Error en ${fn.name}:`, error.message);
      
      // Determinar status code basado en el tipo de error
      let statusCode = 500;
      let errorCode = 'INTERNAL_ERROR';
      
      if (error.message.includes('no encontrado') || error.message.includes('not found')) {
        statusCode = 404;
        errorCode = 'RESOURCE_NOT_FOUND';
      } else if (error.message.includes('requerido') || error.message.includes('inválido')) {
        statusCode = 400;
        errorCode = 'VALIDATION_ERROR';
      } else if (error.message.includes('ya existe') || error.message.includes('duplicado')) {
        statusCode = 409;
        errorCode = 'DUPLICATE_RESOURCE';
      }
      
      res.status(statusCode).json({
        error: error.message,
        code: errorCode,
        timestamp: new Date().toISOString()
      });
    }
  };
}

// Uso:
router.get('/equipos', asyncController(async (req, res) => {
  const { division_id, asociacion_id } = req.query;
  return await EquiposController.getAllEquipos(pool, { division_id, asociacion_id });
}));
```

## 📊 Response Patterns

### **Respuestas Exitosas Estándar**
```javascript
// Lista de recursos
{
  "data": [...],
  "total": 150,
  "page": 1,
  "limit": 20,
  "hasNext": true,
  "timestamp": "2025-06-19T10:30:00Z"
}

// Recurso único
{
  "data": { ... },
  "timestamp": "2025-06-19T10:30:00Z"
}

// Operación exitosa
{
  "message": "Operación completada exitosamente",
  "data": { ... },
  "timestamp": "2025-06-19T10:30:00Z"
}

// Autenticación exitosa
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": { ... },
  "expiresIn": 900,
  "timestamp": "2025-06-19T10:30:00Z"
}
```

---

## 🚀 Próximas Mejoras de Controllers

1. **Service Layer** - Separar lógica de negocio
2. **DTO (Data Transfer Objects)** - Objetos de transferencia
3. **Caching** - Cache de consultas frecuentes
4. **Pagination** - Paginación automática
5. **Audit Logging** - Log de cambios críticos
6. **Background Jobs** - Tareas asíncronas
7. **Real-time Updates** - WebSocket integration

---
*Última actualización: $(new Date().toLocaleDateString())*
