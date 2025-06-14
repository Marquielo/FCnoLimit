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

  // Obtener partidos jugados (público)
  router.get('/jugados', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "fcnolimit".v_historial_partidos');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Obtener partidos pendientes (público)
  router.get('/pendientes', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "fcnolimit".v_partidos_por_jugar');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Obtener partidos pendientes por equipo (público)
  router.get('/pendientes/equipo/:equipo_id', async (req, res) => {
    const { equipo_id } = req.params;
    try {
      const result = await pool.query(
        `SELECT * FROM "fcnolimit".v_partidos_por_jugar_equipo WHERE equipo_local_id = $1 OR equipo_visitante_id = $1`,
        [equipo_id]
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Obtener partidos pendientes por división (público)
  router.get('/pendientes/division/:division_equipo_id/:division_id', async (req, res) => {
    const { division_equipo_id, division_id } = req.params;
    try {
      const result = await pool.query(
        `SELECT * FROM "fcnolimit".v_partidos_por_jugar WHERE division_equipo_id = $1 AND division_id = $2`,
        [division_equipo_id, division_id]
      );
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
        fecha, estadio, liga_id, administrador_id, estado, jugado_en,
        division_id, division_equipo_id
      } = req.body;
      try {
        const result = await pool.query(
          `INSERT INTO "fcnolimit".partidos
          (equipo_local_id, equipo_visitante_id, goles_local, goles_visitante, fecha, estadio, liga_id, administrador_id, estado, jugado_en, division_id, division_equipo_id)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
          [equipo_local_id, equipo_visitante_id, goles_local, goles_visitante, fecha, estadio, liga_id, administrador_id, estado, jugado_en, division_id, division_equipo_id]
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
        if (!result.rows[0]) {
          return res.status(404).json({ error: 'Partido no encontrado o no actualizado' });
        }
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

  // Buscar partidos por id, equipo_local_id, equipo_visitante_id o fecha (solo admin)
  router.get('/buscar', authenticateToken, isAdmin, async (req, res) => {
    const { id, equipo_local_id, equipo_visitante_id, fecha } = req.query;
    let query = 'SELECT * FROM "fcnolimit".partidos WHERE 1=1';
    const params = [];

    if (id) {
      params.push(id);
      query += ` AND id = $${params.length}`;
    }
    if (equipo_local_id) {
      params.push(equipo_local_id);
      query += ` AND equipo_local_id = $${params.length}`;
    }
    if (equipo_visitante_id) {
      params.push(equipo_visitante_id);
      query += ` AND equipo_visitante_id = $${params.length}`;
    }
    if (fecha) {
      params.push(fecha);
      query += ` AND fecha = $${params.length}`;
    }

    try {
      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Ruta rápida para actualizar solo goles y estado de un partido (admin)
  router.patch(
    '/:id/resultado',
    tokenHeaderValidation,
    authenticateToken,
    isAdmin,
    async (req, res) => {
      const { id } = req.params;
      const { goles_local, goles_visitante, estado } = req.body;
      if (typeof goles_local !== 'number' || typeof goles_visitante !== 'number' || !estado) {
        return res.status(400).json({ error: 'Datos incompletos o inválidos' });
      }
      try {
        const result = await pool.query(
          `UPDATE "fcnolimit".partidos SET goles_local=$1, goles_visitante=$2, estado=$3 WHERE id=$4 RETURNING *`,
          [goles_local, goles_visitante, estado, id]
        );
        if (!result.rows[0]) {
          return res.status(404).json({ error: 'Partido no encontrado o no actualizado' });
        }
        res.json(result.rows[0]);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // Ruta para actualizar solo la fecha de un partido (admin)
  router.patch(
    '/:id/fecha',
    tokenHeaderValidation,
    authenticateToken,
    isAdmin,
    async (req, res) => {
      const { id } = req.params;
      const { fecha } = req.body;
      if (!fecha) {
        return res.status(400).json({ error: 'Fecha requerida' });
      }
      try {
        const result = await pool.query(
          `UPDATE "fcnolimit".partidos SET fecha=$1 WHERE id=$2 RETURNING *`,
          [fecha, id]
        );
        if (!result.rows[0]) {
          return res.status(404).json({ error: 'Partido no encontrado o no actualizado' });
        }
        res.json(result.rows[0]);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // Endpoint para obtener el detalle de partidos jugados con nombres de división y división equipo
  router.get('/jugados/detalle', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "fcnolimit".v_partidos_jugados_detalle');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Obtener el último partido jugado de un equipo (público)
  router.get('/jugados/ultimo/:equipo_id', async (req, res) => {
    const { equipo_id } = req.params;
    try {
      const result = await pool.query(
        `SELECT p.*, el.imagen_url AS imagen_local, el.nombre AS nombre_local, ev.imagen_url AS imagen_visitante, ev.nombre AS nombre_visitante, d.nombre AS division_nombre
         FROM fcnolimit.partidos p
         JOIN fcnolimit.equipos el ON p.equipo_local_id = el.id
         JOIN fcnolimit.equipos ev ON p.equipo_visitante_id = ev.id
         LEFT JOIN fcnolimit.divisiones d ON p.division_id = d.id
         WHERE (p.equipo_local_id = $1 OR p.equipo_visitante_id = $1)
           AND p.estado = 'jugado'
         ORDER BY p.fecha DESC
         LIMIT 1`,
        [equipo_id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'No se encontró partido jugado para ese equipo' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Obtener el partido pendiente más próximo de un equipo (público)
  router.get('/pendientes/proximo/:equipo_id', async (req, res) => {
    const { equipo_id } = req.params;
    try {
      const result = await pool.query(
        `SELECT p.*, el.imagen_url AS imagen_local, el.nombre AS nombre_local, ev.imagen_url AS imagen_visitante, ev.nombre AS nombre_visitante, d.nombre AS division_nombre
         FROM fcnolimit.partidos p
         JOIN fcnolimit.equipos el ON p.equipo_local_id = el.id
         JOIN fcnolimit.equipos ev ON p.equipo_visitante_id = ev.id
         LEFT JOIN fcnolimit.divisiones d ON p.division_id = d.id
         WHERE (p.equipo_local_id = $1 OR p.equipo_visitante_id = $1)
           AND p.estado = 'pendiente'
           AND p.fecha >= NOW()
         ORDER BY p.fecha ASC
         LIMIT 1`,
        [equipo_id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'No se encontró partido pendiente para ese equipo' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};