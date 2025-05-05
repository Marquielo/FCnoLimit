const bcrypt = require('bcrypt');
const { signToken } = require('../utils/jwt');

// Lógica para crear un usuario (con hash de contraseña)
async function createUser(pool, { nombre_completo, correo, contraseña, rol }) {
  const hashedPassword = await bcrypt.hash(contraseña, 10);
  const result = await pool.query(
    'INSERT INTO "fcnolimit".usuarios (nombre_completo, correo, contraseña, rol) VALUES ($1, $2, $3, $4) RETURNING *',
    [nombre_completo, correo, hashedPassword, rol]
  );
  return result.rows[0];
}

// Lógica para login de usuario
async function loginUser(pool, { correo, contraseña }) {
  const result = await pool.query('SELECT * FROM "fcnolimit".usuarios WHERE correo = $1', [correo]);
  const user = result.rows[0];
  if (!user) return null;
  const valid = await bcrypt.compare(contraseña, user.contraseña);
  if (!valid) return null;
  // Generar token JWT usando utilitario
  const token = signToken(
    { id: user.id, rol: user.rol, correo: user.correo }
  );
  return { token, user: { id: user.id, nombre_completo: user.nombre_completo, rol: user.rol, correo: user.correo } };
}

module.exports = {
  createUser,
  loginUser,
};