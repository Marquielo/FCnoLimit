# 🚀 Deployment FCnoLimit

## 🎯 Visión General
Guía completa para el despliegue del backend FCnoLimit en Render, incluyendo configuración de PostgreSQL, variables de entorno, monitoreo y troubleshooting.

## 🏗️ Arquitectura de Deployment

### **Plataforma: Render**
```
GitHub Repository → Render Build → PostgreSQL Database → Live Application
```

### **Servicios Deployados**
- **🌐 Web Service**: Backend Node.js en Render
- **🗄️ PostgreSQL**: Base de datos en Render PostgreSQL
- **📊 Monitoring**: Logs y métricas integradas

## 🗄️ Configuración de Base de Datos

### **Render PostgreSQL Setup**

#### **Información de Conexión**
```
Host: dpg-d0ljklbuibrs73acq6rg-a.ohio-postgres.render.com
Database: fcnolimit
Port: 5432
SSL: Requerido (sslmode=require)
```

#### **String de Conexión**
```bash
# Internal Connection (desde Render Web Service)
postgresql://fcnolimit_user:password@dpg-d0ljklbuibrs73acq6rg-a/fcnolimit

# External Connection (desde herramientas externas)
postgresql://fcnolimit_user:password@dpg-d0ljklbuibrs73acq6rg-a.ohio-postgres.render.com/fcnolimit?sslmode=require
```

#### **Configuración del Pool de Conexiones**
```javascript
// Para producción en Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,                    // Máximo 20 conexiones concurrentes
  idleTimeoutMillis: 30000,   // 30 segundos de timeout
  connectionTimeoutMillis: 2000, // 2 segundos para conectar
  keepAlive: true,
  allowExitOnIdle: false
});
```

### **Inicialización de Esquema**
```sql
-- Scripts ejecutados en orden en pgAdmin:

-- 1. Crear esquema
CREATE SCHEMA IF NOT EXISTS "fcnolimit";

-- 2. Crear tablas principales
\i 001_create_usuarios.sql
\i 002_create_equipos.sql
\i 003_create_jugadores.sql
\i 004_create_partidos.sql

-- 3. Crear tabla de seguridad avanzada
\i 005_create_refresh_tokens.sql

-- 4. Crear índices optimizados
\i 006_create_indexes.sql

-- 5. Insertar datos iniciales
\i 007_seed_data.sql
```

## 🌐 Configuración del Web Service

### **Render Web Service Settings**

#### **Configuración Básica**
```yaml
# render.yaml (opcional)
services:
  - type: web
    name: fcnolimit-backend
    env: node
    plan: free  # o starter para producción
    buildCommand: npm install
    startCommand: node index.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3001
```

#### **Build Settings en Dashboard**
```bash
# Build Command
npm install

# Start Command  
node index.js

# Node Version
18.x (automático desde package.json)

# Environment
production
```

### **Variables de Entorno Requeridas**

#### **En Render Dashboard → Environment Variables**
```bash
# Base de datos
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# JWT Security
JWT_SECRET=tu_jwt_secret_super_seguro_en_produccion

# Node Environment
NODE_ENV=production

# Puerto (automático en Render)
PORT=3001

# CORS Origins
CORS_ORIGIN=https://tu-frontend.vercel.app,https://tu-dominio.com

# Configuraciones adicionales de seguridad
BCRYPT_ROUNDS=12
SESSION_TIMEOUT=15m
REFRESH_TOKEN_LIFETIME=7d
```

#### **Generación de JWT_SECRET Seguro**
```bash
# Generar secret de 256 bits
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# O usar OpenSSL
openssl rand -hex 32
```

## 📦 Proceso de Deployment

### **1. Preparación del Código**

#### **package.json Optimizado**
```json
{
  "name": "fcnolimit-backend",
  "version": "1.0.0",
  "description": "Backend para FCnoLimit - Plataforma de fútbol amateur",
  "main": "index.js",
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  },
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest",
    "check-env": "node scripts/check-env.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.0",
    "bcrypt": "^5.1.0",
    "jsonwebtoken": "^9.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "helmet": "^6.1.5"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
```

#### **Optimizaciones para Producción**
```javascript
// index.js - Configuraciones de producción
if (process.env.NODE_ENV === 'production') {
  // Trust proxy para obtener IP real
  app.set('trust proxy', 1);
  
  // Helmet para security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }));
  
  // Compression
  app.use(compression());
}
```

### **2. Configuración de CORS para Producción**
```javascript
// CORS configurado para múltiples dominios
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [
      'http://localhost:5173',  // Desarrollo
      'https://fcnolimit.vercel.app', // Producción frontend
      'https://admin.fcnolimit.com'   // Panel admin
    ];
    
    // Permitir requests sin origin (mobile apps, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

### **3. Deployment Workflow**

#### **Automatización con GitHub**
```bash
# 1. Push a rama main
git add .
git commit -m "feat: implementar refresh tokens y documentación"
git push origin main

# 2. Render detecta cambios automáticamente
# 3. Render ejecuta build
# 4. Render deploya nueva versión
# 5. Health check automático
```

#### **Health Check Endpoint**
```javascript
// Para verificar que el deployment fue exitoso
app.get('/api/health', async (req, res) => {
  try {
    // Verificar conexión a base de datos
    const dbResult = await pool.query('SELECT NOW()');
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: 'Database connection failed',
      timestamp: new Date().toISOString()
    });
  }
});
```

## 📊 Monitoreo y Logs

### **Render Built-in Monitoring**

#### **Acceso a Logs**
```bash
# En Render Dashboard:
# 1. Ir a tu Web Service
# 2. Click en "Logs" tab
# 3. Ver logs en tiempo real

