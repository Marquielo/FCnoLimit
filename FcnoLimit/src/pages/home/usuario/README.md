# Página de Perfil de Usuario - PerfilUsuario

## 📍 Ubicación
`src/pages/home/usuario/PerfilUsuario.tsx`
`src/pages/home/usuario/PerfilUsuario.css`

## 🎯 Funcionalidades

### ✨ Características principales:
- **Diseño elegante y moderno** con banner personalizado
- **Totalmente responsivo** - se adapta a web, tablet y móvil
- **Avatar personalizable** con botón de edición
- **Información detallada** del usuario organizada en cards
- **Estadísticas deportivas** (para jugadores)
- **Acciones rápidas** para navegar a otras secciones
- **Integración completa** con el sistema de navegación

### 📱 Adaptación móvil:
- **Banner optimizado** para pantallas pequeñas
- **Grid responsivo** que se adapta al tamaño de pantalla
- **TabBar móvil** integrado
- **Botones táctiles** optimizados para móvil
- **Espaciado inteligente** que considera el tab bar

### 🎨 Elementos visuales:
- **Banner con imagen de fondo** usando la misma estética de la app
- **Avatar circular** con borde y sombras elegantes
- **Cards con animaciones** y efectos hover
- **Iconos consistentes** con el resto de la aplicación
- **Gradientes y sombras** que dan profundidad

## 🔧 Estructura de datos

### Usuario base:
```typescript
interface UsuarioInfo {
  id: number;
  nombre_completo: string;
  email: string;
  telefono?: string;
  fecha_nacimiento?: string;
  ciudad?: string;
  rol: string;
  fecha_registro: string;
  imagen_perfil?: string;
  estadisticas?: EstadisticasJugador;
  equipo_actual?: EquipoInfo;
}
```

### Estadísticas (jugadores):
- Partidos jugados
- Goles
- Asistencias  
- Tarjetas amarillas
- Tarjetas rojas

## 🛠 Integración

### Rutas:
- **Ruta principal**: `/perfil`
- **Protegida**: Requiere autenticación
- **Accesible desde**:
  - Menú de usuario (web)
  - TabBar móvil
  - Enlaces directos

### Navegación:
- **NavBar**: Enlace en menú desplegable de usuario
- **MobileTabBar**: Botón dedicado en acciones de usuario
- **Redirecciones**: A configuración, estadísticas, etc.

## 📊 Cards incluidas:

1. **Información Personal**
   - Email, teléfono, fecha de nacimiento
   - Ciudad, fecha de registro
   - Iconos descriptivos

2. **Estadísticas** (solo jugadores)
   - Grid de estadísticas deportivas
   - Valores destacados con colores

3. **Acciones Rápidas**
   - Navegación a secciones principales
   - Botones con iconos y hover effects

## 🎯 Características técnicas:

- **Hook personalizado** para detección móvil
- **Estado local** para datos del usuario
- **Integración con localStorage** para datos persistentes
- **Manejo de errores** y estados de carga
- **Animaciones CSS** suaves y elegantes
- **Accesibilidad** con focus states y navegación por teclado

## 🚀 Futuras mejoras:

- Conectar con API real para datos dinámicos
- Funcionalidad de edición de perfil
- Subida de imagen de avatar
- Más estadísticas detalladas
- Integración con equipos y competiciones
