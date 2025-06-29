# 🔐 Google Authentication: Diferencias entre Local y Producción

## 📋 Resumen del Problema

Durante la implementación de Google Authentication con Firebase, nos encontramos con un problema común: **la autenticación funcionaba perfectamente en desarrollo local, pero fallaba en producción (Firebase Hosting)**.

## 🔍 Diagnóstico del Problema

### Síntomas
- ✅ **Local (localhost:8100)**: Google Auth funcionaba correctamente
- ❌ **Producción (fcnolimit.web.app)**: Error "API key not valid. Please pass a valid API key"
- ❌ **Backend**: No podía validar tokens de Firebase Auth

### Causa Raíz
La configuración de Firebase funciona diferente entre entornos de desarrollo y producción:

1. **Variables de entorno**: Vite no incluye automáticamente el archivo `.env` en el build de producción para Firebase Hosting
2. **Restricciones de API Key**: Las API Keys de Google Cloud tienen restricciones de dominio
3. **Variables de entorno del backend**: El backend en Render necesita las credenciales del Firebase Admin SDK

## 🛠️ Solución Implementada

### 1. Configuración de Variables de Entorno

#### Desarrollo Local
```bash
# .env
VITE_FIREBASE_API_KEY=tu-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
VITE_FIREBASE_APP_ID=tu-app-id
VITE_API_URL=https://tu-backend.onrender.com
```

#### Producción (Firebase Hosting)
```bash
# .env.production (REQUERIDO para Firebase Hosting)
VITE_FIREBASE_API_KEY=tu-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
VITE_FIREBASE_APP_ID=tu-app-id
VITE_API_URL=https://tu-backend.onrender.com
```

### 2. Configuración de Google Cloud Console

#### API Key Restrictions
En [Google Cloud Console](https://console.cloud.google.com/) → **APIs y servicios** → **Credenciales**:

**Restricciones de aplicación**: Sitios web
**Restricciones de sitios web**:
```
http://localhost:8100/*
https://tu-proyecto.web.app/*
https://tu-proyecto.firebaseapp.com/*
```

#### OAuth 2.0 Client ID
**Orígenes de JavaScript autorizados**:
```
http://localhost:8100
https://tu-proyecto.web.app
https://tu-proyecto.firebaseapp.com
```

**URIs de redirección autorizados**:
```
http://localhost:8100/__/auth/handler
https://tu-proyecto.web.app/__/auth/handler
https://tu-proyecto.firebaseapp.com/__/auth/handler
```

### 3. Configuración del Backend (Render)

#### Variables de Entorno requeridas en Render:
```bash
FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----
[clave privada completa del service account]
-----END PRIVATE KEY-----
```

## 📝 Pasos para Nuevos Colaboradores

### 1. Configuración Inicial
1. Clona el repositorio
2. Instala dependencias: `npm install`
3. Copia `.env.example` a `.env` y completa las variables
4. Crea `.env.production` con las mismas variables para producción

### 2. Desarrollo Local
```bash
npm run dev
```
La app correrá en `http://localhost:8100` con Google Auth funcionando.

### 3. Deploy a Producción
```bash
npm run build
firebase deploy
```

### 4. Configuración de Google Cloud (Solo Admin)
⚠️ **Solo el administrador del proyecto debe configurar**:
- API Key restrictions en Google Cloud Console
- OAuth Client settings
- Firebase Admin SDK credentials en Render

## 🔧 Arquitectura Final

```
Frontend (Firebase Hosting: tu-proyecto.web.app)
├── React + Ionic + Vite
├── Firebase Auth (Google Login)
├── Variables de entorno (.env.production)
└── API calls al backend

Backend (Render: tu-backend.onrender.com)
├── Node.js + Express
├── Firebase Admin SDK (validación de tokens)
├── Variables de entorno (Firebase credentials)
└── PostgreSQL connection

Database (Render PostgreSQL)
└── Usuarios y datos de la aplicación
```

## ⚠️ Errores Comunes y Soluciones

### Error: "API key not valid" en producción
**Causa**: Falta el archivo `.env.production`
**Solución**: Crear `.env.production` con las variables de Firebase

### Error: "redirect_uri_mismatch"
**Causa**: URIs de redirección no configuradas en OAuth Client
**Solución**: Agregar dominios en Google Cloud Console

### Error: Backend no valida tokens
**Causa**: Faltan variables de entorno del Firebase Admin SDK en Render
**Solución**: Configurar `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, y `FIREBASE_PRIVATE_KEY`

## 📚 Recursos Útiles

- [Firebase Configuration](https://firebase.google.com/docs/web/setup)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

## 🎯 Lecciones Aprendidas

1. **Siempre crear `.env.production`** para deployments en Firebase Hosting
2. **Configurar restricciones de API Key** antes del deploy a producción
3. **Separar configuraciones** entre frontend (browser API) y backend (Admin SDK)
4. **Probar en ambos entornos** antes de considerar completada la implementación

---

*Documentado el 28 de junio de 2025 - Implementación exitosa de Google Authentication*
