const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');
const { campeonatoValidation } = require('../validations/campeonatoValidation');
const { tokenHeaderValidation } = require('../validations/authValidation');
const { validationResult } = require('express-validator');

module.exports = (pool) => {
  // Obtener todos los campeonatos (público)
  router.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "fcnolimit".campeonatos');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Insertar un campeonato (solo admin)
  router.post(
    '/',
    tokenHeaderValidation,
    campeonatoValidation,
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
      const { nombre, descripcion, fecha_inicio, fecha_fin } = req.body;
      try {
        const result = await pool.query(
          'INSERT INTO "fcnolimit".campeonatos (nombre, descripcion, fecha_inicio, fecha_fin) VALUES ($1, $2, $3, $4) RETURNING *',
          [nombre, descripcion, fecha_inicio, fecha_fin]
        );
        res.status(201).json(result.rows[0]);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // Actualizar un campeonato (solo admin)
  router.put(
    '/:id',
    tokenHeaderValidation,
    campeonatoValidation,
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
      const { nombre, descripcion, fecha_inicio, fecha_fin } = req.body;
      try {
        const result = await pool.query(
          'UPDATE "fcnolimit".campeonatos SET nombre=$1, descripcion=$2, fecha_inicio=$3, fecha_fin=$4 WHERE id=$5 RETURNING *',
          [nombre, descripcion, fecha_inicio, fecha_fin, id]
        );
        res.json(result.rows[0]);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // Eliminar un campeonato (solo admin)
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
        await pool.query('DELETE FROM "fcnolimit".campeonatos WHERE id=$1', [id]);
        res.json({ message: 'Campeonato eliminado' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  return router;
};