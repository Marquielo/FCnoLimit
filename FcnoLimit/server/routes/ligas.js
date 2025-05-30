const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

module.exports = (pool) => {
  // Obtener todas las ligas (público)
  router.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "fcnolimit".ligas');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Crear liga (solo admin)
  router.post('/', authenticateToken, isAdmin, async (req, res) => {
    const { nombre, descripcion, temporada, campeonato_id } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO "fcnolimit".ligas (nombre, descripcion, temporada, campeonato_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [nombre, descripcion, temporada, campeonato_id]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Actualizar liga (solo admin)
  router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, temporada, campeonato_id } = req.body;
    try {
      const result = await pool.query(
        'UPDATE "fcnolimit".ligas SET nombre=$1, descripcion=$2, temporada=$3, campeonato_id=$4 WHERE id=$5 RETURNING *',
        [nombre, descripcion, temporada, campeonato_id, id]
      );
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Eliminar liga (solo admin)
  router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM "fcnolimit".ligas WHERE id=$1', [id]);
      res.json({ message: 'Liga eliminada' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Buscar ligas por id, nombre, descripcion o temporada (solo admin)
  router.get('/buscar', authenticateToken, isAdmin, async (req, res) => {
    const { id, nombre, descripcion, temporada } = req.query;
    let query = 'SELECT * FROM "fcnolimit".ligas WHERE 1=1';
    const params = [];

    if (id) {
      params.push(id);
      query += ` AND id = $${params.length}`;
    }
    if (nombre) {
      params.push(`%${nombre}%`);
      query += ` AND nombre ILIKE $${params.length}`;
    }
    if (descripcion) {
      params.push(`%${descripcion}%`);
      query += ` AND descripcion ILIKE $${params.length}`;
    }
    if (temporada) {
      params.push(temporada);
      query += ` AND temporada = $${params.length}`;
    }

    try {
      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/ligas/vista
  router.get('/vista', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "fcnolimit".v_ligas');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/ligas/campeonatos
  router.get('/campeonatos', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "fcnolimit".v_ligas_campeonatos');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};