const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');
const { jugadorValidation } = require('../validations/jugadorValidation');
const { validationResult } = require('express-validator');
const { tokenHeaderValidation } = require('../validations/authValidation');

module.exports = (pool) => {
  // Obtener todos los jugadores (público)
  router.get('/jugadores', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "fcnoLimit".jugadores');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Crear jugador (solo admin)
  router.post(
    '/jugadores',
    tokenHeaderValidation,
    jugadorValidation,
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
      const { usuario_id, equipo_id, posicion, dorsal, imagen_url } = req.body;
      try {
        const result = await pool.query(
          'INSERT INTO "fcnoLimit".jugadores (usuario_id, equipo_id, posicion, dorsal, imagen_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [usuario_id, equipo_id, posicion, dorsal, imagen_url]
        );
        res.status(201).json(result.rows[0]);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // Actualizar jugador (solo admin)
  router.put(
    '/jugadores/:id',
    tokenHeaderValidation,
    jugadorValidation,
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
      const { usuario_id, equipo_id, posicion, dorsal, imagen_url } = req.body;
      try {
        const result = await pool.query(
          'UPDATE "fcnoLimit".jugadores SET usuario_id=$1, equipo_id=$2, posicion=$3, dorsal=$4, imagen_url=$5 WHERE id=$6 RETURNING *',
          [usuario_id, equipo_id, posicion, dorsal, imagen_url, id]
        );
        res.json(result.rows[0]);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // Eliminar jugador (solo admin)
  router.delete(
    '/jugadores/:id',
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
        await pool.query('DELETE FROM "fcnoLimit".jugadores WHERE id=$1', [id]);
        res.json({ message: 'Jugador eliminado' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  return router;
};
