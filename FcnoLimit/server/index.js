const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

// Cargar variables de entorno
// Primero intenta .env (desarrollo local)
require('dotenv').config();

// Si está en producción, también carga env.yaml (Render)
if (process.env.NODE_ENV === 'production') {
  try {
    require('dotenv-yaml').config({ path: 'env.yaml' });
    console.log('📄 Variables cargadas desde env.yaml');
  } catch (error) {
    console.log('⚠️  env.yaml no encontrado, usando variables de entorno del sistema');
  }
}

const app = express();
const port = process.env.PORT || 3001;

console.log('🚀 Iniciando servidor FCnoLimit...');
console.log('📍 Entorno:', process.env.NODE_ENV || 'development');
console.log('🌐 Puerto:', port);

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : [
      'http://localhost:5000',
      'http://localhost:8100',
      'https://fcnolimit.firebaseapp.com',
      'https://fcnolimit.web.app'
    ];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());

// Configuración optimizada para PostgreSQL en Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  ssl: process.env.NODE_ENV === 'production' ? { 
    rejectUnauthorized: false,
    sslmode: 'require'
  } : false,
  // Configuraciones específicas para Render
  max: parseInt(process.env.DB_POOL_SIZE) || 20, // Número máximo de conexiones en el pool
  idleTimeoutMillis: 30000, // Tiempo antes de cerrar conexiones inactivas
  connectionTimeoutMillis: 5000, // Tiempo máximo para establecer conexión
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
  // Configuraciones adicionales para estabilidad
  statement_timeout: false,
  query_timeout: false,
  application_name: 'FCnoLimit-Backend',
});

console.log('🔧 Configurando pool de conexiones PostgreSQL...');
console.log('📊 Pool máximo:', parseInt(process.env.DB_POOL_SIZE) || 20);
console.log('🔒 SSL habilitado:', process.env.NODE_ENV === 'production');

// Manejo de errores de conexión
pool.on('error', (err, client) => {
  console.error('Error inesperado en el cliente de la base de datos', err);
  process.exit(-1);
});

// Verificar conexión inicial con retry
const connectWithRetry = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      console.log('✅ Conexión a PostgreSQL (Render) exitosa');
        // Verificar que las tablas principales existan
      const tablesCheck = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'fcnolimit' 
        AND table_name IN ('usuarios', 'equipos', 'jugadores', 'partidos')
      `);
      
      console.log('📋 Tablas encontradas:', tablesCheck.rows.length);
      client.release();
      return true;
    } catch (err) {
      console.error(`❌ Intento ${i + 1}/${retries} falló:`, err.message);
      if (i === retries - 1) {
        console.error('💥 Error crítico al conectar a PostgreSQL');
        console.error('📝 Verifica las variables de entorno de la base de datos');
        throw err;
      }
      // Esperar antes del siguiente intento
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
};

// Inicializar conexión
connectWithRetry().catch(err => {
  console.error('🚨 No se pudo establecer conexión con la base de datos');
  process.exit(1);
});

// Endpoint de prueba
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// Endpoint para probar conexión a la base de datos en Render
app.get('/api/dbtest', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW(), version() as db_version');
    const poolStats = await client.query('SELECT count(*) as total_connections FROM pg_stat_activity WHERE datname = current_database()');
    
    client.release();
    
    res.json({ 
      connected: true, 
      timestamp: result.rows[0].now,
      database_version: result.rows[0].db_version,
      total_connections: poolStats.rows[0].total_connections,
      host: process.env.DB_HOST || 'Render PostgreSQL',
      database: process.env.DB_NAME || 'fcnolimit_db',
      pool_size: pool.totalCount,
      idle_connections: pool.idleCount,
      waiting_requests: pool.waitingCount,
      status: '🚀 Render PostgreSQL connection successful',
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (err) {
    console.error('Database test error:', err);
    res.status(500).json({ 
      connected: false, 
      error: err.message,
      status: '❌ Render PostgreSQL connection failed',
      timestamp: new Date().toISOString()
    });  }
});

// Endpoint de health check para monitoreo
app.get('/api/health', async (req, res) => {
  try {
    // Verificar conexión a la base de datos
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      environment: process.env.NODE_ENV || 'development',
      version: '2.0.0-refresh-tokens',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      features: ['refresh-tokens', 'jwt-auth', 'postgresql']
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message,
      environment: process.env.NODE_ENV || 'development'
    });
  }
});

// Importar y usar rutas
app.use('/api/campeonatos', require('./routes/campeonatos')(pool));
app.use('/api/usuarios', require('./routes/usuarios')(pool));
app.use('/api/auth', require('./routes/auth')(pool)); // Nueva ruta de autenticación avanzada
app.use('/api/oauth', require('./routes/googleAuth')(pool)); // Google OAuth - con pool
app.use('/api/ligas', require('./routes/ligas')(pool));
app.use('/api/equipos', require('./routes/equipos')(pool));
app.use('/api/jugadores', require('./routes/jugadores')(pool));
app.use('/api/partidos', require('./routes/partidos')(pool));
app.use('/api/estadisticas_partido', require('./routes/estadisticasPartido')(pool));
app.use('/api/estadisticas_jugador_partido', require('./routes/estadisticasJugadorPartido')(pool));
app.use('/api/solicitudes', require('./routes/solicitudes')(pool));

app.use('/api/divisiones', require('./routes/divisiones')(pool));
app.use('/api/copas', require('./routes/copas')(pool));
app.use('/api/asociaciones', require('./routes/asociaciones')(pool));
app.use('/api/estadios', require('./routes/estadios')(pool));
app.use('/equipos', express.static(path.join(__dirname, 'public/equipos')));
app.use('/api/vistas', require('./routes/vistas_tablas')(pool));

const PORT = process.env.PORT || 3001;

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM recibido. Cerrando servidor gracefully...');
  pool.end().then(() => {
    console.log('📊 Pool de conexiones cerrado');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT recibido. Cerrando servidor gracefully...');
  pool.end().then(() => {
    console.log('📊 Pool de conexiones cerrado');    process.exit(0);
  });
});

// Configurar tareas programadas después de que todo esté listo
const { setupScheduledTasks } = require('./utils/scheduledTasks');

app.listen(port, () => {
  console.log(`🌟 Servidor FCnoLimit ejecutándose en puerto ${port}`);
  console.log(`🔗 Health check: http://localhost:${port}/api/ping`);
  console.log(`🔗 DB test: http://localhost:${port}/api/dbtest`);
  
  // Inicializar tareas programadas después de que el servidor esté corriendo
  console.log('🚀 Inicializando sistema de refresh tokens...');
  setupScheduledTasks(pool);
});

// Exportar pool para uso en rutas
module.exports = pool;