# 🗄️ Base de Datos FCnoLimit

## 🎯 Visión General
Base de datos PostgreSQL hospedada en Render, diseñada para manejar todas las entidades del sistema de fútbol amateur: usuarios, equipos, jugadores, partidos, estadísticas y más.

## 🏗️ Información de Conexión

### **Configuración Render PostgreSQL**
```
Host: dpg-d0ljklbuibrs73acq6rg-a.ohio-postgres.render.com
Database: fcnolimit
Port: 5432
SSL: Requerido (sslmode=require)
Esquema Principal: "fcnolimit"
```

### **Connection Pool Configuración**
```javascript
// En index.js
const pool = new Pool({
  max: 20,                    // Máximo 20 conexiones
  idleTimeoutMillis: 30000,   // 30s timeout inactivo
  connectionTimeoutMillis: 2000, // 2s timeout conexión
  keepAlive: true,
  ssl: { rejectUnauthorized: false }
});
```

## 📊 Esquema de Base de Datos

### **Esquema Principal: `fcnolimit`**
Todas las tablas están organizadas bajo el esquema `"fcnolimit"` para mejor organización y evitar conflictos.

## 🏢 Tablas Principales

### **👥 Usuarios y Autenticación**

#### **`usuarios`**
```sql
Propósito: Almacenar información de todos los usuarios del sistema
Campos principales:
- id: SERIAL PRIMARY KEY
- nombre_completo: VARCHAR(255) NOT NULL
- correo: VARCHAR(255) UNIQUE NOT NULL
- contraseña: VARCHAR(255) NOT NULL (hasheada con bcrypt)
- rol: VARCHAR(50) NOT NULL
  - 'administrador': Control total
  - 'entrenador': Gestión de equipos
  - 'jugador': Perfil deportivo
  - 'persona_natural': Usuario básico
- created_at: TIMESTAMP DEFAULT NOW()
- updated_at: TIMESTAMP DEFAULT NOW()

Índices:
- PRIMARY KEY (id)
- UNIQUE INDEX (correo)
- INDEX (rol) para filtros por rol
```

#### **`refresh_tokens`** ⭐ *Nueva tabla de seguridad*
```sql
Propósito: Gestionar refresh tokens para autenticación avanzada
Campos principales:
- id: SERIAL PRIMARY KEY
- user_id: INTEGER REFERENCES usuarios(id)
- token_hash: VARCHAR(255) UNIQUE NOT NULL
- token_version: INTEGER DEFAULT 0
- device_info: TEXT
- ip_address: INET
- user_agent: TEXT
- expires_at: TIMESTAMP WITH TIME ZONE NOT NULL
- is_revoked: BOOLEAN DEFAULT FALSE
- revoked_reason: VARCHAR(100)
- created_at: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
- last_used_at: TIMESTAMP WITH TIME ZONE DEFAULT NOW()

Índices optimizados:
- PRIMARY KEY (id)
- INDEX (user_id) para búsquedas por usuario
- INDEX (token_hash) para validación rápida
- INDEX (expires_at) para limpieza automática
- COMPOSITE INDEX (user_id, is_revoked, expires_at)

Restricciones:
- FK user_id → usuarios(id) ON DELETE CASCADE
- UNIQUE (user_id, device_info) un token por dispositivo
```

### **⚽ Entidades Deportivas**

#### **`equipos`**
```sql
Propósito: Información de equipos de fútbol
Campos principales:
- id: SERIAL PRIMARY KEY
- nombre: VARCHAR(255) NOT NULL
- logo_url: TEXT
- fecha_fundacion: DATE
- estadio_id: INTEGER REFERENCES estadios(id)
- entrenador_id: INTEGER REFERENCES usuarios(id)
- division_id: INTEGER REFERENCES divisiones(id)
- asociacion_id: INTEGER REFERENCES asociaciones(id)

Relaciones:
- Pertenece a una división
- Tiene un entrenador (usuario)
- Juega en un estadio
- Pertenece a una asociación
```

#### **`jugadores`**
```sql
Propósito: Perfiles de jugadores con información deportiva
Campos principales:
- id: SERIAL PRIMARY KEY
- user_id: INTEGER REFERENCES usuarios(id)
- equipo_id: INTEGER REFERENCES equipos(id)
- numero_camiseta: INTEGER
- posicion: VARCHAR(50)
- fecha_nacimiento: DATE
- altura: DECIMAL(3,2)
- peso: DECIMAL(5,2)
- pie_dominante: VARCHAR(10)

Restricciones:
- UNIQUE (equipo_id, numero_camiseta)
- Un jugador puede estar en un equipo a la vez
```

