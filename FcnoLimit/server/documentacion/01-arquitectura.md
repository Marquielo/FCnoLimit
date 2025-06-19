# 🏗️ Arquitectura del Backend FCnoLimit

## 📋 Visión General
Sistema backend construido con arquitectura de microservicios modular, siguiendo principios de separación de responsabilidades y escalabilidad.

## 🛠️ Stack Tecnológico

### **Runtime & Framework**
- **Node.js** - Entorno de ejecución JavaScript
- **Express.js** - Framework web minimalista y rápido

### **Base de Datos**
- **PostgreSQL** - Base de datos relacional robusta
- **Render PostgreSQL** - Hosting en la nube

### **Autenticación**
- **JWT (JSON Web Tokens)** - Autenticación stateless
- **bcrypt** - Hash de contraseñas
- **Refresh Tokens** - Seguridad avanzada

### **Herramientas de Desarrollo**
- **nodemon** - Desarrollo con hot reload
- **dotenv** - Gestión de variables de entorno
- **express-validator** - Validación de datos

## 📁 Estructura del Proyecto

```
server/
├── 📁 controllers/          # Lógica de negocio
│   └── logicUser.js        # Gestión de usuarios
├── 📁 database/            # Configuración de DB
│   └── views/              # Vistas de base de datos
├── 📁 middlewares/         # Middlewares personalizados
│   ├── auth.js            # Autenticación JWT
│   └── isAdmin.js         # Autorización admin
├── 📁 routes/              # Definición de rutas
│   ├── usuarios.js        # Rutas de usuarios
│   ├── equipos.js         # Rutas de equipos
│   ├── jugadores.js       # Rutas de jugadores
│   ├── partidos.js        # Rutas de partidos
│   └── [otros...]         # Más rutas específicas
├── 📁 utils/               # Utilidades
│   ├── jwt.js             # Gestión de JWT
│   └── refreshTokens.js   # Gestión de refresh tokens
├── 📁 validations/         # Esquemas de validación
│   ├── authValidation.js  # Validaciones de auth
│   └── [otros...]         # Más validaciones
├── 📁 public/              # Archivos estáticos
├── 📁 documentacion/       # Documentación técnica
├── index.js               # Punto de entrada
├── package.json           # Dependencias y scripts
└── .env                   # Variables de entorno
```

## 🔄 Flujo de Datos

### **1. Request Lifecycle**
```
Cliente → Express Router → Middleware → Controller → Database → Response
```

### **2. Autenticación Flow**
```
Login Request → Validation → Database Check → JWT Generation → Response
```

### **3. Protected Route Flow**
```
Request → Auth Middleware → Role Check → Controller → Response
```

## 🎯 Patrones Arquitectónicos

### **1. MVC (Model-View-Controller)**
- **Model**: Interacción con PostgreSQL
- **View**: Respuestas JSON estructuradas
- **Controller**: Lógica de negocio en `/controllers`

### **2. Middleware Pattern**
- **Authentication**: Verificación de tokens
- **Authorization**: Control de roles
- **Validation**: Validación de datos entrada

### **3. Repository Pattern**
- Separación entre lógica de negocio y acceso a datos
- Controllers se enfocan en lógica
- Database queries centralizadas

## 🔧 Principios de Diseño

### **1. Separación de Responsabilidades**
- **Routes**: Solo routing y middleware
- **Controllers**: Solo lógica de negocio
- **Utils**: Funciones reutilizables
- **Validations**: Solo validación de datos

### **2. DRY (Don't Repeat Yourself)**
- Funciones utilitarias reutilizables
- Middlewares comunes
- Esquemas de validación centralizados

### **3. SOLID Principles**
- **Single Responsibility**: Cada archivo/función una responsabilidad
- **Open/Closed**: Extensible sin modificar código existente
- **Dependency Inversion**: Dependencias via parámetros

## 📊 Escalabilidad

### **Horizontal Scaling**
- Stateless design con JWT
- Database connection pooling
- Refresh tokens para sesiones largas

### **Performance Optimizations**
- Índices en PostgreSQL
- Connection pooling
- Lazy loading de relaciones
- Compresión de respuestas

### **Security by Design**
- JWT con expiración corta
- Refresh tokens hasheados
- Rate limiting preparado
- Validación exhaustiva

## 🔍 Monitoreo y Logs

### **Error Handling**
- Try-catch centralizado
- Logs estructurados
- Error responses estandarizados

### **Performance Monitoring**
- Connection pool metrics
- Response time tracking
- Database query performance

---

## 🚀 Próximas Mejoras Arquitectónicas

1. **Redis Cache Layer** - Para sessions y cache
2. **Rate Limiting** - Protección contra abuse
3. **API Versioning** - Versionado de endpoints
4. **Microservices** - División por dominios
5. **Event Sourcing** - Para auditoría completa

---
*Última actualización: $(new Date().toLocaleDateString())*
