# 🔧 Configuración FCnoLimit

## 🎯 Visión General
Guía completa de configuración del backend FCnoLimit, incluyendo variables de entorno, configuración de desarrollo vs producción, troubleshooting y mejores prácticas.

## 📁 Estructura de Configuración

### **Archivos de Configuración**
```
server/
├── .env                    # Variables de entorno (NO commitear)
├── .env.example           # Plantilla de variables
├── package.json           # Dependencias y scripts
├── index.js              # Configuración principal del server
└── config/               # Configuraciones específicas (futuro)
    ├── database.js       # Config de base de datos
    ├── auth.js          # Config de autenticación
    └── cors.js          # Config de CORS
```

## 🌍 Variables de Entorno

### **`.env` - Archivo Principal**
```bash
# ===========================================
# CONFIGURACIÓN BASE DE DATOS
# ===========================================

# PostgreSQL Connection (Render)
DATABASE_URL=postgresql://fcnolimit_user:password@dpg-d0ljklbuibrs73acq6rg-a.ohio-postgres.render.com/fcnolimit?sslmode=require

# Configuración de Pool de Conexiones
DB_POOL_MAX=20
DB_POOL_MIN=5
DB_TIMEOUT=30000
DB_IDLE_TIMEOUT=10000

# ===========================================
# CONFIGURACIÓN DE AUTENTICACIÓN
# ===========================================

# JWT Secret (CRÍTICO: Cambiar en producción)
JWT_SECRET=tu_jwt_secret_super_seguro_256_bits_minimo

# Duración de tokens
ACCESS_TOKEN_DURATION=15m
REFRESH_TOKEN_DURATION=7d

# Bcrypt rounds (10-12 recomendado)
BCRYPT_ROUNDS=10

# ===========================================
# CONFIGURACIÓN DEL SERVIDOR
# ===========================================

# Entorno de ejecución
NODE_ENV=development
# NODE_ENV=production

# Puerto del servidor
PORT=3001

# Host (para desarrollo local)
HOST=localhost

# ===========================================
# CONFIGURACIÓN DE CORS
# ===========================================

# Orígenes permitidos (separados por coma)
CORS_ORIGIN=http://localhost:5173,http://localhost:3000,https://fcnolimit.vercel.app

# Credenciales CORS
CORS_CREDENTIALS=true

# ===========================================
# CONFIGURACIÓN DE SEGURIDAD
# ===========================================

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Session Security
SESSION_SECRET=tu_session_secret_diferente_al_jwt
SECURE_COOKIES=false
# SECURE_COOKIES=true  # Solo en producción con HTTPS

# ===========================================
# CONFIGURACIÓN DE LOGGING
# ===========================================

# Nivel de logs
LOG_LEVEL=debug
# LOG_LEVEL=info     # Para producción

# Archivo de logs
LOG_FILE=logs/application.log
ERROR_LOG_FILE=logs/error.log

# ===========================================
# CONFIGURACIÓN DE EMAIL (Futuro)
# ===========================================

# SMTP Configuration
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=tu_email@gmail.com
# SMTP_PASS=tu_app_password

# ===========================================
# CONFIGURACIÓN DE UPLOAD (Futuro)
# ===========================================

# Cloudinary o AWS S3
# CLOUDINARY_CLOUD_NAME=tu_cloud_name
# CLOUDINARY_API_KEY=tu_api_key
# CLOUDINARY_API_SECRET=tu_api_secret

# ===========================================
# CONFIGURACIÓN DE MONITOREO (Futuro)
# ===========================================

# Sentry Error Tracking
# SENTRY_DSN=https://tu_sentry_dsn

# Analytics
# GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
```

### **`.env.example` - Plantilla Pública**
```bash
# ===========================================
# PLANTILLA DE VARIABLES DE ENTORNO
# Copia este archivo a .env y configura tus valores
# ===========================================

# Base de datos PostgreSQL
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require

# JWT Secret (generar con: openssl rand -hex 32)
JWT_SECRET=your_super_secure_jwt_secret_here

# Entorno
NODE_ENV=development

# Puerto
PORT=3001

# CORS Origins (separados por coma)
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# Configuración de logging
LOG_LEVEL=debug

# Bcrypt rounds
BCRYPT_ROUNDS=10
```

