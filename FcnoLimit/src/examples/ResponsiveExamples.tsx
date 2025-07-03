import React from 'react';
import ResponsiveWrapper from '../components/layout/ResponsiveWrapper';
import { useIsMobile, useDeviceType } from '../hooks/useResponsive';

/**
 * Componente de ejemplo que muestra las diferentes formas
 * de implementar responsividad en FCnoLimit
 */
export const ResponsiveCardExample = () => {
  const isMobile = useIsMobile();
  const deviceType = useDeviceType();
  
  return (
    <div className="container mt-4">
      <h2 className={isMobile ? 'mobile-text-center' : ''}>
        Ejemplos de Implementación Responsiva
      </h2>
      
      {/* Ejemplo 1: Usando ResponsiveWrapper */}
      <ResponsiveWrapper
        mobileClassName="mobile-padding"
        tabletClassName="p-3"
        desktopClassName="p-4"
        enableMobileLayout={true}
      >
        <div className="card">
          <div className="card-header">
            <h3>Ejemplo con ResponsiveWrapper</h3>
          </div>
          <div className="card-body">
            <p>Este componente mantiene su estructura pero se adapta según el dispositivo:</p>
            <ul>
              <li>En móvil: padding reducido, layout simplificado</li>
              <li>En tablet: padding medio</li>
              <li>En desktop: padding amplio</li>
            </ul>
          </div>
        </div>
      </ResponsiveWrapper>
      
      {/* Ejemplo 2: Usando clases utilitarias CSS */}
      <div className="card mt-4 mobile-full-width">
        <div className="card-header">
          <h3>Ejemplo con clases CSS utilitarias</h3>
        </div>
        <div className="card-body">
          <div className="hidden-mobile">
            <p>Este contenido solo es visible en tablet y desktop.</p>
            <img src="https://via.placeholder.com/600x200" alt="Imagen grande" className="img-fluid" />
          </div>
          
          <div className="mobile-only">
            <p>Este contenido solo es visible en móvil.</p>
            <img src="https://via.placeholder.com/300x150" alt="Imagen pequeña" className="img-fluid" />
          </div>
          
          <p className="mobile-text-center">
            Este texto se centra solo en dispositivos móviles.
          </p>
        </div>
      </div>
      
      {/* Ejemplo 3: Usando hooks de responsividad */}
      <div className="card mt-4">
        <div className="card-header">
          <h3>Ejemplo con hooks de responsividad</h3>
        </div>
        <div className="card-body">
          <p>Estás usando un dispositivo: <strong>{deviceType}</strong></p>
          
          {isMobile ? (
            <div className="alert alert-info">
              Vista optimizada para móvil con menos elementos y diseño simplificado.
            </div>
          ) : (
            <div className="row">
              <div className="col-md-6">
                <div className="alert alert-success">
                  Vista completa con todas las funcionalidades.
                </div>
              </div>
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <p>Contenido adicional para pantallas grandes.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Ejemplo 4: Tabla responsiva */}
      <div className="card mt-4">
        <div className="card-header">
          <h3>Tabla Responsiva</h3>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className={isMobile ? "table table-to-cards" : "table"}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Equipo</th>
                  <th>Estadísticas</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td data-label="ID">1</td>
                  <td data-label="Nombre">Juan Pérez</td>
                  <td data-label="Equipo">FC Barcelona</td>
                  <td data-label="Estadísticas">10 goles, 5 asistencias</td>
                </tr>
                <tr>
                  <td data-label="ID">2</td>
                  <td data-label="Nombre">María Gómez</td>
                  <td data-label="Equipo">Real Madrid</td>
                  <td data-label="Estadísticas">8 goles, 12 asistencias</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Ejemplo 5: Layout con grid responsivo */}
      <div className="card mt-4 mb-5">
        <div className="card-header">
          <h3>Grid Responsivo</h3>
        </div>
        <div className="card-body">
          <div className="mobile-grid-2">
            <div className="card">
              <div className="card-body mobile-padding">
                <h4>Elemento 1</h4>
                <p>Descripción corta</p>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body mobile-padding">
                <h4>Elemento 2</h4>
                <p>Descripción corta</p>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body mobile-padding">
                <h4>Elemento 3</h4>
                <p>Descripción corta</p>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body mobile-padding">
                <h4>Elemento 4</h4>
                <p>Descripción corta</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveCardExample;
