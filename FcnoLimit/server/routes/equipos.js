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

  return router;
};