#### **`partidos`**
```sql
Propósito: Información de partidos y encuentros
Campos principales:
- id: SERIAL PRIMARY KEY
- equipo_local_id: INTEGER REFERENCES equipos(id)
- equipo_visitante_id: INTEGER REFERENCES equipos(id)
- fecha_partido: TIMESTAMP NOT NULL
- estadio_id: INTEGER REFERENCES estadios(id)
- division_id: INTEGER REFERENCES divisiones(id)
- goles_local: INTEGER DEFAULT 0
- goles_visitante: INTEGER DEFAULT 0
- estado: VARCHAR(20) DEFAULT 'programado'
  - 'programado': Partido futuro
  - 'en_curso': Partido en vivo
  - 'finalizado': Partido terminado
  - 'cancelado': Partido cancelado

Restricciones:
- equipo_local_id ≠ equipo_visitante_id
- fecha_partido debe ser futura para nuevos partidos
```

### **📊 Estadísticas y Datos**

#### **`estadisticas_partido`**
```sql
Propósito: Estadísticas generales de cada partido
Campos:
- partido_id: INTEGER PRIMARY KEY REFERENCES partidos(id)
- total_goles: INTEGER DEFAULT 0
- total_tarjetas_amarillas: INTEGER DEFAULT 0
- total_tarjetas_rojas: INTEGER DEFAULT 0
- posesion_local: DECIMAL(5,2)
- posesion_visitante: DECIMAL(5,2)
- corners_local: INTEGER DEFAULT 0
- corners_visitante: INTEGER DEFAULT 0
```

#### **`estadisticas_jugador_partido`**
```sql
Propósito: Estadísticas individuales de jugadores por partido
Campos:
- id: SERIAL PRIMARY KEY
- jugador_id: INTEGER REFERENCES jugadores(id)
- partido_id: INTEGER REFERENCES partidos(id)
- goles: INTEGER DEFAULT 0
- asistencias: INTEGER DEFAULT 0
- tarjetas_amarillas: INTEGER DEFAULT 0
- tarjetas_rojas: INTEGER DEFAULT 0
- minutos_jugados: INTEGER DEFAULT 0

Restricciones:
- UNIQUE (jugador_id, partido_id)
- minutos_jugados <= 90 + tiempo_extra
```

### **🏛️ Entidades Organizacionales**

#### **`divisiones`**
```sql
Propósito: Categorías/divisiones de competencia
Campos:
- id: SERIAL PRIMARY KEY
- nombre: VARCHAR(255) NOT NULL
- descripcion: TEXT
- nivel: INTEGER (1=Primera, 2=Segunda, etc.)
```

#### **`asociaciones`**
```sql
Propósito: Asociaciones deportivas regionales
Campos:
- id: SERIAL PRIMARY KEY
- nombre: VARCHAR(255) NOT NULL
- region: VARCHAR(100)
- contacto_email: VARCHAR(255)
```

#### **`estadios`**
```sql
Propósito: Información de estadios y canchas
Campos:
- id: SERIAL PRIMARY KEY
- nombre: VARCHAR(255) NOT NULL
- direccion: TEXT
- capacidad: INTEGER
- tipo_cancha: VARCHAR(50)
```

#### **`campeonatos`**
```sql
Propósito: Torneos y competencias
Campos:
- id: SERIAL PRIMARY KEY
- nombre: VARCHAR(255) NOT NULL
- fecha_inicio: DATE
- fecha_fin: DATE
- division_id: INTEGER REFERENCES divisiones(id)
- estado: VARCHAR(20) DEFAULT 'planificado'
```

### **📝 Gestión Administrativa**

#### **`solicitudes`** y **`solicitudinscripcion`**
```sql
Propósito: Manejar solicitudes de inscripción y registro
Campos principales:
- id: SERIAL PRIMARY KEY
- usuario_id: INTEGER REFERENCES usuarios(id)
- tipo_solicitud: VARCHAR(100)
- estado: VARCHAR(50) DEFAULT 'pendiente'
- fecha_solicitud: TIMESTAMP DEFAULT NOW()
- datos_adicionales: JSONB
```

## 🔍 Vistas de Base de Datos

