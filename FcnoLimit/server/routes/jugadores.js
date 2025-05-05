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

  return router;
};