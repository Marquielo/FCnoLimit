const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');
const { tokenHeaderValidation } = require('../validations/authValidation');
const { ligaValidation } = require('../validations/ligaValidation');
const { validationResult } = require('express-validator');

module.exports = (pool) => {
  // Obtener todas las ligas (público)
  router.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "fcnoLimit".ligas');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Crear liga (solo admin, con validación de header Authorization)
  router.post(
    '/',
    tokenHeaderValidation,
    ligaValidation,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
    authenticateToken,
    isAdmin,
    async (req, res) => {
      const { nombre, descripcion, temporada, campeonato_id } = req.body;
      try {
        const result = await pool.query(
          'INSERT INTO "fcnoLimit".ligas (nombre, descripcion, temporada, campeonato_id) VALUES ($1, $2, $3, $4) RETURNING *',
          [nombre, descripcion, temporada, campeonato_id]
        );
        res.status(201).json(result.rows[0]);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // Actualizar liga (solo admin, con validación de header Authorization)
  router.put(
    '/:id',
    tokenHeaderValidation,
    ligaValidation,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
    authenticateToken,
    isAdmin,
    async (req, res) => {
      const { id } = req.params;
      const { nombre, descripcion, temporada, campeonato_id } = req.body;
      try {
        const result = await pool.query(
          'UPDATE "fcnoLimit".ligas SET nombre=$1, descripcion=$2, temporada=$3, campeonato_id=$4 WHERE id=$5 RETURNING *',
          [nombre, descripcion, temporada, campeonato_id, id]
        );
        res.json(result.rows[0]);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // Eliminar liga (solo admin, con validación de header Authorization)
  router.delete(
    '/:id',
    tokenHeaderValidation,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
    authenticateToken,
    isAdmin,
    async (req, res) => {
      const { id } = req.params;
      try {
        await pool.query('DELETE FROM "fcnoLimit".ligas WHERE id=$1', [id]);
        res.json({ message: 'Liga eliminada' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  return router;
};