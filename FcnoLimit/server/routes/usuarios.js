const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');
const { createUser, loginUser } = require('../controllers/logicUser');
const bcrypt = require('bcrypt');

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
  router.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "fcnolimit".usuarios');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Buscar usuario por id, nombre, correo o rol (solo admin)
  router.get('/buscar', authenticateToken, isAdmin, async (req, res) => {
    const { id, nombre, correo, rol } = req.query;
    let query = 'SELECT * FROM "fcnolimit".usuarios WHERE 1=1';
    const params = [];

    if (id) {
      params.push(id);
      query += ` AND id = $${params.length}`;
    }
    if (nombre) {
      params.push(`%${nombre}%`);
      query += ` AND nombre_completo ILIKE $${params.length}`;
    }
    if (correo) {
      params.push(`%${correo}%`);
      query += ` AND correo ILIKE $${params.length}`;
    }
    if (rol) {
      params.push(rol);
      query += ` AND rol = $${params.length}`;
    }

    try {
      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Actualizar usuario (solo admin)
  router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    let { nombre_completo, correo, contraseña, rol } = req.body;
    try {
      // Solo hashea si se envía una nueva contraseña
      if (contraseña) {
        const salt = await bcrypt.genSalt(10);
        contraseña = await bcrypt.hash(contraseña, salt);
      }

      // Si no se envía contraseña, no la actualices
      let query, params;
      if (contraseña) {
        query = 'UPDATE "fcnolimit".usuarios SET nombre_completo=$1, correo=$2, contraseña=$3, rol=$4 WHERE id=$5 RETURNING *';
        params = [nombre_completo, correo, contraseña, rol, id];
      } else {
        query = 'UPDATE "fcnolimit".usuarios SET nombre_completo=$1, correo=$2, rol=$3 WHERE id=$4 RETURNING *';
        params = [nombre_completo, correo, rol, id];
      }

      const result = await pool.query(query, params);
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Eliminar usuario (solo admin)
  router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM "fcnolimit".usuarios WHERE id=$1', [id]);
      res.json({ message: 'Usuario eliminado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};