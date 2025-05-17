const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Pool } = require('pg');

const app = express();
const port = 3001;

app.use(cors({
  origin: 'http://localhost:8100',
  credentials: true,
}));
app.use(express.json());
//dasjdasjdasjdjasdjasjdajsdjasdjasdjasjdajsd
// Configuración de la conexión a PostgreSQL usando variable de entorno
const pool = new Pool({
  user: 'postgres',
  host: '34.176.63.152',
  database: 'postgres',
  password: process.env.DB_PASSWORD, // <-- variable de entorno
  port: 5432,
});

// Verificar la contraseña de la base de datos en el inicio
console.log('DB_PASSWORD:', process.env.DB_PASSWORD, '| Tipo:', typeof process.env.DB_PASSWORD);

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

app.listen(port, () => {
  console.log(`Servidor backend escuchando en http://localhost:${port}`);
});


module.exports = (pool) => router;