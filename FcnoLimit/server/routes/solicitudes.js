const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  // Endpoint para obtener todas las inscripciones
  router.get('/inscripciones', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM fcnolimit.v_solicitud_inscripcion');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Puedes agregar más endpoints aquí para crear, actualizar o eliminar solicitudes

  return router;
};
