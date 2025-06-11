const express = require('express');
const router = express.Router();

// Endpoint para obtener todas las inscripciones
router.get('/inscripciones', async (req, res) => {
  try {
    const result = await req.app.get('pool').query('SELECT * FROM fcnolimit.solicitud_inscripcion');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Puedes agregar más endpoints aquí para crear, actualizar o eliminar solicitudes

module.exports = router;
