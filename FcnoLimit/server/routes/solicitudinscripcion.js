// GET /api/solicitudes/vista
router.get('/vista', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "fcnolimit".v_solicitud_inscripcion');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});