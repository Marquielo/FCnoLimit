# ✅ Validaciones FCnoLimit

## 🎯 Visión General
Sistema de validaciones centralizado que asegura la integridad de los datos en toda la aplicación. Utiliza esquemas estructurados para validar entrada de usuarios, parámetros de API y datos de base de datos.

## 🏗️ Arquitectura de Validaciones

### **Capas de Validación**
```
Frontend Validation → API Validation → Business Logic → Database Constraints
```

### **Tipos de Validación**
- **🔍 Sintáctica**: Formato y estructura
- **📊 Semántica**: Reglas de negocio
- **🛡️ Seguridad**: Prevención de ataques
- **🗄️ Integridad**: Consistencia de datos

## 🔐 Validaciones de Autenticación

### **`/validations/authValidation.js`** - Usuario y Auth

#### **Esquema de Registro de Usuario**
```javascript
const Joi = require('joi');

/**
 * Validación para registro de nuevo usuario
 */
const registerUserSchema = Joi.object({
  nombre_completo: Joi.string()
    .min(2)
    .max(100)
    .pattern(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/)
    .required()
    .messages({
      'string.empty': 'El nombre completo es requerido',
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 100 caracteres',
      'string.pattern.base': 'El nombre solo puede contener letras y espacios',
      'any.required': 'El nombre completo es obligatorio'
    }),

  correo: Joi.string()
    .email()
    .max(255)
    .lowercase()
    .required()
    .messages({
      'string.email': 'Debe proporcionar un email válido',
      'string.max': 'El email no puede exceder 255 caracteres',
      'any.required': 'El email es obligatorio'
    }),

  contraseña: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.min': 'La contraseña debe tener al menos 8 caracteres',
      'string.max': 'La contraseña no puede exceder 128 caracteres',
      'string.pattern.base': 'La contraseña debe contener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 carácter especial',
      'any.required': 'La contraseña es obligatoria'
    }),

  rol: Joi.string()
    .valid('jugador', 'entrenador', 'persona_natural', 'administrador')
    .default('persona_natural')
    .messages({
      'any.only': 'El rol debe ser: jugador, entrenador, persona_natural o administrador'
    })
});

/**
 * Validación para login de usuario
 */
const loginUserSchema = Joi.object({
  correo: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Debe proporcionar un email válido',
      'any.required': 'El email es obligatorio'
    }),

  contraseña: Joi.string()
    .min(1)
    .required()
    .messages({
      'string.empty': 'La contraseña es requerida',
      'any.required': 'La contraseña es obligatoria'
    })
});

/**
 * Validación para refresh token
 */
const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string()
    .required()
    .messages({
      'string.empty': 'El refresh token es requerido',
      'any.required': 'El refresh token es obligatorio'
    })
});
```

#### **Validaciones Personalizadas**
```javascript
/**
 * Validador personalizado para verificar email único
 * @param {String} email - Email a verificar
 * @param {Object} pool - Conexión a base de datos
 * @returns {Promise<Boolean>} true si el email está disponible
 */
async function validateUniqueEmail(email, pool) {
  try {
    const result = await pool.query(
      'SELECT id FROM "fcnolimit".usuarios WHERE correo = $1',
      [email.toLowerCase()]
    );
    
    return result.rows.length === 0;
  } catch (error) {
    console.error('Error al validar email único:', error);
    throw new Error('Error al validar disponibilidad del email');
  }
}

/**
 * Validador de fortaleza de contraseña con scoring
 * @param {String} password - Contraseña a evaluar
 * @returns {Object} { score, feedback, isStrong }
 */
function validatePasswordStrength(password) {
  let score = 0;
  const feedback = [];

  // Longitud
  if (password.length >= 8) score += 1;
  else feedback.push('Usar al menos 8 caracteres');

  if (password.length >= 12) score += 1;

  // Complejidad
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Incluir letras minúsculas');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Incluir letras mayúsculas');

  if (/\d/.test(password)) score += 1;
  else feedback.push('Incluir números');

  if (/[@$!%*?&]/.test(password)) score += 1;
  else feedback.push('Incluir caracteres especiales (@$!%*?&)');

  // Patrones comunes (penalización)
  const commonPatterns = ['123456', 'password', 'qwerty', 'abc123'];
  if (commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
    score -= 2;
    feedback.push('Evitar patrones comunes');
  }

  return {
    score: Math.max(0, score),
    feedback,
    isStrong: score >= 4,
    level: score >= 4 ? 'fuerte' : score >= 2 ? 'medio' : 'débil'
  };
}
```

