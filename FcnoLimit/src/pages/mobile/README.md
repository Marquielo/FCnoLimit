# FCnoLimit Mobile App

Aplicación móvil nativa para FCnoLimit, construida con Ionic React y Capacitor.

## 📱 Características

### Pantallas Principales
- **Inicio**: Dashboard principal con acceso rápido a todas las funciones
- **Partidos**: Lista de partidos pendientes y jugados con detalles completos
- **Equipos**: Explorador de equipos con información detallada
- **Estadísticas**: Análisis y métricas de la liga
- **Perfil**: Configuración del usuario y preferencias

### Funcionalidades Móviles
- 🔄 **Pull-to-refresh** en todas las pantallas
- 📱 **Navegación por tabs** optimizada para móvil
- 🎨 **Interfaz nativa** con componentes Ionic
- 🔍 **Búsqueda** de equipos y partidos
- 📊 **Visualización de estadísticas** interactiva
- ⚡ **Carga rápida** y respuesta fluida

## 🛠️ Tecnologías

- **Ionic React**: Framework para aplicaciones móviles híbridas
- **Capacitor**: Runtime nativo para aplicaciones web
- **TypeScript**: Tipado estático para mayor robustez
- **React Hooks**: Gestión de estado moderna
- **Ionicons**: Iconografía consistente

## 📂 Estructura del Proyecto

```
src/pages/mobile/
├── MobileApp.tsx           # Navegación principal con tabs
├── MobileHome.tsx          # Pantalla de inicio
├── MobilePartidos.tsx      # Lista de partidos
├── MobileEquipos.tsx       # Lista de equipos
├── MobileEstadisticas.tsx  # Estadísticas de la liga
├── MobilePerfil.tsx        # Perfil del usuario
└── index.ts               # Exportaciones

src/components/mobile/
├── PartidoCard.tsx        # Componente para mostrar partidos
└── ...                    # Otros componentes reutilizables
```

## 🚀 Integración con el Backend

La aplicación móvil utiliza las mismas APIs que la versión web:

- **Partidos**: `/api/partidos/*`
- **Equipos**: `/api/equipos/*`
- **Estadísticas**: `/api/estadisticas/*`
- **Usuarios**: `/api/usuarios/*`

## 📱 Generación del APK

Para generar el APK de Android:

1. **Construir la aplicación**:
   ```bash
   ionic build
   ```

2. **Sincronizar con Capacitor**:
   ```bash
   ionic cap sync android
   ```

3. **Abrir en Android Studio**:
   ```bash
   ionic cap open android
   ```

4. **Generar APK** desde Android Studio:
   - Build → Generate Signed Bundle / APK
   - Seleccionar APK
   - Configurar certificado de firma
   - Generar APK

## 🎨 Personalización

### Temas y Colores
Los colores de la aplicación se pueden personalizar en el archivo de configuración de Ionic existente.

### Componentes Personalizados
- **PartidoCard**: Componente reutilizable para mostrar información de partidos
- Componentes adicionales se pueden agregar en `src/components/mobile/`

## 📋 Funcionalidades Pendientes

- [ ] Notificaciones push para partidos
- [ ] Modo offline con sincronización
- [ ] Compartir resultados en redes sociales
- [ ] Favoritos de equipos
- [ ] Calendario de partidos integrado
- [ ] Comentarios y reacciones en partidos

## 🔧 Configuración de Desarrollo

1. **Instalar dependencias** (ya están en el proyecto principal):
   ```bash
   npm install
   ```

2. **Ejecutar en desarrollo**:
   ```bash
   ionic serve
   ```

3. **Probar en dispositivo**:
   ```bash
   ionic cap run android --livereload
   ```

## 📞 Soporte

Para problemas específicos de la aplicación móvil, revisar:
- Logs de Capacitor en DevTools
- Console de Android Studio para debugging
- Network tab para problemas de API

## 🔄 Actualización desde Web

La aplicación móvil comparte:
- ✅ **Backend y APIs**
- ✅ **Servicios y lógica de negocio**
- ✅ **Configuración base del proyecto**

Solo mantiene separado:
- 📱 **Interfaces de usuario móviles**
- 📱 **Navegación específica para móvil**
- 📱 **Componentes optimizados para touch**

Esta arquitectura permite mantener ambas versiones sincronizadas automáticamente.
