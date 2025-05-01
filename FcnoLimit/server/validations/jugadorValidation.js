const { body } = require('express-validator');

const jugadorValidation = [
  body('usuario_id')
    .isInt({ min: 1 }).withMessage('usuario_id debe ser un número entero válido'),
  body('equipo_id')
    .isInt({ min: 1 }).withMessage('equipo_id debe ser un número entero válido'),
  body('posicion')
    .notEmpty().withMessage('La posición es obligatoria'),
  body('dorsal')
    .isInt({ min: 0 }).withMessage('El dorsal debe ser un número entero mayor o igual a 0'),
  body('imagen_url')
    .optional().isURL().withMessage('La imagen debe ser una URL válida'),
];

module.exports = {
  jugadorValidation,
};