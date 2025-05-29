const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  // GET /api/divisiones/equipos
  router.get('/equipos', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "fcnolimit".v_divisiones_equipos');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};