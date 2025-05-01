const { body } = require('express-validator');

const equipoValidation = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio'),
  body('categoria')
    .notEmpty().withMessage('La categoría es obligatoria'),
  body('liga_id')
    .isInt({ min: 1 }).withMessage('liga_id debe ser un número entero válido'),
  body('imagen_url')
    .optional().isURL().withMessage('La imagen debe ser una URL válida'),
];

module.exports = {
  equipoValidation,
};