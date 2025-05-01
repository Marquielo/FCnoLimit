const { body } = require('express-validator');

const estadisticasPartidoValidation = [
  body('partido_id')
    .isInt({ min: 1 }).withMessage('partido_id debe ser un número entero válido'),
  body('equipo_id')
    .isInt({ min: 1 }).withMessage('equipo_id debe ser un número entero válido'),
  body('posesion')
    .isFloat({ min: 0, max: 100 }).withMessage('posesion debe ser un número entre 0 y 100'),
  body('tiros_totales')
    .isInt({ min: 0 }).withMessage('tiros_totales debe ser un número entero mayor o igual a 0'),
  body('tiros_a_puerta')
    .isInt({ min: 0 }).withMessage('tiros_a_puerta debe ser un número entero mayor o igual a 0'),
  body('faltas')
    .isInt({ min: 0 }).withMessage('faltas debe ser un número entero mayor o igual a 0'),
  body('tarjetas_amarillas')
    .isInt({ min: 0 }).withMessage('tarjetas_amarillas debe ser un número entero mayor o igual a 0'),
  body('tarjetas_rojas')
    .isInt({ min: 0 }).withMessage('tarjetas_rojas debe ser un número entero mayor o igual a 0'),
  body('saques_de_esquina')
    .isInt({ min: 0 }).withMessage('saques_de_esquina debe ser un número entero mayor o igual a 0'),
  body('fueras_de_juego')
    .isInt({ min: 0 }).withMessage('fueras_de_juego debe ser un número entero mayor o igual a 0'),
  body('pases_completados')
    .isInt({ min: 0 }).withMessage('pases_completados debe ser un número entero mayor o igual a 0'),
  body('atajadas')
    .isInt({ min: 0 }).withMessage('atajadas debe ser un número entero mayor o igual a 0'),
  body('cambios_realizados')
    .isInt({ min: 0 }).withMessage('cambios_realizados debe ser un número entero mayor o igual a 0'),
];

module.exports = {
  estadisticasPartidoValidation,
};