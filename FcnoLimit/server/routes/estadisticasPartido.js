const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

module.exports = (pool) => {
  // Obtener todas las estadísticas de partido (público)
  router.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "fcnolimit".estadisticas_partido');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Crear estadística de partido (solo admin)
  router.post('/', authenticateToken, isAdmin, async (req, res) => {
    const {
      partido_id, equipo_id, posesion, tiros_totales, tiros_a_puerta, faltas,
      tarjetas_amarillas, tarjetas_rojas, saques_de_esquina, fueras_de_juego,
      pases_completados, atajadas, cambios_realizados
    } = req.body;
    try {
      const result = await pool.query(
        `INSERT INTO "fcnolimit".estadisticas_partido
        (partido_id, equipo_id, posesion, tiros_totales, tiros_a_puerta, faltas, tarjetas_amarillas, tarjetas_rojas, saques_de_esquina, fueras_de_juego, pases_completados, atajadas, cambios_realizados)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
        [partido_id, equipo_id, posesion, tiros_totales, tiros_a_puerta, faltas, tarjetas_amarillas, tarjetas_rojas, saques_de_esquina, fueras_de_juego, pases_completados, atajadas, cambios_realizados]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Actualizar estadística de partido (solo admin)
  router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const {
      partido_id, equipo_id, posesion, tiros_totales, tiros_a_puerta, faltas,
      tarjetas_amarillas, tarjetas_rojas, saques_de_esquina, fueras_de_juego,
      pases_completados, atajadas, cambios_realizados
    } = req.body;
    try {
      const result = await pool.query(
        `UPDATE "fcnolimit".estadisticas_partido SET
        partido_id=$1, equipo_id=$2, posesion=$3, tiros_totales=$4, tiros_a_puerta=$5, faltas=$6,
        tarjetas_amarillas=$7, tarjetas_rojas=$8, saques_de_esquina=$9, fueras_de_juego=$10,
        pases_completados=$11, atajadas=$12, cambios_realizados=$13
        WHERE id=$14 RETURNING *`,
        [partido_id, equipo_id, posesion, tiros_totales, tiros_a_puerta, faltas, tarjetas_amarillas, tarjetas_rojas, saques_de_esquina, fueras_de_juego, pases_completados, atajadas, cambios_realizados, id]
      );
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Eliminar estadística de partido (solo admin)
  router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM "fcnolimit".estadisticas_partido WHERE id=$1', [id]);
      res.json({ message: 'Estadística de partido eliminada' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Buscar estadísticas de partido por id, partido_id o equipo_id (solo admin)
  router.get('/buscar', authenticateToken, isAdmin, async (req, res) => {
    const { id, partido_id, equipo_id } = req.query;
    let query = 'SELECT * FROM "fcnolimit".estadisticas_partido WHERE 1=1';
    const params = [];

    if (id) {
      params.push(id);
      query += ` AND id = $${params.length}`;
    }
    if (partido_id) {
      params.push(partido_id);
      query += ` AND partido_id = $${params.length}`;
    }
    if (equipo_id) {
      params.push(equipo_id);
      query += ` AND equipo_id = $${params.length}`;
    }

    try {
      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Obtener estadísticas de partido (vista) (público)
  router.get('/partido', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "fcnolimit".v_estadisticas_partido');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Obtener goles por jugador y partido (vista) (público)
  router.get('/goles-jugador-partido', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "fcnolimit".v_goles_jugador_partido');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Obtener historial de jugadores y equipos (público)
  router.get('/historial', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "fcnolimit".v_historial_jugadores_equipos');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};