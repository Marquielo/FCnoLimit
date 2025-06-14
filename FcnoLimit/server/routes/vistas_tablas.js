const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  // Endpoint para obtener la vista de tabla de posiciones filtrada
  // GET /api/vistas/tabla-posiciones/division-equipo?division_id=6&division_equipo_id=1
  router.get('/tabla-posiciones/division-equipo', async (req, res) => {
    const { division_id, division_equipo_id } = req.query;
    if (!division_id || !division_equipo_id) {
      return res.status(400).json({ error: 'Faltan parámetros division_id o division_equipo_id' });
    }
    try {
      const result = await pool.query(
        `SELECT t.*, e.imagen_url
         FROM fcnolimit.tabla_posiciones t
         JOIN equipos e ON e.id = t.equipo_id
         WHERE t.division_id = $1 AND t.division_equipo_id = $2`,
        [division_id, division_equipo_id]
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
