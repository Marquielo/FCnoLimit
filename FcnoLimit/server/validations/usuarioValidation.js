const { body } = require('express-validator');

const registerValidation = [
  body('nombre_completo')
    .notEmpty().withMessage('El nombre completo es obligatorio'),
  body('correo')
    .isEmail().withMessage('El correo debe ser válido'),
  body('contraseña')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('rol')
    .notEmpty().withMessage('El rol es obligatorio'),
];

const loginValidation = [
  body('correo')
    .isEmail().withMessage('El correo debe ser válido'),
  body('contraseña')
    .notEmpty().withMessage('La contraseña es obligatoria'),
];

module.exports = {
  registerValidation,
  loginValidation,
};