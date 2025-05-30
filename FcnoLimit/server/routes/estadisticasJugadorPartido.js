const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');
const { estadisticasJugadorPartidoValidation } = require('../validations/estadisticasJugadorPartidoValidation');
const { validationResult } = require('express-validator');

module.exports = (pool) => {
  // Obtener todas las estadísticas de jugador en partido (público)
  router.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "fcnolimit".estadisticas_jugador_partido');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Crear estadística de jugador en partido (solo admin)
  router.post('/', estadisticasJugadorPartidoValidation, authenticateToken, isAdmin, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }, async (req, res) => {
    const {
      partido_id, jugador_id, goles, asistencias, tarjetas_amarillas,
      tarjetas_rojas, faltas_cometidas, pases_completados, minutos_jugados
    } = req.body;
    try {
      const result = await pool.query(
        `INSERT INTO "fcnolimit".estadisticas_jugador_partido
        (partido_id, jugador_id, goles, asistencias, tarjetas_amarillas, tarjetas_rojas, faltas_cometidas, pases_completados, minutos_jugados)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
        [partido_id, jugador_id, goles, asistencias, tarjetas_amarillas, tarjetas_rojas, faltas_cometidas, pases_completados, minutos_jugados]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Actualizar estadística de jugador en partido (solo admin)
  router.put('/:id', estadisticasJugadorPartidoValidation, authenticateToken, isAdmin, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }, async (req, res) => {
    const { id } = req.params;
    const {
      partido_id, jugador_id, goles, asistencias, tarjetas_amarillas,
      tarjetas_rojas, faltas_cometidas, pases_completados, minutos_jugados
    } = req.body;
    try {
      const result = await pool.query(
        `UPDATE "fcnolimit".estadisticas_jugador_partido SET
        partido_id=$1, jugador_id=$2, goles=$3, asistencias=$4, tarjetas_amarillas=$5,
        tarjetas_rojas=$6, faltas_cometidas=$7, pases_completados=$8, minutos_jugados=$9
        WHERE id=$10 RETURNING *`,
        [partido_id, jugador_id, goles, asistencias, tarjetas_amarillas, tarjetas_rojas, faltas_cometidas, pases_completados, minutos_jugados, id]
      );
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Eliminar estadística de jugador en partido (solo admin)
  router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM "fcnolimit".estadisticas_jugador_partido WHERE id=$1', [id]);
      res.json({ message: 'Estadística de jugador en partido eliminada' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Buscar estadísticas de jugador por id, partido_id o jugador_id (solo admin)
  router.get('/buscar', authenticateToken, isAdmin, async (req, res) => {
    const { id, partido_id, jugador_id } = req.query;
    let query = 'SELECT * FROM "fcnolimit".estadisticas_jugador WHERE 1=1';
    const params = [];

    if (id) {
      params.push(id);
      query += ` AND id = $${params.length}`;
    }
    if (partido_id) {
      params.push(partido_id);
      query += ` AND partido_id = $${params.length}`;
    }
    if (jugador_id) {
      params.push(jugador_id);
      query += ` AND jugador_id = $${params.length}`;
    }

    try {
      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Obtener estadísticas de jugador (vista)
  router.get('/jugador', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "fcnolimit".v_estadisticas_jugador');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Obtener estadísticas de jugador en partido (vista)
  router.get('/jugador-partido', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "fcnolimit".v_estadisticas_jugador_partido');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};