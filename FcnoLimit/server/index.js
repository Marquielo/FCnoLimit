// index.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3001;

app.use(cors({
  origin: 'http://localhost:8100',
  credentials: true,
}));
app.use(express.json());

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: '34.176.63.152', 
  database: 'postgres',
  password: 'PS,a.~QQ@skk#N>O', 
  port: 5432,
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