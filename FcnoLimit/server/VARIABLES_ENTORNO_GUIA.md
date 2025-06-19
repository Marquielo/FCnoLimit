# 📋 Guía de Variables de Entorno para FCnoLimit

## 🗂️ Tipos de Archivos y su Propósito

### 📄 `.env` (Desarrollo Local)
- **Usado en:** Tu máquina local
- **Leído por:** Node.js con dotenv
- **Git:** ❌ NO se sube (en .gitignore)
- **Contiene:** Credenciales reales para desarrollo

```env
DB_USER=fcnolimit
DB_PASSWORD=7q2xgVxDUrE4hwXXRuZMjjW3uv2Zx84i
NODE_ENV=development
```

### 📄 `.env.example` (Documentación)
- **Usado en:** Documentación del proyecto
- **Leído por:** Desarrolladores (manual)
- **Git:** ✅ SÍ se sube (es seguro)
- **Contiene:** Plantilla sin valores reales

```env
DB_USER=tu_usuario_aqui
DB_PASSWORD=tu_password_aqui
NODE_ENV=development
```

### 📄 `env.yaml` (Configuración Render)
- **Usado en:** Render (producción)
- **Leído por:** dotenv-yaml en Node.js
- **Git:** ⚠️ Solo valores no sensibles
- **Contiene:** Configuración no sensible

```yaml
DB_PORT: 5432
DB_SSL: "true"
NODE_ENV: "production"
```

### 📄 `render.yaml` (Infraestructura Render)
- **Usado en:** Definir servicios en Render
- **Leído por:** Render automáticamente
- **Git:** ✅ SÍ se sube
- **Contiene:** Definición de servicios

## 🔄 Flujo de Configuración

### 🏠 Desarrollo Local
1. Copiar `.env.example` → `.env`
2. Llenar valores reales en `.env`
3. Node.js lee `.env` automáticamente

### 🚀 Producción (Render)
1. **Opción A (Recomendada):** Dashboard de Render
   - Variables sensibles → Dashboard manual
   - Variables no sensibles → `env.yaml`

2. **Opción B:** Solo Dashboard
   - Todas las variables en Dashboard
   - Más seguro, más manual

## 📍 ¿Qué Archivo Usa Render?

**Render NO lee directamente:**
- ❌ `.env` (es local)
- ❌ `.env.example` (es documentación)

**Render SÍ puede usar:**
- ✅ Variables del Dashboard (configuración manual)
- ✅ `env.yaml` (si dotenv-yaml está configurado)
- ✅ `render.yaml` (para definir servicios)
- ✅ Variables automáticas (DATABASE_URL, PORT, etc.)

## 🎯 Configuración Actual de FCnoLimit

### Tu Setup Actual:
```
📁 server/
├── .env              ← Desarrollo local ✅
├── .env.example      ← Documentación ✅
├── env.yaml          ← Render (actualizado) ✅
└── package.json      ← Scripts de verificación ✅
```

### Variables en Render Dashboard (Manual):
```
DB_USER=fcnolimit
DB_HOST=dpg-d0ljklbuibrs73acq6rg-a.ohio-postgres.render.com
DB_NAME=fcnolimit
DB_PASSWORD=7q2xgVxDUrE4hwXXRuZMjjW3uv2Zx84i
JWT_SECRET=tu_secreto_seguro_muy_largo_y_complejo_2024
CORS_ORIGIN=https://fcnolimit.firebaseapp.com,https://fcnolimit.web.app
```

### Variables en env.yaml (Seguras):
```yaml
DB_PORT: 5432
DB_SSL: "true"
NODE_ENV: "production"
```

## 🔧 Comandos Útiles

```bash
# Verificar configuración actual
npm run check-env

# Ver variables cargadas (sin valores sensibles)
node -e "console.log(Object.keys(process.env).filter(k => k.startsWith('DB_')))"
```

## 🛡️ Mejores Prácticas

### ✅ Hacer:
- Usar Dashboard de Render para credenciales
- Mantener .env.example actualizado
- Variables no sensibles en env.yaml
- Verificar configuración con scripts

### ❌ Evitar:
- Credenciales en archivos versionados
- Passwords en env.yaml
- Subir .env a Git
- JWT secrets débiles