# Logs estructurados en el código
console.log(JSON.stringify({
  level: 'info',
  message: 'Usuario autenticado',
  userId: user.id,
  timestamp: new Date().toISOString(),
  ip: req.ip
}));
```

#### **Métricas Importantes**
- **Response Time**: < 500ms promedio
- **Error Rate**: < 1% de requests
- **Database Connections**: < 15 de 20 máximo
- **Memory Usage**: < 512MB (plan free)

### **Alertas y Notificaciones**
```javascript
// Script para monitorear health
const checkHealth = async () => {
  try {
    const response = await fetch('https://fcnolimit-back.onrender.com/api/health');
    const data = await response.json();
    
    if (data.status !== 'healthy') {
      // Enviar alerta (email, Slack, etc.)
      console.error('🚨 Application unhealthy:', data);
    }
  } catch (error) {
    console.error('🚨 Health check failed:', error);
  }
};

// Ejecutar cada 5 minutos
setInterval(checkHealth, 5 * 60 * 1000);
```

## 🛡️ Seguridad en Producción

### **SSL/TLS**
- ✅ **HTTPS automático** en Render
- ✅ **SSL certificates** gestionados automáticamente
- ✅ **HTTP → HTTPS redirect** configurado

### **Security Headers**
```javascript
// Helmet configuration para producción
app.use(helmet({
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.fcnolimit.com"],
    },
  },
}));
```

### **Rate Limiting**
```javascript
const rateLimit = require('express-rate-limit');

// Rate limiting para producción
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests per window per IP
  message: {
    error: 'Demasiadas peticiones desde esta IP',
    retryAfter: 900
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);
```

## 🔧 Troubleshooting

### **Problemas Comunes**

#### **Error: Connection timeout**
```bash
# Síntoma: Database connection timeouts
# Causa: Pool de conexiones agotado
# Solución:
# 1. Verificar que pool.end() se llame correctamente
# 2. Reducir pool.max si es necesario
# 3. Incrementar connectionTimeoutMillis
```

#### **Error: CORS**
```bash
# Síntoma: CORS errors en frontend
# Causa: Origin no permitido
# Solución:
# 1. Verificar CORS_ORIGIN en variables de entorno
# 2. Asegurar que incluye dominio del frontend
# 3. Verificar protocolo (http vs https)
```

#### **Error: JWT Invalid**
```bash
# Síntoma: Todos los tokens fallan
# Causa: JWT_SECRET cambió o no está configurado
# Solución:
# 1. Verificar JWT_SECRET en variables de entorno
# 2. Asegurar que es el mismo en todos los deployments
# 3. Regenerar tokens si el secret cambió
```

### **Scripts de Diagnóstico**

#### **Check Environment**
```javascript
// scripts/check-env.js
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'NODE_ENV'
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  } else {
    console.log(`✅ ${envVar} is set`);
  }
});

console.log('🎉 All required environment variables are set');
```

#### **Database Connection Test**
```javascript
// scripts/test-db.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database connected successfully');
    console.log('Current time:', result.rows[0].now);
    client.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await pool.end();
  }
}

testConnection();
```

## 📈 Performance Optimization

### **Database Optimization**
```sql
-- Optimizar queries frecuentes
EXPLAIN ANALYZE SELECT * FROM "fcnolimit".usuarios WHERE correo = 'test@email.com';

-- Crear índices específicos
CREATE INDEX CONCURRENTLY idx_usuarios_correo_active 
ON "fcnolimit".usuarios (correo) WHERE active = true;

-- Estadísticas de consultas
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements 
ORDER BY mean_time DESC LIMIT 10;
```

### **Application Optimization**
```javascript
// Connection pooling optimizado
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 20,
  min: 5, // Mantener mínimo 5 conexiones abiertas
  acquire: 30000,
  idle: 10000
});

// Cleanup de recursos
process.on('SIGINT', async () => {
  console.log('Closing database pool...');
  await pool.end();
  process.exit(0);
});
```

## 🔄 Backup y Disaster Recovery

### **Backup Automático**
- **Render PostgreSQL**: Backups diarios automáticos
- **Retention**: 7 días en plan free, más en planes pagos
- **Point-in-time recovery**: Disponible en planes superiores

### **Manual Backup**
```bash
# Backup de esquema y datos
pg_dump -h dpg-d0ljklbuibrs73acq6rg-a.ohio-postgres.render.com \
        -U fcnolimit_user \
        -d fcnolimit \
        --no-password \
        > backup_$(date +%Y%m%d).sql

# Restore desde backup
psql -h your-host -U your-user -d your-db < backup_20250619.sql
```

## 📋 Checklist de Deployment

### **Pre-deployment**
- [ ] Variables de entorno configuradas
- [ ] JWT_SECRET generado y seguro
- [ ] CORS_ORIGIN incluye dominio de producción
- [ ] Base de datos migrada y con datos iniciales
- [ ] Health check endpoint funcionando

### **Post-deployment**
- [ ] Health check retorna status "healthy"
- [ ] Login/register funcionando desde frontend
- [ ] Logs sin errores críticos
- [ ] Performance dentro de límites aceptables
- [ ] HTTPS funcionando correctamente

---

## 🚀 Próximas Mejoras de Deployment

1. **CI/CD Pipeline** - GitHub Actions para testing automático
2. **Staging Environment** - Ambiente de pruebas
3. **Container Deployment** - Docker containers
4. **Load Balancing** - Múltiples instancias
5. **CDN Integration** - Para archivos estáticos
6. **Monitoring Avanzado** - APM tools
7. **Auto-scaling** - Escalado automático

---
*Última actualización: $(new Date().toLocaleDateString())*
