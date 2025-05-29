const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  // GET /api/estadios/vista
  router.get('/vista', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "fcnolimit".v_estadios');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};