## ⚙️ Configuración por Entorno

### **Desarrollo (Development)**
```javascript
// config/development.js
module.exports = {
  database: {
    ssl: { rejectUnauthorized: false },
    max: 10, // Menor pool para desarrollo
    idleTimeoutMillis: 30000,
    log: true // Logs de queries en desarrollo
  },
  
  auth: {
    accessTokenDuration: '15m',
    refreshTokenDuration: '7d',
    bcryptRounds: 10 // Menor para desarrollo (más rápido)
  },
  
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
  },
  
  logging: {
    level: 'debug',
    console: true,
    file: false
  },
  
  security: {
    rateLimit: {
      enabled: false, // Deshabilitado en desarrollo
      windowMs: 15 * 60 * 1000,
      max: 1000
    }
  }
};
```

### **Producción (Production)**
```javascript
// config/production.js
module.exports = {
  database: {
    ssl: { rejectUnauthorized: false },
    max: 20, // Pool completo para producción
    idleTimeoutMillis: 30000,
    log: false // Sin logs de queries en producción
  },
  
  auth: {
    accessTokenDuration: '15m',
    refreshTokenDuration: '7d',
    bcryptRounds: 12 // Mayor seguridad en producción
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || [],
    credentials: true
  },
  
  logging: {
    level: 'info',
    console: false,
    file: true,
    structured: true // JSON logs para parsing
  },
  
  security: {
    rateLimit: {
      enabled: true,
      windowMs: 15 * 60 * 1000,
      max: 100
    },
    helmet: {
      enabled: true,
      hsts: true,
      noSniff: true
    }
  }
};
```

### **Testing**
```javascript
// config/testing.js
module.exports = {
  database: {
    connectionString: process.env.TEST_DATABASE_URL || 'postgresql://localhost/fcnolimit_test',
    ssl: false,
    max: 5
  },
  
  auth: {
    accessTokenDuration: '1h', // Más largo para tests
    refreshTokenDuration: '1d',
    bcryptRounds: 1 // Mínimo para tests rápidos
  },
  
  logging: {
    level: 'error', // Solo errores en tests
    console: false,
    file: false
  },
  
  security: {
    rateLimit: {
      enabled: false // Sin rate limiting en tests
    }
  }
};
```

## 📝 Configuración Principal

### **`index.js` - Setup del Servidor**
```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Pool } = require('pg');

// Importar configuración según entorno
const getConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  try {
    return require(`./config/${env}.js`);
  } catch (error) {
    console.warn(`Config file for ${env} not found, using defaults`);
    return require('./config/development.js');
  }
};

const config = getConfig();
const app = express();

// ==========================================
// CONFIGURACIÓN DE BASE DE DATOS
// ==========================================

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: config.database.ssl,
  max: config.database.max,
  idleTimeoutMillis: config.database.idleTimeoutMillis,
  connectionTimeoutMillis: 2000,
  keepAlive: true,
  allowExitOnIdle: false
});

// Test de conexión al iniciar
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error connecting to database:', err);
    process.exit(1);
  } else {
    console.log('✅ Database connected successfully');
    release();
  }
});

// ==========================================
// MIDDLEWARES GLOBALES
// ==========================================

// Security headers (solo en producción)
if (process.env.NODE_ENV === 'production') {
  app.use(helmet(config.security.helmet));
}

// CORS configuration
app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials,
  optionsSuccessStatus: 200
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Trust proxy (para obtener IP real en producción)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// ==========================================
// RATE LIMITING
// ==========================================

if (config.security.rateLimit.enabled) {
  const rateLimit = require('express-rate-limit');
  
  const limiter = rateLimit({
    windowMs: config.security.rateLimit.windowMs,
    max: config.security.rateLimit.max,
    message: {
      error: 'Demasiadas peticiones desde esta IP',
      code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
  
  app.use('/api/', limiter);
}

// ==========================================
// LOGGING MIDDLEWARE
// ==========================================

if (config.logging.console || process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
    });
    next();
  });
}

// ==========================================
// RUTAS
// ==========================================

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const dbResult = await pool.query('SELECT NOW()');
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      environment: process.env.NODE_ENV,
      config_loaded: !!config
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: 'Database connection failed'
    });
  }
});

// Importar y usar rutas
const usuariosRoutes = require('./routes/usuarios')(pool);
const equiposRoutes = require('./routes/equipos')(pool);
// ... más rutas

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/equipos', equiposRoutes);

// ==========================================
// ERROR HANDLING
// ==========================================

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    code: 'NOT_FOUND',
    path: req.originalUrl
  });
});

// Error Handler Global
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Error interno del servidor' 
      : err.message,
    code: 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ==========================================
// SERVIDOR
// ==========================================

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on ${HOST}:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🗄️ Database: ${pool.options.host || 'localhost'}`);
});

