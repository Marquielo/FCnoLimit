const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');
const { jugadorValidation } = require('../validations/jugadorValidation');
const { validationResult } = require('express-validator');

module.exports = (pool) => {
  // Obtener todos los jugadores (público)
  router.get('/jugadores', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "fcnolimit".jugadores');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Crear jugador (solo admin)
  router.post('/jugadores', jugadorValidation, authenticateToken, isAdmin, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }, async (req, res) => {
    const { usuario_id, equipo_id, posicion, dorsal, imagen_url } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO "fcnolimit".jugadores (usuario_id, equipo_id, posicion, dorsal, imagen_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [usuario_id, equipo_id, posicion, dorsal, imagen_url]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Actualizar jugador (solo admin)
  router.put('/jugadores/:id', jugadorValidation, authenticateToken, isAdmin, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }, async (req, res) => {
    const { id } = req.params;
    const { usuario_id, equipo_id, posicion, dorsal, imagen_url } = req.body;
    try {
      const result = await pool.query(
        'UPDATE "fcnolimit".jugadores SET usuario_id=$1, equipo_id=$2, posicion=$3, dorsal=$4, imagen_url=$5 WHERE id=$6 RETURNING *',
        [usuario_id, equipo_id, posicion, dorsal, imagen_url, id]
      );
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Eliminar jugador (solo admin)
  router.delete('/jugadores/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM "fcnolimit".jugadores WHERE id=$1', [id]);
      res.json({ message: 'Jugador eliminado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Buscar jugadores por id, usuario_id, equipo_id, posicion o nombre (público)
  router.get('/buscar', async (req, res) => {
    const { id, usuario_id, equipo_id, posicion, nombre } = req.query;
    let query = 'SELECT * FROM "fcnolimit".jugadores WHERE 1=1';
    const params = [];

    if (id) {
      params.push(id);
      query += ` AND id = $${params.length}`;
    }
    if (usuario_id) {
      params.push(usuario_id);
      query += ` AND usuario_id = $${params.length}`;
    }
    if (equipo_id) {
      params.push(equipo_id);
      query += ` AND equipo_id = $${params.length}`;
    }
    if (posicion) {
      params.push(`%${posicion}%`);
      query += ` AND posicion ILIKE $${params.length}`;
    }
    if (nombre) {
      params.push(`%${nombre}%`);
      // Búsqueda insensible a tildes y mayúsculas/minúsculas
      query += ` AND unaccent(lower(nombre_completo)) ILIKE unaccent(lower($${params.length}))`;
    }

    try {
      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Obtener todos los partidos (público)
  router.get('/partidos', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "fcnolimit".partidos');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Crear partido (solo admin)
  router.post('/partidos', authenticateToken, isAdmin, async (req, res) => {
    const {
      equipo_local_id, equipo_visitante_id, goles_local, goles_visitante,
      fecha, estadio, liga_id, administrador_id, estado, jugado_en
    } = req.body;
    try {
      const result = await pool.query(
        `INSERT INTO "fcnolimit".partidos
        (equipo_local_id, equipo_visitante_id, goles_local, goles_visitante, fecha, estadio, liga_id, administrador_id, estado, jugado_en)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
        [equipo_local_id, equipo_visitante_id, goles_local, goles_visitante, fecha, estadio, liga_id, administrador_id, estado, jugado_en]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Actualizar partido (solo admin)
  router.put('/partidos/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const {
      equipo_local_id, equipo_visitante_id, goles_local, goles_visitante,
      fecha, estadio, liga_id, administrador_id, estado, jugado_en
    } = req.body;
    try {
      const result = await pool.query(
        `UPDATE "fcnolimit".partidos SET
        equipo_local_id=$1, equipo_visitante_id=$2, goles_local=$3, goles_visitante=$4,
        fecha=$5, estadio=$6, liga_id=$7, administrador_id=$8, estado=$9, jugado_en=$10
        WHERE id=$11 RETURNING *`,
        [equipo_local_id, equipo_visitante_id, goles_local, goles_visitante, fecha, estadio, liga_id, administrador_id, estado, jugado_en, id]
      );
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Eliminar partido (solo admin)
  router.delete('/partidos/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM "fcnolimit".partidos WHERE id=$1', [id]);
      res.json({ message: 'Partido eliminado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Obtener todos los jugadores fichados (público)
  router.get('/fichados', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "fcnolimit".llamar_all_jugadores_fichados');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Obtener jugadores por equipo y división (público)
  router.get('/equipo/:equipo_id/division/:id_division', async (req, res) => {
    const { equipo_id, id_division } = req.params;
    try {
      const result = await pool.query(
        'SELECT * FROM fcnolimit.obtener_jugadores_equipo_y_division_directo($1, $2)',
        [equipo_id, id_division]
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/jugadores/:jugador_id (debe ir después de las rutas más específicas)
  router.get('/:jugador_id', async (req, res) => {
    const { jugador_id } = req.params;
    try {
      const result = await pool.query(
        `SELECT * FROM "fcnolimit".vista_detalle_jugador WHERE jugador_id = $1`,
        [jugador_id]
      );
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Sumar goles a varios jugadores (admin)
  router.post('/sumar-goles-masivo', authenticateToken, isAdmin, async (req, res) => {
    const { golesPorJugador } = req.body; // [{ jugador_id, cantidad_goles }]
    if (!Array.isArray(golesPorJugador)) {
      return res.status(400).json({ error: 'Formato inválido, se espera un array golesPorJugador' });
    }
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const item of golesPorJugador) {
        if (!item.jugador_id || typeof item.cantidad_goles !== 'number') continue;
        await client.query(
          'UPDATE "fcnolimit".jugadores SET goles = COALESCE(goles,0) + $1 WHERE id = $2',
          [item.cantidad_goles, item.jugador_id]
        );
      }
      await client.query('COMMIT');
      res.json({ message: 'Goles actualizados correctamente' });
    } catch (error) {
      await client.query('ROLLBACK');
      res.status(500).json({ error: error.message });
    } finally {
      client.release();
    }
  });

  return router;
};