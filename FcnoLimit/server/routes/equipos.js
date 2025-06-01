const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');
const { equipoValidation } = require('../validations/equipoValidation');
const { validationResult } = require('express-validator');

module.exports = (pool) => {
  // Obtener todos los equipos (público)
  router.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "fcnolimit".equipos');
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'No hay equipos registrados.' });
      }
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Crear equipo (solo admin)
  router.post('/', equipoValidation, authenticateToken, isAdmin, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }, async (req, res) => {
    const { nombre, categoria, liga_id, imagen_url } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO "fcnolimit".equipos (nombre, categoria, liga_id, imagen_url) VALUES ($1, $2, $3, $4) RETURNING *',
        [nombre, categoria, liga_id, imagen_url]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Actualizar equipo (solo admin)
  router.put('/:id', equipoValidation, authenticateToken, isAdmin, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }, async (req, res) => {
    const { id } = req.params;
    const { nombre, categoria, liga_id, imagen_url } = req.body;
    try {
      const result = await pool.query(
        'UPDATE "fcnolimit".equipos SET nombre=$1, categoria=$2, liga_id=$3, imagen_url=$4 WHERE id=$5 RETURNING *',
        [nombre, categoria, liga_id, imagen_url, id]
      );
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Eliminar equipo (solo admin)
  router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM "fcnolimit".equipos WHERE id=$1', [id]);
      res.json({ message: 'Equipo eliminado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Buscar equipos por id, nombre, categoria o liga_id (solo admin)
  router.get('/buscar', authenticateToken, async (req, res) => {
    const { id, nombre, categoria, liga_id } = req.query;
    let query = 'SELECT * FROM "fcnolimit".equipos WHERE 1=1';
    const params = [];

    if (id) {
      params.push(id);
      query += ` AND id = $${params.length}`;
    }
    if (nombre) {
      params.push(`%${nombre}%`);
      query += ` AND nombre ILIKE $${params.length}`;
    }
    if (categoria) {
      params.push(`%${categoria}%`);
      query += ` AND categoria ILIKE $${params.length}`;
    }
    if (liga_id) {
      params.push(liga_id);
      query += ` AND liga_id = $${params.length}`;
    }

    try {
      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Obtener jugadores por equipo_id
  router.get('/:equipo_id/jugadores', async (req, res) => {
    const { equipo_id } = req.params;
    try {
      const result = await pool.query(
        `SELECT * FROM "fcnolimit".llamar_jugadores_por_equipo WHERE equipo_id = $1`,
        [equipo_id]
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Obtener historial de partidos por equipo_id
  router.get('/:equipo_id/historial-partidos', async (req, res) => {
    const { equipo_id } = req.params;
    try {
      const result = await pool.query(
        `SELECT * FROM "fcnolimit".v_historial_partidos WHERE equipo_id = $1`,
        [equipo_id]
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Obtener partidos ganados por equipo_id
  router.get('/:equipo_id/ganados', async (req, res) => {
    const { equipo_id } = req.params;
    try {
      const result = await pool.query(
        `SELECT * FROM "fcnolimit".v_partidos_ganados WHERE equipo_id = $1`,
        [equipo_id]
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Obtener partidos perdidos por equipo_id
  router.get('/:equipo_id/perdidos', async (req, res) => {
    const { equipo_id } = req.params;
    try {
      const result = await pool.query(
        `SELECT * FROM "fcnolimit".v_partidos_perdidos WHERE equipo_id = $1`,
        [equipo_id]
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Obtener empates por equipo_id
  router.get('/:equipo_id/empates', async (req, res) => {
    const { equipo_id } = req.params;
    try {
      const result = await pool.query(
        `SELECT * FROM "fcnolimit".v_empates_equipo WHERE equipo_id = $1`,
        [equipo_id]
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Obtener divisiones de equipos
  router.get('/divisiones', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "fcnolimit".v_equipos_divisiones');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Obtener copas de equipos
  router.get('/copas', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "fcnolimit".v_equipos_copas');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};