// ==========================================
// GRACEFUL SHUTDOWN
// ==========================================

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

async function gracefulShutdown(signal) {
  console.log(`\n💀 Received ${signal}. Shutting down gracefully...`);
  
  server.close(async () => {
    console.log('📴 HTTP server closed');
    
    try {
      await pool.end();
      console.log('🔌 Database pool closed');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('⏰ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
}

module.exports = app;
```

## 🛠️ Scripts de Configuración

### **`package.json` - Scripts**
```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "NODE_ENV=testing jest",
    "check-env": "node scripts/check-env.js",
    "setup-db": "node scripts/setup-database.js",
    "migrate": "node scripts/migrate.js",
    "seed": "node scripts/seed.js",
    "backup": "node scripts/backup.js",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

### **`scripts/check-env.js` - Validación de Variables**
```javascript
#!/usr/bin/env node

require('dotenv').config();

const requiredVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'NODE_ENV'
];

const optionalVars = [
  'PORT',
  'CORS_ORIGIN',
  'LOG_LEVEL',
  'BCRYPT_ROUNDS'
];

console.log('🔍 Checking environment variables...\n');

// Verificar variables requeridas
let missingRequired = [];
requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    console.log(`❌ Missing required: ${varName}`);
    missingRequired.push(varName);
  } else {
    console.log(`✅ Required: ${varName} = ${maskSensitive(varName, process.env[varName])}`);
  }
});

console.log('');

// Verificar variables opcionales
optionalVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`✅ Optional: ${varName} = ${process.env[varName]}`);
  } else {
    console.log(`⚠️  Optional: ${varName} = (not set, using default)`);
  }
});

// Validaciones específicas
console.log('\n🔐 Security checks:');

// JWT Secret length
if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
  console.log('⚠️  JWT_SECRET should be at least 32 characters long');
} else {
  console.log('✅ JWT_SECRET length is adequate');
}

// NODE_ENV values
const validEnvironments = ['development', 'production', 'testing'];
if (!validEnvironments.includes(process.env.NODE_ENV)) {
  console.log('⚠️  NODE_ENV should be one of: development, production, testing');
} else {
  console.log(`✅ NODE_ENV is valid: ${process.env.NODE_ENV}`);
}

// Exit with error if missing required vars
if (missingRequired.length > 0) {
  console.log(`\n❌ Missing ${missingRequired.length} required environment variables`);
  console.log('Please check your .env file or environment configuration');
  process.exit(1);
} else {
  console.log('\n🎉 All required environment variables are properly configured!');
}

function maskSensitive(varName, value) {
  const sensitiveVars = ['JWT_SECRET', 'DATABASE_URL', 'SESSION_SECRET'];
  if (sensitiveVars.includes(varName)) {
    return value.substring(0, 8) + '***';
  }
  return value;
}
```

### **`scripts/setup-database.js` - Configuración de DB**
```javascript
#!/usr/bin/env node

require('dotenv').config();
const { Pool } = require('pg');

async function setupDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🗄️ Setting up database...');

    // Verificar conexión
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');

    // Crear esquema si no existe
    await pool.query('CREATE SCHEMA IF NOT EXISTS "fcnolimit"');
    console.log('✅ Schema "fcnolimit" ready');

    // Verificar tablas principales
    const tables = ['usuarios', 'equipos', 'jugadores', 'partidos', 'refresh_tokens'];
    
    for (const table of tables) {
      const result = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'fcnolimit' 
          AND table_name = $1
        )
      `, [table]);
      
      if (result.rows[0].exists) {
        console.log(`✅ Table "${table}" exists`);
      } else {
        console.log(`⚠️  Table "${table}" not found - needs migration`);
      }
    }

    console.log('\n🎉 Database setup check completed');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();
```

## 🐛 Troubleshooting

### **Problemas Comunes**

#### **1. Error: Environment variables not loaded**
```bash
# Síntoma
Error: JWT_SECRET is not defined

# Causa
.env file not found or not loaded

# Solución
1. Verificar que .env existe en la raíz del proyecto
2. Asegurar que dotenv.config() se llama al inicio
3. Verificar permisos de lectura del archivo .env
```

#### **2. Error: Database connection failed**
```bash
# Síntoma
Error connecting to database: Connection terminated

# Causa
Variables de conexión incorrectas o SSL issues

# Solución
1. Verificar DATABASE_URL completa y correcta
2. Asegurar SSL configuration: ssl: { rejectUnauthorized: false }
3. Verificar que el host de la base de datos es accesible
```

#### **3. Error: CORS blocked requests**
```bash
# Síntoma
Access to fetch at 'API' from origin 'FRONTEND' has been blocked by CORS

# Causa
Frontend origin not in CORS_ORIGIN list

# Solución
1. Agregar origin del frontend a CORS_ORIGIN
2. Verificar que incluye protocolo (http/https)
3. Reiniciar servidor después de cambiar CORS_ORIGIN
```

#### **4. Error: Rate limit exceeded**
```bash
# Síntoma
HTTP 429 Too Many Requests

# Causa
Rate limiting muy restrictivo

# Solución
1. Aumentar RATE_LIMIT_MAX_REQUESTS
2. Aumentar RATE_LIMIT_WINDOW_MS
3. Deshabilitar rate limiting en desarrollo
```

### **Scripts de Diagnóstico**

#### **Debug Connection**
```javascript
// scripts/debug-connection.js
require('dotenv').config();

const { Pool } = require('pg');

async function debugConnection() {
  console.log('🔍 Debugging database connection...\n');
  
  console.log('Environment variables:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
  
  if (!process.env.DATABASE_URL) {
    console.log('❌ DATABASE_URL not found');
    return;
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('\n🔗 Attempting connection...');
    const client = await pool.connect();
    
    console.log('✅ Connection successful!');
    
    const result = await client.query('SELECT version()');
    console.log('Database version:', result.rows[0].version);
    
    client.release();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  } finally {
    await pool.end();
  }
}

debugConnection();
```

## 📊 Performance Tuning

### **Database Pool Optimization**
```javascript
// Configuración optimizada por entorno
const poolConfig = {
  development: {
    max: 10,
    min: 2,
    acquire: 30000,
    idle: 10000
  },
  production: {
    max: 20,
    min: 5,
    acquire: 30000,
    idle: 10000
  },
  testing: {
    max: 5,
    min: 0,
    acquire: 10000,
    idle: 5000
  }
};
```

### **Memory Management**
```javascript
// Configuración para evitar memory leaks
process.on('warning', (warning) => {
  console.warn('Node.js warning:', warning.name);
  console.warn(warning.message);
  console.warn(warning.stack);
});

// Monitoreo de memoria
setInterval(() => {
  const memUsage = process.memoryUsage();
  if (memUsage.heapUsed > 100 * 1024 * 1024) { // 100MB
    console.warn('High memory usage:', Math.round(memUsage.heapUsed / 1024 / 1024), 'MB');
  }
}, 60000); // Cada minuto
```

---

## 🚀 Próximas Mejoras de Configuración

1. **Config Management** - Centralized config service
2. **Environment Validation** - Runtime config validation
3. **Hot Reload Config** - Dynamic config updates
4. **Config Encryption** - Encrypted sensitive values
5. **Multi-tenant Config** - Per-tenant configurations
6. **Feature Flags** - Dynamic feature toggling

---
*Última actualización: $(new Date().toLocaleDateString())*
