# 🎯 Chatbot Flotante con Posicionamiento Dinámico

## 📱 Nueva Funcionalidad: Drag & Drop

El chatbot flotante ahora incluye funcionalidad de **arrastre y posicionamiento dinámico** para mejorar la experiencia del usuario, especialmente en dispositivos móviles.

---

## ✨ Características Principales

### 🔄 **Posicionamiento Dinámico**
- **Arrastrables en móvil**: La burbuja del chatbot se puede arrastrar libremente en dispositivos con ancho ≤ 768px
- **Posición inicial inteligente**: Aparece sobre el tab-bar móvil para no estorbar el contenido
- **Pegado inteligente**: Al soltar, la burbuja se pega automáticamente al borde más cercano (izquierdo o derecho)
- **Respeta el tab-bar**: Nunca se posiciona debajo del tab-bar de navegación móvil
- **Posicionamiento del chat**: La ventana del chatbot se posiciona automáticamente según la ubicación de la burbuja
- **Desktop normal**: En escritorio mantiene su comportamiento fijo en la esquina inferior derecha

### 🎮 **Controles de Interacción**
- **Touch & Drag**: Compatible con eventos táctiles nativos
- **Límites de pantalla**: La burbuja no puede salirse de los límites visibles
- **Feedback visual**: Durante el arrastre la burbuja cambia su apariencia (escala y opacidad)
- **Cursor dinámico**: Indicadores visuales (`grab`/`grabbing`) en móvil

### 📐 **Posicionamiento Inteligente**
- **Lado izquierdo**: Chat aparece hacia la derecha de la burbuja
- **Lado derecho**: Chat aparece hacia la izquierda de la burbuja
- **Sugerencias flotantes**: Se adaptan automáticamente al lado donde está la burbuja

---

## 🛠️ Implementación Técnica

### Estados Principales
```typescript
const [position, setPosition] = useState<Position>({ x: 20, y: 20 });
const [isDragging, setIsDragging] = useState(false);
const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
const [chatbotSide, setChatbotSide] = useState<'left' | 'right'>('right');
```

### Eventos de Drag & Drop
- **`handleTouchStart`**: Inicia el arrastre en dispositivos táctiles
- **`handleTouchMove`**: Actualiza la posición durante el arrastre
- **`handleDragEnd`**: Finaliza el arrastre y aplica el pegado inteligente

### Lógica de Pegado
```typescript
const centerX = position.x + 30; // Centro de la burbuja
if (centerX < screenWidth / 2) {
  // Pegar a la izquierda
  setPosition(prev => ({ ...prev, x: 20 }));
  setChatbotSide('left');
} else {
  // Pegar a la derecha
  setPosition(prev => ({ ...prev, x: screenWidth - 80 }));
  setChatbotSide('right');
}
```

---

## 🎨 Estilos CSS Agregados

### Clases de Estado
```css
.chatbot-toggle-btn.dragging {
  opacity: 0.8 !important;
  transform: scale(1.1) !important;
  z-index: 1002 !important;
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.5) !important;
}
```

### Responsive Design
```css
@media (max-width: 768px) {
  .chatbot-toggle-btn {
    min-width: 60px !important;
    min-height: 60px !important;
    touch-action: none !important;
    user-select: none !important;
    cursor: grab !important;
  }
  
  .chatbot-toggle-btn.dragging {
    cursor: grabbing !important;
  }
}
```

### Posicionamiento Dinámico
```css
.chatbot-window {
  position: absolute;
  z-index: 1001;
}

.floating-chatbot:not(.dragging) {
  transition: all 0.3s ease !important;
}
```

---

## 📱 Experiencia de Usuario

### **En Móvil (≤ 768px)**
1. **Posición inicial**: La burbuja aparece sobre el tab-bar para no estorbar
2. **Toque inicial**: La burbuja muestra cursor `grab`
3. **Durante arrastre**: 
   - Cursor cambia a `grabbing`
   - Burbuja se escala (110%) y reduce opacidad (80%)
   - Sombra más pronunciada para feedback visual
   - No puede ir debajo del tab-bar de navegación
4. **Al soltar**: Animación suave hacia el borde más cercano
5. **Chat posicionado**: Aparece del lado correcto según la posición de la burbuja

### **En Desktop (> 768px)**
- Comportamiento tradicional fijo en esquina inferior derecha
- Sin funcionalidad de arrastre
- Cursor normal (`pointer`)

---

## 🔧 Configuración y Personalización

### Límites de Posición
```typescript
// Mantener dentro de los límites de pantalla considerando el tab-bar
const maxX = window.innerWidth - 60;  // 60px = ancho de burbuja
const tabBarHeight = 80;              // Altura del tab-bar móvil
const maxY = window.innerHeight - tabBarHeight - 60 - 10; // Con margen

setPosition({
  x: Math.max(0, Math.min(newX, maxX)),
  y: Math.max(10, Math.min(newY, maxY)) // Mínimo 10px desde arriba
});
```

### Posición Inicial Inteligente
```typescript
// Posicionar sobre el tab-bar móvil automáticamente
const initPosition = () => {
  if (window.innerWidth <= 768) {
    const tabBarHeight = 80;
    const bubbleSize = 60;
    const margin = 10;
    
    setPosition({
      x: window.innerWidth - 80, // Esquina derecha
      y: window.innerHeight - tabBarHeight - bubbleSize - margin
    });
  }
};
```

### Distancias de Pegado
```typescript
// Distancias desde los bordes considerando el tab-bar
const leftMargin = 20;   // 20px desde borde izquierdo
const rightMargin = 80;  // 80px desde borde derecho (20px + 60px burbuja)
const tabBarHeight = 80; // Altura del tab-bar móvil
const minMargin = 10;    // Margen mínimo sobre el tab-bar
```

---

## 🎯 Beneficios

### ✅ **Accesibilidad Mejorada**
- No bloquea contenido importante
- Posición inicial sobre el tab-bar (no estorba)
- Usuario controla dónde ubicar el chatbot
- Respeta la navegación móvil nativa
- Menos interferencia con la navegación

### ✅ **Experiencia Móvil Superior**
- Aprovecha gestos táctiles nativos
- Feedback visual claro durante interacciones
- Posicionamiento intuitivo y natural

### ✅ **Compatibilidad Total**
- Funciona en todos los dispositivos
- Degradación elegante en desktop
- Mantiene funcionalidad existente

---

## 🚀 Próximas Mejoras

- [ ] **Memoria de posición**: Recordar la última posición del usuario
- [ ] **Zonas magnéticas**: Puntos de atracción específicos en la pantalla
- [ ] **Animaciones mejoradas**: Transiciones más fluidas y naturales
- [ ] **Haptic feedback**: Vibración en dispositivos compatibles
- [ ] **Posiciones preestablecidas**: Esquinas predefinidas para acceso rápido

---

## 📝 Notas de Desarrollo

- Compatible con TypeScript estricto
- Eventos táctiles manejados correctamente
- Performance optimizada para dispositivos móviles
- CSS modular y mantenible
- Accesibilidad considerada en el diseño

---

**🎉 ¡El chatbot ahora es completamente posicionable y no estorbará más!**
