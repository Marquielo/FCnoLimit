# 📱 Estrategia de Responsividad FCnoLimit

## 🎯 Solución implementada

Hemos implementado un sistema completo de responsividad que se adapta automáticamente a dispositivos móviles sin modificar la estructura ni el diseño original de los componentes. La solución está basada en los siguientes elementos:

### 1. Sistema CSS global responsivo
- Media queries centralizadas
- Clases utilitarias para casos de uso comunes
- Adaptaciones automáticas para componentes estándar

### 2. Componentes responsivos auxiliares
- `ResponsiveWrapper`: Envoltorio que aplica estilos según dispositivo
- `ResponsiveText`: Muestra contenido diferente según dispositivo
- `ResponsiveProvider`: Proveedor global de responsividad

### 3. Hooks de detección de dispositivo
- `useIsMobile()`: Detecta si es smartphone
- `useIsTablet()`: Detecta si es tablet
- `useDeviceType()`: Retorna 'mobile', 'tablet' o 'desktop'

## 🚀 Uso del sistema

### Para hacer un componente responsivo:

1. **Usar ResponsiveWrapper**:
```tsx
<ResponsiveWrapper mobileClassName="clase-mobile">
  <div>Tu contenido</div>
</ResponsiveWrapper>
```

2. **Usar clases CSS utilitarias**:
```tsx
<div className="mobile-full-width hidden-desktop">
  Contenido adaptado
</div>
```

3. **Usar hooks para lógica condicional**:
```tsx
const isMobile = useIsMobile();

return (
  <div>
    {isMobile ? <VersionSimple /> : <VersionCompleta />}
  </div>
);
```

## 📚 Documentación

Para más detalles sobre cómo implementar responsividad:

1. [Guía completa de responsividad](./RESPONSIVE_GUIDE.md)
2. [Ejemplo de implementación](./src/examples/ResponsiveExamples.tsx)
3. Script para analizar componentes existentes: `node scripts/analyze-component-for-responsive.js src/components/MiComponente.tsx`

---

Esta estrategia permite:
- Mantener la estructura original
- Evitar duplicación de código
- Centralizar la lógica de responsividad
- Facilitar mantenimiento
- Mejor experiencia en dispositivos móviles
