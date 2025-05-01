const { body } = require('express-validator');

const ligaValidation = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio'),
  body('descripcion')
    .notEmpty().withMessage('La descripción es obligatoria'),
  body('temporada')
    .notEmpty().withMessage('La temporada es obligatoria'),
  body('campeonato_id')
    .isInt({ min: 1 }).withMessage('campeonato_id debe ser un número entero válido'),
];

module.exports = {
  ligaValidation,
};