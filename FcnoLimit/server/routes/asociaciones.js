// GET /api/asociaciones/comunal
router.get('/comunal', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "fcnolimit".v_asociacion_futbol_comunal');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/asociaciones/regional
router.get('/regional', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "fcnolimit".v_asociacion_futbol_regional');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/asociaciones/nacional
router.get('/nacional', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "fcnolimit".v_asociacion_futbol_nacional');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/asociaciones/internacional
router.get('/internacional', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "fcnolimit".v_asociacion_futbol_internacional');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});