### **Vistas Personalizadas**
Ubicadas en `/database/views/`, proporcionan consultas optimizadas para el frontend:

```sql
-- Vista de equipos con información completa
CREATE VIEW vista_equipos_completa AS
SELECT 
  e.id,
  e.nombre,
  d.nombre as division,
  u.nombre_completo as entrenador,
  COUNT(j.id) as total_jugadores
FROM equipos e
LEFT JOIN divisiones d ON e.division_id = d.id
LEFT JOIN usuarios u ON e.entrenador_id = u.id
LEFT JOIN jugadores j ON e.id = j.equipo_id
GROUP BY e.id, e.nombre, d.nombre, u.nombre_completo;
```

## ⚡ Optimizaciones de Performance

### **Índices Estratégicos**
```sql
-- Búsquedas frecuentes por email
CREATE INDEX idx_usuarios_correo ON usuarios(correo);

-- Consultas de partidos por fecha
CREATE INDEX idx_partidos_fecha ON partidos(fecha_partido);

-- Estadísticas por jugador
CREATE INDEX idx_estadisticas_jugador ON estadisticas_jugador_partido(jugador_id);

-- Tokens activos (consulta frecuente)
CREATE INDEX idx_refresh_tokens_active 
ON refresh_tokens(user_id, is_revoked, expires_at);
```

### **Connection Pooling**
```javascript
// Configuración optimizada para Render
const pool = new Pool({
  max: 20,                    // Pool size para Render
  idleTimeoutMillis: 30000,   // Evitar conexiones colgadas
  connectionTimeoutMillis: 2000, // Timeout rápido
  keepAlive: true,            // Mantener conexiones vivas
});
```

## 🛡️ Seguridad de Datos

### **Protección de Datos Sensibles**
- **Contraseñas**: Hash bcrypt con salt rounds 10
- **Refresh Tokens**: SHA-256 hash, nunca texto plano
- **SSL/TLS**: Todas las conexiones encriptadas
- **Escape SQL**: Queries parametrizadas previenen SQL injection

### **Constraints de Integridad**
```sql
-- Prevenir equipos jugando contra sí mismos
ALTER TABLE partidos ADD CONSTRAINT check_equipos_diferentes 
CHECK (equipo_local_id != equipo_visitante_id);

-- Validar emails
ALTER TABLE usuarios ADD CONSTRAINT check_email_format 
CHECK (correo ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Números de camiseta válidos
ALTER TABLE jugadores ADD CONSTRAINT check_numero_camiseta 
CHECK (numero_camiseta >= 1 AND numero_camiseta <= 99);
```

## 📊 Mantenimiento y Monitoreo

### **Limpieza Automática**
```javascript
// Ejecutar diariamente
await cleanExpiredTokens(pool);  // Refresh tokens expirados
// Programar limpieza de logs antiguos
// Optimizar índices automáticamente
```

### **Backup y Recuperación**
- **Render automático**: Backups diarios automáticos
- **Retention**: 7 días de backups en plan gratuito
- **Restore**: Disponible via dashboard de Render

### **Monitoring Queries**
```sql
-- Conexiones activas
SELECT count(*) FROM pg_stat_activity;

-- Queries lentas
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements 
ORDER BY mean_time DESC LIMIT 10;

-- Tamaño de tablas
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(tablename::regclass)) as size
FROM pg_tables 
WHERE schemaname = 'fcnolimit'
ORDER BY pg_total_relation_size(tablename::regclass) DESC;
```

## 🔄 Migraciones y Versionado

### **Control de Cambios**
```sql
-- Tabla de control de migraciones (futuro)
CREATE TABLE schema_migrations (
  version VARCHAR(255) PRIMARY KEY,
  applied_at TIMESTAMP DEFAULT NOW()
);
```

### **Scripts de Migración**
```bash
# Estructura recomendada
/database/migrations/
  001_create_users_table.sql
  002_create_refresh_tokens_table.sql
  003_add_user_indexes.sql
  004_create_teams_table.sql
```

---

## 🚀 Próximas Mejoras de Base de Datos

1. **Auditoría Completa**: Trigger-based logging
2. **Particionado**: Para tablas grandes como estadísticas
3. **Read Replicas**: Para consultas de solo lectura
4. **Full-text Search**: Para búsquedas avanzadas
5. **Data Archiving**: Mover datos antiguos automáticamente

---
*Última actualización: $(new Date().toLocaleDateString())*