## ⚽ Validaciones de Entidades Deportivas

### **`/validations/equipoValidation.js`** - Equipos

#### **Esquema de Equipo**
```javascript
/**
 * Validación para creación/actualización de equipo
 */
const equipoSchema = Joi.object({
  nombre: Joi.string()
    .min(2)
    .max(100)
    .pattern(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9\s\-\.]+$/)
    .required()
    .messages({
      'string.min': 'El nombre del equipo debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 100 caracteres',
      'string.pattern.base': 'El nombre solo puede contener letras, números, espacios, guiones y puntos',
      'any.required': 'El nombre del equipo es obligatorio'
    }),

  logo_url: Joi.string()
    .uri()
    .optional()
    .messages({
      'string.uri': 'La URL del logo debe ser válida'
    }),

  fecha_fundacion: Joi.date()
    .max('now')
    .optional()
    .messages({
      'date.max': 'La fecha de fundación no puede ser futura'
    }),

  estadio_id: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      'number.base': 'El ID del estadio debe ser un número',
      'number.positive': 'El ID del estadio debe ser positivo'
    }),

  entrenador_id: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      'number.base': 'El ID del entrenador debe ser un número',
      'number.positive': 'El ID del entrenador debe ser positivo'
    }),

  division_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El ID de la división debe ser un número',
      'number.positive': 'El ID de la división debe ser positivo',
      'any.required': 'La división es obligatoria'
    }),

  asociacion_id: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      'number.base': 'El ID de la asociación debe ser un número',
      'number.positive': 'El ID de la asociación debe ser positivo'
    })
});
```

### **`/validations/jugadorValidation.js`** - Jugadores

#### **Esquema de Jugador**
```javascript
/**
 * Validación para registro de jugador
 */
const jugadorSchema = Joi.object({
  user_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El ID del usuario debe ser un número',
      'number.positive': 'El ID del usuario debe ser positivo',
      'any.required': 'El usuario es obligatorio'
    }),

  equipo_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El ID del equipo debe ser un número',
      'number.positive': 'El ID del equipo debe ser positivo',
      'any.required': 'El equipo es obligatorio'
    }),

  numero_camiseta: Joi.number()
    .integer()
    .min(1)
    .max(99)
    .required()
    .messages({
      'number.base': 'El número de camiseta debe ser un número',
      'number.min': 'El número de camiseta debe ser al menos 1',
      'number.max': 'El número de camiseta no puede exceder 99',
      'any.required': 'El número de camiseta es obligatorio'
    }),

  posicion: Joi.string()
    .valid(
      'portero', 
      'defensa_central', 
      'lateral_izquierdo', 
      'lateral_derecho',
      'mediocentro', 
      'mediocentro_defensivo', 
      'mediocentro_ofensivo',
      'extremo_izquierdo', 
      'extremo_derecho',
      'delantero_centro', 
      'segundo_delantero'
    )
    .required()
    .messages({
      'any.only': 'La posición debe ser una de las posiciones válidas',
      'any.required': 'La posición es obligatoria'
    }),

  fecha_nacimiento: Joi.date()
    .max(new Date(Date.now() - 16 * 365 * 24 * 60 * 60 * 1000)) // Mínimo 16 años
    .min(new Date(Date.now() - 50 * 365 * 24 * 60 * 60 * 1000)) // Máximo 50 años
    .required()
    .messages({
      'date.max': 'El jugador debe tener al menos 16 años',
      'date.min': 'El jugador no puede tener más de 50 años',
      'any.required': 'La fecha de nacimiento es obligatoria'
    }),

  altura: Joi.number()
    .precision(2)
    .min(1.40)
    .max(2.20)
    .optional()
    .messages({
      'number.min': 'La altura mínima es 1.40m',
      'number.max': 'La altura máxima es 2.20m'
    }),

  peso: Joi.number()
    .precision(1)
    .min(40)
    .max(150)
    .optional()
    .messages({
      'number.min': 'El peso mínimo es 40kg',
      'number.max': 'El peso máximo es 150kg'
    }),

  pie_dominante: Joi.string()
    .valid('izquierdo', 'derecho', 'ambidiestro')
    .default('derecho')
    .messages({
      'any.only': 'El pie dominante debe ser: izquierdo, derecho o ambidiestro'
    })
});
```

