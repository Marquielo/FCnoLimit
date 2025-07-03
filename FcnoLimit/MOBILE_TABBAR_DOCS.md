# 📱 MobileTabBar - Componente de Navegación Móvil

## 🎯 Descripción
El `MobileTabBar` es un componente de navegación optimizado para la app móvil que reemplaza automáticamente al navbar tradicional cuando la app se ejecuta en un dispositivo móvil.

## ✨ Características
- ✅ **Detección automática**: Solo se muestra en smartphones (ancho <= 768px)
- ✅ **Navegación intuitiva**: Tabs en la parte inferior (patrón nativo)
- ✅ **Dropdown de Equipos**: Botón equipos con lista de equipos populares
- ✅ **Navegación por Roles**: Botones específicos según el rol del usuario
- ✅ **Responsive**: Se adapta a diferentes tamaños de pantalla
- ✅ **Estados Activos**: Detecta automáticamente la página actual
- ✅ **Accesible**: Compatible con lectores de pantalla

## 🔧 **NUEVO: Dropdown de Equipos**

El botón "Equipos" ahora funciona como dropdown (igual que en el navbar):
- Muestra 8 equipos aleatorios ("más buscados")
- Permite navegar directamente a un equipo específico
- Incluye botón "Ver todos los equipos"
- Se abre desde abajo con overlay y animaciones

## 🚫 **NUEVO: Footer Oculto en Móvil**

### ✅ **Implementación Automática**

El footer ahora se oculta automáticamente en dispositivos móviles (smartphones) sin afectar la versión web:

#### 🔧 **Métodos de Ocultación**

1. **CSS Media Query Global**:
```css
@media (max-width: 768px) {
  .footer,
  .footer-separator,
  footer,
  .mobile-hidden {
    display: none !important;
  }
}
```

2. **Clase CSS `mobile-hidden`**:
```tsx
<div className="mobile-hidden">
  <Footer />
</div>
```

3. **CSS Inline en ResponsiveLayout**:
```css
.footer,
.footer-separator,
footer {
  display: none !important;
}
```

#### 📱 **Resultado**

- **Web (Desktop/Tablet)**: Footer visible normal
- **Smartphone**: Footer completamente oculto
- **Espacio**: El contenido se extiende hasta el TabBar
- **UX**: Navegación más limpia y nativa en móvil

### 📂 **Páginas Convertidas**

Las siguientes páginas han sido actualizadas para ocultar el footer en móvil:

✅ `src/pages/home/inicio/InicioPage.tsx`
✅ `src/pages/home/equipos/EquiposPage.tsx`
✅ `src/pages/home/partidos/PartidosPage.tsx`
✅ `src/pages/home/campeonato/CampeonatoPage.tsx`
✅ `src/pages/home/perfil/PerfilPage.tsx`
✅ `src/pages/home/noticias/NoticiasPage.tsx`

### 🔄 **Para Aplicar a Nuevas Páginas**

```tsx
// Opción 1: Envolver el Footer con clase mobile-hidden
<div className="mobile-hidden">
  <Footer />
</div>

// Opción 2: Usar ResponsiveLayout (recomendado)
<ResponsiveLayout showTabBar={true}>
  <IonContent>
    {/* Contenido */}
    <div className="mobile-hidden">
      <Footer />
    </div>
  </IonContent>
</ResponsiveLayout>
```

## 🏗️ Componentes Creados

### 1. **MobileTabBar.tsx**
Componente principal del TabBar con navegación optimizada para móvil.

### 2. **MobileTabBar.css**
Estilos específicos con animaciones y efectos nativos.

### 3. **ResponsiveLayout.tsx**
Layout inteligente que detecta la plataforma y muestra el componente adecuado.

### 4. **useTabNavigation.ts**
Hook personalizado para manejar la navegación entre tabs.

### 5. **MobileHomePage.tsx**
Página de ejemplo que muestra cómo implementar el nuevo layout.

## 🚀 Uso Básico

### En una página:
```tsx
import ResponsiveLayout from '../../components/layout/ResponsiveLayout';

const MiPagina: React.FC = () => {
  return (
    <ResponsiveLayout showTabBar={true}>
      <div>
        <h1>Mi contenido</h1>
        {/* Tu contenido aquí */}
      </div>
    </ResponsiveLayout>
  );
};
```

### Configuración de tabs:
Los tabs se configuran automáticamente según:
- **Usuario no autenticado**: Inicio, Partidos, Equipos, Noticias
- **Usuario normal**: + Perfil
- **Administrador**: + Admin

## 🎨 Personalización

### Agregar nuevos tabs:
```tsx
// En MobileTabBar.tsx
const baseTabs = [
  // ... tabs existentes
  {
    tab: 'nuevo-tab',
    href: '/nueva-ruta',
    icon: nuevoIcono,
    label: 'Nuevo'
  }
];
```

