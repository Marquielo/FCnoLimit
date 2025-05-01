function isAdmin(req, res, next) {
  if (req.user && req.user.rol === 'administrador') {
    return next();
  }
  return res.status(403).json({ error: 'Acceso solo para administradores' });
}

module.exports = isAdmin;