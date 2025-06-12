const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

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
// Configuración de la conexión a PostgreSQL usando variable de entorno
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

// Verificar la contraseña de la base de datos en el inicio
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);

pool.connect()
  .then(() => console.log('Conexión a PostgreSQL exitosa'))
  .catch(err => {
    console.error('Error al conectar a PostgreSQL:', err);
    // NO hagas process.exit(1);
  });

// Endpoint de prueba
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// Endpoint para probar conexión a la base de datos en la nube
app.get('/api/dbtest', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ connected: true, time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ connected: false, error: err.message });
  }
});

// Importar y usar rutas
app.use('/api/campeonatos', require('./routes/campeonatos')(pool));
app.use('/api/usuarios', require('./routes/usuarios')(pool));
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

const PORT = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});


module.exports = (pool) => router;