## 🏆 Validaciones de Partidos y Estadísticas

### **`/validations/partidoValidation.js`** - Partidos

#### **Esquema de Partido**
```javascript
/**
 * Validación para creación de partido
 */
const partidoSchema = Joi.object({
  equipo_local_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'El equipo local es obligatorio'
    }),

  equipo_visitante_id: Joi.number()
    .integer()
    .positive()
    .required()
    .not(Joi.ref('equipo_local_id'))
    .messages({
      'any.required': 'El equipo visitante es obligatorio',
      'any.invalid': 'El equipo visitante debe ser diferente al local'
    }),

  fecha_partido: Joi.date()
    .min('now')
    .required()
    .messages({
      'date.min': 'La fecha del partido debe ser futura',
      'any.required': 'La fecha del partido es obligatoria'
    }),

  estadio_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'El estadio es obligatorio'
    }),

  division_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'La división es obligatoria'
    }),

  goles_local: Joi.number()
    .integer()
    .min(0)
    .max(20)
    .default(0)
    .messages({
      'number.min': 'Los goles no pueden ser negativos',
      'number.max': 'Máximo 20 goles por equipo'
    }),

  goles_visitante: Joi.number()
    .integer()
    .min(0)
    .max(20)
    .default(0)
    .messages({
      'number.min': 'Los goles no pueden ser negativos',
      'number.max': 'Máximo 20 goles por equipo'
    }),

  estado: Joi.string()
    .valid('programado', 'en_curso', 'finalizado', 'cancelado')
    .default('programado')
    .messages({
      'any.only': 'El estado debe ser: programado, en_curso, finalizado o cancelado'
    })
});
```

### **`/validations/estadisticasJugadorPartidoValidation.js`** - Estadísticas de Jugador

#### **Esquema de Estadísticas**
```javascript
/**
 * Validación para estadísticas de jugador en partido
 */
const estadisticasJugadorPartidoSchema = Joi.object({
  jugador_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'El jugador es obligatorio'
    }),

  partido_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'El partido es obligatorio'
    }),

  goles: Joi.number()
    .integer()
    .min(0)
    .max(10)
    .default(0)
    .messages({
      'number.min': 'Los goles no pueden ser negativos',
      'number.max': 'Máximo 10 goles por jugador'
    }),

  asistencias: Joi.number()
    .integer()
    .min(0)
    .max(10)
    .default(0)
    .messages({
      'number.min': 'Las asistencias no pueden ser negativas',
      'number.max': 'Máximo 10 asistencias por jugador'
    }),

  tarjetas_amarillas: Joi.number()
    .integer()
    .min(0)
    .max(2)
    .default(0)
    .messages({
      'number.min': 'Las tarjetas amarillas no pueden ser negativas',
      'number.max': 'Máximo 2 tarjetas amarillas por jugador'
    }),

  tarjetas_rojas: Joi.number()
    .integer()
    .min(0)
    .max(1)
    .default(0)
    .messages({
      'number.min': 'Las tarjetas rojas no pueden ser negativas',
      'number.max': 'Máximo 1 tarjeta roja por jugador'
    }),

  minutos_jugados: Joi.number()
    .integer()
    .min(0)
    .max(120)
    .default(0)
    .messages({
      'number.min': 'Los minutos jugados no pueden ser negativos',
      'number.max': 'Máximo 120 minutos por partido (incluyendo tiempo extra)'
    })
}).custom((value, helpers) => {
  // Validación cruzada: si tiene tarjeta roja, validar minutos jugados
  if (value.tarjetas_rojas > 0 && value.minutos_jugados === 0) {
    return helpers.error('any.custom', {
      message: 'Si el jugador tiene tarjeta roja debe haber jugado algunos minutos'
    });
  }
  
  // Validación: no puede tener más de 2 tarjetas amarillas si tiene roja
  if (value.tarjetas_rojas > 0 && value.tarjetas_amarillas > 1) {
    return helpers.error('any.custom', {
      message: 'No puede tener más de 1 tarjeta amarilla si ya tiene roja'
    });
  }
  
  return value;
});
```

