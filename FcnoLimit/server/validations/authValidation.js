const { header } = require('express-validator');

const tokenHeaderValidation = [
  header('authorization')
    .exists().withMessage('El header Authorization es requerido')
    .matches(/^Bearer\s[\w-]+\.[\w-]+\.[\w-]+$/)
    .withMessage('El header Authorization debe tener el formato: Bearer <token>'),
];

module.exports = {
  tokenHeaderValidation,
};