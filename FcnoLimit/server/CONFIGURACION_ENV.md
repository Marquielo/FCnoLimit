# 🔧 Guía de Configuración de Variables de Entorno

## 📋 Paso a Paso para Configurar Variables de Entorno

### 1. Verificar Configuración Actual

Ejecuta el script de verificación para ver el estado actual:

```bash
cd server
npm run check-env
```

### 2. Configuración Local (.env)

Tu archivo `.env` actual ya está configurado con:

✅ **Variables de Base de Datos:**
- `DB_USER=fcnolimit`
- `DB_HOST=dpg-d0ljklbuibrs73acq6rg-a.ohio-postgres.render.com`
- `DB_NAME=fcnolimit`
- `DB_PASSWORD=7q2xgVxDUrE4hwXXRuZMjjW3uv2Zx84i`
- `DB_PORT=5432`
- `DB_SSL=true`

✅ **Variables del Servidor:**
- `PORT=3001`
- `JWT_SECRET=tu_secreto_seguro_muy_largo_y_complejo_2024`

✅ **CORS:**
- Múltiples orígenes configurados (Firebase, localhost, etc.)

### 3. Configuración en Render (Producción)

#### 3.1 Acceder al Dashboard de Render
1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Selecciona tu servicio backend
3. Ve a la pestaña **Environment**

#### 3.2 Agregar Variables una por una:

```env
# Base de Datos (Render auto-genera DATABASE_URL)
DB_USER=fcnolimit
DB_HOST=dpg-d0ljklbuibrs73acq6rg-a.ohio-postgres.render.com
DB_NAME=fcnolimit
DB_PASSWORD=7q2xgVxDUrE4hwXXRuZMjjW3uv2Zx84i
DB_PORT=5432
DB_SSL=true

# Servidor
PORT=3001
NODE_ENV=production

# Seguridad
JWT_SECRET=tu_secreto_seguro_muy_largo_y_complejo_2024

# CORS (actualiza con tu dominio real de Render)
CORS_ORIGIN=https://tu-frontend.onrender.com,https://fcnolimit.firebaseapp.com,https://fcnolimit.web.app
```

#### 3.3 Variables Automáticas de Render
Render automáticamente provee:
- `DATABASE_URL` (cuando conectas PostgreSQL)
- `RENDER` (siempre "true")

### 4. Generar JWT Secret Seguro

Para generar un JWT secret realmente seguro:

```bash
# Opción 1: Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Opción 2: OpenSSL
openssl rand -hex 64

# Opción 3: Online (usar con precaución)
# https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx
```

### 5. Comandos Útiles

```bash
# Verificar todas las variables
npm run check-env

# Verificar solo la conexión DB
npm run verify-db

# Instalar y verificar todo
npm run setup

# Ejecutar en desarrollo
npm run dev

# Ejecutar en producción
npm start
```

### 6. Troubleshooting

#### Error: "ENOTFOUND"
- ✅ Verifica `DB_HOST`
- ✅ Revisa conectividad de red

#### Error: "authentication failed"
- ✅ Verifica `DB_USER` y `DB_PASSWORD`
- ✅ Asegúrate que no hay espacios extra

#### Error: "database does not exist"
- ✅ Verifica `DB_NAME`
- ✅ Confirma que la DB existe en Render

#### Error: "SSL required"
- ✅ Asegúrate que `DB_SSL=true`
- ✅ Verifica configuración SSL en Render

### 7. Variables para Diferentes Entornos

#### 🏠 Desarrollo Local
```env
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:5000,http://localhost:8100
```

#### 🚀 Producción (Render)
```env
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://tu-app.onrender.com,https://fcnolimit.firebaseapp.com
```

#### 🧪 Testing
```env
NODE_ENV=test
DB_NAME=fcnolimit_test
```

### 8. Seguridad

🔒 **Nunca commits estos archivos:**
- `.env`
- `.env.local`
- `.env.production`

✅ **Siempre incluye:**
- `.env.example`
- `.env.template`

🔑 **Cambia en producción:**
- `JWT_SECRET`
- `DB_PASSWORD` (si es posible)

### 9. Próximos Pasos

1. ✅ Ejecutar `npm run check-env`
2. ✅ Corregir cualquier variable faltante
3. ✅ Probar conexión local
4. ✅ Configurar variables en Render
5. ✅ Deployar y probar en producción
