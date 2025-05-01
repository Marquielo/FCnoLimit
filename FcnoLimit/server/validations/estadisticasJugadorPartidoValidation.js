const { body } = require('express-validator');

const estadisticasJugadorPartidoValidation = [
  body('partido_id')
    .isInt({ min: 1 }).withMessage('partido_id debe ser un número entero válido'),
  body('jugador_id')
    .isInt({ min: 1 }).withMessage('jugador_id debe ser un número entero válido'),
  body('goles')
    .isInt({ min: 0 }).withMessage('goles debe ser un número entero mayor o igual a 0'),
  body('asistencias')
    .isInt({ min: 0 }).withMessage('asistencias debe ser un número entero mayor o igual a 0'),
  body('tarjetas_amarillas')
    .isInt({ min: 0 }).withMessage('tarjetas_amarillas debe ser un número entero mayor o igual a 0'),
  body('tarjetas_rojas')
    .isInt({ min: 0 }).withMessage('tarjetas_rojas debe ser un número entero mayor o igual a 0'),
  body('faltas_cometidas')
    .isInt({ min: 0 }).withMessage('faltas_cometidas debe ser un número entero mayor o igual a 0'),
  body('pases_completados')
    .isInt({ min: 0 }).withMessage('pases_completados debe ser un número entero mayor o igual a 0'),
  body('minutos_jugados')
    .isInt({ min: 0 }).withMessage('minutos_jugados debe ser un número entero mayor o igual a 0'),
];

module.exports = {
  estadisticasJugadorPartidoValidation,
};