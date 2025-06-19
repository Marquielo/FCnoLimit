# 📖 Documentación Backend FCnoLimit

## 🎯 Visión General
Sistema backend completo para la plataforma de fútbol amateur FCnoLimit, construido con Node.js, Express y PostgreSQL.

## 📁 Estructura de la Documentación

### 🏗️ [Arquitectura General](./01-arquitectura.md)
- Estructura del proyecto
- Tecnologías utilizadas
- Patrones de diseño
- Flujo de datos

### 🔐 [Sistema de Autenticación](./02-autenticacion.md)
- JWT Tokens (Access & Refresh)
- Middlewares de autenticación
- Roles y permisos
- Seguridad avanzada

### 🗄️ [Base de Datos](./03-base-de-datos.md)
- Esquema PostgreSQL
- Tablas y relaciones
- Índices y optimizaciones
- Migraciones

### 🛣️ [Rutas y APIs](./04-rutas-apis.md)
- Endpoints disponibles
- Parámetros y respuestas
- Códigos de estado
- Ejemplos de uso

### 🔧 [Middlewares](./05-middlewares.md)
- Autenticación
- Autorización
- Validaciones
- Manejo de errores

### 🎮 [Controladores](./06-controladores.md)
- Lógica de negocio
- Validaciones
- Interacción con base de datos
- Respuestas estructuradas

### 🛠️ [Utilidades](./07-utilidades.md)
- JWT Management
- Refresh Tokens
- Helpers y funciones comunes
- Configuraciones

### 📊 [Validaciones](./08-validaciones.md)
- Esquemas de validación
- Reglas de negocio
- Sanitización de datos
- Mensajes de error

### 🚀 [Deployment](./09-deployment.md)
- Configuración en Render
- Variables de entorno
- PostgreSQL en Render
- Monitoreo y logs

### 🔧 [Configuración](./10-configuracion.md)
- Variables de entorno
- Configuración de desarrollo
- Configuración de producción
- Troubleshooting

---

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Verificar configuración
npm run check-env

# Ejecutar en desarrollo
npm run dev
```

## 📞 Contacto
Para dudas sobre la documentación o el código, revisar los archivos específicos de cada sección.

---
*Documentación actualizada: $(new Date().toLocaleDateString())*
