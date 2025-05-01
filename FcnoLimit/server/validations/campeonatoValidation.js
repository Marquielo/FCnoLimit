const { body } = require('express-validator');

const campeonatoValidation = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio'),
  body('descripcion')
    .notEmpty().withMessage('La descripción es obligatoria'),
  body('fecha_inicio')
    .isISO8601().withMessage('La fecha de inicio debe ser una fecha válida (YYYY-MM-DD)'),
  body('fecha_fin')
    .isISO8601().withMessage('La fecha de fin debe ser una fecha válida (YYYY-MM-DD)'),
];

module.exports = {
  campeonatoValidation,
};