## 🏛️ Validaciones de Entidades Organizacionales

### **`/validations/ligaValidation.js`** - Ligas y Campeonatos

#### **Esquema de Liga/Campeonato**
```javascript
/**
 * Validación para creación de liga/campeonato
 */
const ligaSchema = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.min': 'El nombre de la liga debe tener al menos 3 caracteres',
      'string.max': 'El nombre no puede exceder 100 caracteres',
      'any.required': 'El nombre de la liga es obligatorio'
    }),

  fecha_inicio: Joi.date()
    .min('now')
    .required()
    .messages({
      'date.min': 'La fecha de inicio debe ser futura',
      'any.required': 'La fecha de inicio es obligatoria'
    }),

  fecha_fin: Joi.date()
    .min(Joi.ref('fecha_inicio'))
    .required()
    .messages({
      'date.min': 'La fecha de fin debe ser posterior a la fecha de inicio',
      'any.required': 'La fecha de fin es obligatoria'
    }),

  division_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'La división es obligatoria'
    }),

  max_equipos: Joi.number()
    .integer()
    .min(4)
    .max(32)
    .default(16)
    .messages({
      'number.min': 'Mínimo 4 equipos en una liga',
      'number.max': 'Máximo 32 equipos en una liga'
    }),

  estado: Joi.string()
    .valid('planificado', 'inscripciones_abiertas', 'en_curso', 'finalizado')
    .default('planificado')
    .messages({
      'any.only': 'El estado debe ser: planificado, inscripciones_abiertas, en_curso o finalizado'
    })
});
```

## 🔍 Middleware de Validación

### **`/middlewares/validate.js`** - Aplicar Validaciones

#### **Middleware Universal**
```javascript
const Joi = require('joi');

/**
 * Middleware para validar request body con esquemas Joi
 * @param {Object} schema - Esquema Joi de validación
 * @param {String} source - Fuente de datos: 'body', 'query', 'params'
 * @returns {Function} Middleware function
 */
function validate(schema, source = 'body') {
  return (req, res, next) => {
    const data = req[source];
    
    const { error, value } = schema.validate(data, {
      abortEarly: false, // Retornar todos los errores
      stripUnknown: true, // Remover campos no definidos
      convert: true // Convertir tipos automáticamente
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context.value
      }));

      return res.status(400).json({
        error: 'Datos de entrada inválidos',
        code: 'VALIDATION_ERROR',
        details: errors,
        timestamp: new Date().toISOString()
      });
    }

    // Reemplazar datos originales con datos validados y sanitizados
    req[source] = value;
    next();
  };
}

/**
 * Middleware para validaciones personalizadas asíncronas
 * @param {Function} customValidator - Función de validación personalizada
 * @returns {Function} Middleware function
 */
function validateAsync(customValidator) {
  return async (req, res, next) => {
    try {
      const isValid = await customValidator(req);
      
      if (!isValid) {
        return res.status(400).json({
          error: 'Validación personalizada fallida',
          code: 'CUSTOM_VALIDATION_ERROR',
          timestamp: new Date().toISOString()
        });
      }
      
      next();
    } catch (error) {
      console.error('Error en validación personalizada:', error);
      return res.status(500).json({
        error: 'Error interno en validación',
        code: 'VALIDATION_INTERNAL_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  };
}

module.exports = {
  validate,
  validateAsync
};
```

