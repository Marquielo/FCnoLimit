const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');
const { createUser, loginUser } = require('../controllers/logicUser');

module.exports = (pool) => {
  // Registro (público)
  router.post('/register', async (req, res) => {
    try {
      const user = await createUser(pool, req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Login (público)
  router.post('/login', async (req, res) => {
    try {
      const result = await loginUser(pool, req.body);
      if (!result) return res.status(401).json({ error: 'Credenciales inválidas' });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Obtener todos los usuarios (solo admin)
  router.get('/', authenticateToken, isAdmin, async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "fcnoLimit".usuarios');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Actualizar usuario (solo admin)
  router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { nombre_completo, correo, contraseña, rol } = req.body;
    try {
      const result = await pool.query(
        'UPDATE "fcnoLimit".usuarios SET nombre_completo=$1, correo=$2, contraseña=$3, rol=$4 WHERE id=$5 RETURNING *',
        [nombre_completo, correo, contraseña, rol, id]
      );
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Eliminar usuario (solo admin)
  router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM "fcnoLimit".usuarios WHERE id=$1', [id]);
      res.json({ message: 'Usuario eliminado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};