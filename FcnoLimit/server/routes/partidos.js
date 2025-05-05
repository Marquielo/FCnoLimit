const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');
const { tokenHeaderValidation } = require('../validations/authValidation');
const { body, validationResult } = require('express-validator');

module.exports = (pool) => {
  // Obtener todos los partidos (público)
  router.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "fcnolimit".partidos');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Obtener un partido específico por ID (público)
  router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('SELECT * FROM "fcnolimit".partidos WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Partido no encontrado' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Crear partido (solo admin, con validación de header Authorization)
  router.post(
    '/',
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
    }
  );

  // Actualizar partido (solo admin, con validación de header Authorization)
  router.put(
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
    }
  );

  // Eliminar partido (solo admin, con validación de header Authorization)
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
        await pool.query('DELETE FROM "fcnolimit".partidos WHERE id=$1', [id]);
        res.json({ message: 'Partido eliminado' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  return router;
};