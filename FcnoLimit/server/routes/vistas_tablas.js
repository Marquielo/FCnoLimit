const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  // Endpoint para obtener la vista de tabla de posiciones filtrada
  router.get('/tabla-posiciones/division-equipo', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM fcnolimit.v_tabla_posiciones_division_equipo');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