### Personalizar estilos:
```css
/* En MobileTabBar.css */
.mobile-tab-bar {
  --background: tu-color-personalizado;
}
```

## 📱 Funcionamiento

### En app móvil:
- ✅ Muestra TabBar en la parte inferior
- ✅ Navegación táctil optimizada
- ✅ Animaciones suaves
- ✅ Safe area support (notch)

### En navegador web:
- ✅ TabBar oculto automáticamente
- ✅ Navbar tradicional disponible
- ✅ Sin interferencias

## 🔧 Implementación en páginas existentes

Para implementar en tus páginas existentes:

1. **Envuelve tu contenido** con `ResponsiveLayout`
2. **Agrega padding bottom** en móvil para el TabBar
3. **Usa el hook** `useTabNavigation` para navegación

```tsx
// Antes
const MiPagina = () => (
  <div>Mi contenido</div>
);

// Después
const MiPagina = () => (
  <ResponsiveLayout>
    <div>Mi contenido</div>
  </ResponsiveLayout>
);
```

## 🎯 Próximos pasos

1. **Implementar en páginas existentes**: Reemplazar layouts actuales
2. **Agregar más funcionalidades**: Gestos, animaciones avanzadas
3. **Personalización por usuario**: Tabs favoritos, orden personalizable
4. **Notificaciones**: Sistema de badges dinámico

## 📦 Archivos modificados/creados

```
src/
├── components/
│   ├── mobile/
│   │   ├── MobileTabBar.tsx      ✨ NUEVO
│   │   └── MobileTabBar.css      ✨ NUEVO
│   └── layout/
│       └── ResponsiveLayout.tsx  ✨ NUEVO
├── hooks/
│   └── useTabNavigation.ts       ✨ NUEVO
├── pages/
│   └── mobile/
│       └── MobileHomePage.tsx    ✨ NUEVO (ejemplo)
└── utils/
    └── platformDetection.ts      ✅ EXISTENTE
```

¡El TabBar está listo para usarse! 🚀

## 6. FloatingChatbot Drag & Drop en Móvil

### Funcionalidad Implementada
La burbuja del FloatingChatbot ahora es **movible en dispositivos móviles**, permitiendo a los usuarios arrastrarla a cualquier posición en la pantalla para una mejor experiencia de usuario.

### Características:
- **Drag & Drop táctil**: La burbuja se puede arrastrar tocando y moviendo en dispositivos móviles
- **Pegado inteligente**: Al soltar, la burbuja se pega automáticamente al borde izquierdo o derecho más cercano
- **Posicionamiento dinámico**: El chatbot se posiciona automáticamente según la ubicación de la burbuja
- **Límites de pantalla**: La burbuja no puede salirse de los límites visibles de la pantalla
- **Solo en móvil**: Esta funcionalidad solo está activa en dispositivos con ancho ≤ 768px

### Implementación Técnica:

#### Estados y Referencias:
```typescript
const [isDragging, setIsDragging] = useState(false);
const [position, setPosition] = useState({ x: 20, y: 20 });
const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
const bubbleRef = useRef<HTMLIonButtonElement>(null);
const [isMobile, setIsMobile] = useState(false);
```

#### Eventos Táctiles:
- **onTouchStart**: Inicia el arrastre y calcula el offset inicial
- **onTouchMove**: Actualiza la posición durante el arrastre
- **onTouchEnd**: Finaliza el arrastre y aplica el pegado a los bordes

#### Posicionamiento Inteligente:
- La burbuja se posiciona inicialmente en la esquina inferior derecha
- Durante el arrastre, respeta los límites de la pantalla
- Al soltar, se pega al borde más cercano (izquierdo o derecho)
- El chatbot se posiciona automáticamente según la ubicación de la burbuja

### Estilos CSS Específicos:

```css
@media (max-width: 768px) {
  .chatbot-toggle-btn {
    min-width: 60px;
    min-height: 60px;
    touch-action: none;
    user-select: none;
  }

  .chatbot-toggle-btn.dragging {
    opacity: 0.8;
    transform: scale(1.1);
    z-index: 1001;
  }
}
```

### Experiencia de Usuario:
1. **Identificación visual**: El cursor cambia a "grab" en móvil
2. **Feedback durante arrastre**: La burbuja se hace ligeramente más grande y transparente
3. **Animación suave**: Transiciones fluidas al pegar a los bordes
4. **Prevención de clicks accidentales**: El click no se ejecuta si se está arrastrando

### Compatibilidad:
- ✅ **Móvil**: Funcionalidad completa de drag & drop
- ✅ **Desktop**: Comportamiento normal (fijo en esquina inferior derecha)
- ✅ **Responsive**: Se adapta automáticamente según el tamaño de pantalla

---
