// index.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'fcnolimit',
  password: 'familytrading',
  port: 5432,
});

// Ruta de prueba
app.get('/api/ping', (req, res) => {
  res.json({ message: 'Servidor funcionando' });
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
