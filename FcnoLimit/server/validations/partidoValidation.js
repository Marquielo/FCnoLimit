const { body } = require('express-validator');

const partidoValidation = [
  body('equipo_local_id')
    .isInt({ min: 1 }).withMessage('equipo_local_id debe ser un número entero válido'),
  body('equipo_visitante_id')
    .isInt({ min: 1 }).withMessage('equipo_visitante_id debe ser un número entero válido'),
  body('goles_local')
    .isInt({ min: 0 }).withMessage('goles_local debe ser un número entero mayor o igual a 0'),
  body('goles_visitante')
    .isInt({ min: 0 }).withMessage('goles_visitante debe ser un número entero mayor o igual a 0'),
  body('fecha')
    .notEmpty().withMessage('La fecha es obligatoria'),
  body('estadio')
    .notEmpty().withMessage('El estadio es obligatorio'),
  body('liga_id')
    .isInt({ min: 1 }).withMessage('liga_id debe ser un número entero válido'),
  body('administrador_id')
    .isInt({ min: 1 }).withMessage('administrador_id debe ser un número entero válido'),
  body('estado')
    .notEmpty().withMessage('El estado es obligatorio'),
  body('jugado_en')
    .notEmpty().withMessage('El campo jugado_en es obligatorio'),
];

module.exports = {
  partidoValidation,
};