#### **Uso de Middlewares de Validación**
```javascript
// En las rutas
const { validate } = require('../middlewares/validate');
const { registerUserSchema, loginUserSchema } = require('../validations/authValidation');

// Validación de registro
router.post('/register', 
  validate(registerUserSchema), 
  async (req, res) => {
    // req.body ya está validado y sanitizado
    const user = await createUser(pool, req.body);
    res.status(201).json({ data: user });
  }
);

// Validación de query parameters
router.get('/equipos', 
  validate(equiposQuerySchema, 'query'), 
  async (req, res) => {
    // req.query ya está validado
    const equipos = await getEquipos(pool, req.query);
    res.json({ data: equipos });
  }
);

// Validación personalizada asíncrona
router.post('/equipos',
  validate(equipoSchema),
  validateAsync(async (req) => {
    // Verificar que la división existe
    const division = await pool.query('SELECT id FROM divisiones WHERE id = $1', [req.body.division_id]);
    return division.rows.length > 0;
  }),
  async (req, res) => {
    const equipo = await createEquipo(pool, req.body);
    res.status(201).json({ data: equipo });
  }
);
```

## 📊 Validaciones de Integridad de Datos

### **Validaciones Cruzadas**
```javascript
/**
 * Validador para verificar que un jugador no esté en múltiples equipos
 */
async function validateJugadorUniqueTeam(userId, equipoId, pool) {
  const result = await pool.query(
    'SELECT equipo_id FROM "fcnolimit".jugadores WHERE user_id = $1 AND equipo_id != $2',
    [userId, equipoId]
  );
  
  if (result.rows.length > 0) {
    throw new Error('El jugador ya pertenece a otro equipo');
  }
  
  return true;
}

/**
 * Validador para verificar número de camiseta único en el equipo
 */
async function validateUniqueJerseyNumber(equipoId, numeroCamiseta, jugadorId, pool) {
  let query = 'SELECT id FROM "fcnolimit".jugadores WHERE equipo_id = $1 AND numero_camiseta = $2';
  let params = [equipoId, numeroCamiseta];
  
  if (jugadorId) {
    query += ' AND id != $3';
    params.push(jugadorId);
  }
  
  const result = await pool.query(query, params);
  
  if (result.rows.length > 0) {
    throw new Error('El número de camiseta ya está en uso en este equipo');
  }
  
  return true;
}
```

## 🛡️ Validaciones de Seguridad

### **Sanitización y Prevención de Ataques**
```javascript
/**
 * Sanitizador para prevenir XSS
 * @param {String} input - Texto a sanitizar
 * @returns {String} Texto sanitizado
 */
function sanitizeHtml(input) {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validador para prevenir SQL injection en búsquedas
 * @param {String} searchTerm - Término de búsqueda
 * @returns {Boolean} true si es seguro
 */
function validateSearchTerm(searchTerm) {
  // Prevenir caracteres peligrosos
  const dangerousChars = /[;'"\\]/;
  if (dangerousChars.test(searchTerm)) {
    return false;
  }
  
  // Limitar longitud
  if (searchTerm.length > 100) {
    return false;
  }
  
  return true;
}
```

---

## 🚀 Próximas Mejoras de Validaciones

1. **Schema Versioning** - Versionado de esquemas
2. **Dynamic Validation** - Validaciones basadas en contexto
3. **Bulk Validation** - Validación de arrays grandes
4. **Real-time Validation** - Validación en tiempo real
5. **Custom Error Messages** - Mensajes personalizados por idioma
6. **Performance Optimization** - Cache de esquemas compilados

---
*Última actualización: $(new Date().toLocaleDateString())*
