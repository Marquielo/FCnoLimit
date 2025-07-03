/**
 * Este archivo implementa directamente un ResponsiveProvider simple
 * sin depender de otros archivos para evitar problemas de importación
 */

import React from 'react';

// Implementación directa del provider para evitar problemas
export const ResponsiveProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <>
      {/* Este componente simplemente renderiza los hijos */}
      {children}
    </>
  );
};
