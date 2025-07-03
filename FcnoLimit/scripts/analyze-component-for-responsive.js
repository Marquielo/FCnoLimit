/**
 * Script para analizar un componente y dar recomendaciones sobre cómo hacerlo responsivo
 * Uso: node analyze-component-for-responsive.js <ruta-al-componente>
 */

const fs = require('fs');
const path = require('path');

// Verificar argumentos
if (process.argv.length < 3) {
  console.error('Uso: node analyze-component-for-responsive.js <ruta-al-componente>');
  process.exit(1);
}

// Ruta del componente
const componentPath = process.argv[2];
const fullPath = path.resolve(process.cwd(), componentPath);

// Verificar si el archivo existe
if (!fs.existsSync(fullPath)) {
  console.error(`El archivo no existe: ${fullPath}`);
  process.exit(1);
}

// Leer el contenido del archivo
const content = fs.readFileSync(fullPath, 'utf8');

// Análisis del componente
analyzeComponent(content, fullPath);

/**
 * Analiza un componente y da recomendaciones para hacerlo responsivo
 */
function analyzeComponent(content, filePath) {
  console.log(`\n🔍 ANÁLISIS DE COMPONENTE PARA RESPONSIVIDAD`);
  console.log(`📄 Archivo: ${filePath}`);
  console.log(`\n============================================\n`);

  // Detección básica de tipo de componente
  const componentType = detectComponentType(content);
  console.log(`🏷️  Tipo detectado: ${componentType}`);

  // Análisis de uso actual de responsividad
  const responsiveAnalysis = analyzeResponsiveUsage(content);
  console.log(`\n📱 ANÁLISIS DE RESPONSIVIDAD ACTUAL:`);
  
  if (responsiveAnalysis.hasResponsiveImport) {
    console.log(`✅ Ya importa herramientas de responsividad`);
  } else {
    console.log(`❌ No importa herramientas de responsividad`);
  }

  if (responsiveAnalysis.usesMobileHook) {
    console.log(`✅ Ya usa hooks de detección de móvil`);
  } else {
    console.log(`❌ No usa hooks de detección de móvil`);
  }

  if (responsiveAnalysis.usesResponsiveClasses) {
    console.log(`✅ Ya usa clases CSS responsivas`);
  } else {
    console.log(`❌ No usa clases CSS responsivas`);
  }

  if (responsiveAnalysis.usesResponsiveWrapper) {
    console.log(`✅ Ya usa ResponsiveWrapper`);
  } else {
    console.log(`❌ No usa ResponsiveWrapper`);
  }

  // Recomendar enfoque según tipo de componente
  console.log(`\n🚀 RECOMENDACIONES:`);
  
  const recommendations = getRecommendations(componentType, responsiveAnalysis, content);
  recommendations.forEach((recommendation, index) => {
    console.log(`${index + 1}. ${recommendation}`);
  });

  // Ejemplo de código para implementar
  console.log(`\n📝 EJEMPLO DE IMPLEMENTACIÓN:`);
  const implementationExample = getImplementationExample(componentType, responsiveAnalysis, content);
  console.log(implementationExample);

  console.log(`\n============================================\n`);
  console.log(`✨ RESUMEN:`);
  console.log(`Este componente ${responsiveAnalysis.alreadyResponsive ? 'YA TIENE' : 'NECESITA'} implementación responsiva.`);
  if (!responsiveAnalysis.alreadyResponsive) {
    console.log(`La mejor estrategia es: ${getBestStrategy(componentType, responsiveAnalysis)}`);
  }
  console.log(`\nPara más información consulta RESPONSIVE_GUIDE.md`);
}

/**
 * Detecta el tipo básico de componente
 */
function detectComponentType(content) {
  if (content.includes('<table') || content.includes('<thead') || content.includes('<tbody')) {
    return 'tabla';
  } else if (content.includes('<form') || content.includes('onSubmit=')) {
    return 'formulario';
  } else if (content.includes('card') || content.includes('tarjeta') || content.includes('<ion-card')) {
    return 'tarjeta';
  } else if (content.includes('grid') || content.includes('row') && content.includes('col-')) {
    return 'grid';
  } else if (content.includes('button') || content.includes('<ion-button')) {
    return 'botones';
  } else if (content.includes('list') || content.includes('<ul') || content.includes('<ol') || content.includes('<ion-list')) {
    return 'lista';
  } else if (content.includes('input') || content.includes('select') || content.includes('textarea')) {
    return 'inputs';
  } else {
    return 'componente genérico';
  }
}

/**
 * Analiza el uso actual de responsividad en el componente
 */
function analyzeResponsiveUsage(content) {
  const result = {
    hasResponsiveImport: false,
    usesMobileHook: false,
    usesResponsiveClasses: false,
    usesResponsiveWrapper: false,
    alreadyResponsive: false
  };

  // Verificar importaciones
  result.hasResponsiveImport = (
    content.includes("import { useIsMobile") || 
    content.includes("import ResponsiveWrapper") ||
    content.includes("import { useDeviceType")
  );

  // Verificar uso de hooks
  result.usesMobileHook = (
    content.includes("useIsMobile") || 
    content.includes("useIsTablet") || 
    content.includes("useDeviceType")
  );

  // Verificar uso de clases CSS responsivas
  result.usesResponsiveClasses = (
    content.includes("mobile-only") ||
    content.includes("hidden-mobile") ||
    content.includes("mobile-text-center") ||
    content.includes("mobile-full-width") ||
    content.includes("mobile-grid") ||
    content.includes("mobile-padding") ||
    content.includes("mobile-no-margin") ||
    content.includes("mobile-stack")
  );

  // Verificar uso de ResponsiveWrapper
  result.usesResponsiveWrapper = content.includes("<ResponsiveWrapper");

  // Determinar si ya es responsivo
  result.alreadyResponsive = 
    result.usesMobileHook || 
    result.usesResponsiveClasses || 
    result.usesResponsiveWrapper;

  return result;
}

/**
 * Genera recomendaciones basadas en el tipo de componente
 */
function getRecommendations(componentType, analysis, content) {
  const recommendations = [];

  if (!analysis.hasResponsiveImport) {
    recommendations.push(`Importar las herramientas de responsividad necesarias:
    import ResponsiveWrapper from '../components/layout/ResponsiveWrapper';
    import { useIsMobile, useDeviceType } from '../hooks/useResponsive';`);
  }

  switch (componentType) {
    case 'tabla':
      recommendations.push("Envolver la tabla en un div con clase 'table-responsive'");
      recommendations.push("En móvil, aplicar clase 'table-to-cards' para transformar la tabla en cards");
      recommendations.push("Agregar atributos data-label a las celdas <td> para mostrar los títulos en vista de cards");
      break;
    case 'formulario':
      recommendations.push("Aplicar clase 'mobile-stack' en móvil para apilar campos verticalmente");
      recommendations.push("Reducir padding y márgenes en elementos del formulario en móvil");
      recommendations.push("Aumentar tamaño de inputs a 16px para evitar zoom en iOS");
      recommendations.push("Hacer botones 'mobile-btn-full' en móvil");
      break;
    case 'tarjeta':
      recommendations.push("Aplicar 'mobile-full-width' para ocupar todo el ancho en móvil");
      recommendations.push("Reducir padding interno en móvil con 'mobile-padding'");
      recommendations.push("Considerar ocultar elementos decorativos con 'hidden-mobile'");
      break;
    case 'grid':
      recommendations.push("Usar 'mobile-grid-1' o 'mobile-grid-2' según necesidad");
      recommendations.push("Considerar 'mobile-stack' para apilar elementos en móvil");
      break;
    case 'botones':
      recommendations.push("Aplicar 'mobile-btn-full' para botones principales");
      recommendations.push("Agrupar botones secundarios en un dropdown en móvil");
      break;
    case 'lista':
      recommendations.push("Reducir padding y margen en móvil");
      recommendations.push("Si es una lista con muchos datos, considerar una versión simplificada para móvil");
      break;
    default:
      recommendations.push("Envolver el componente con ResponsiveWrapper");
      recommendations.push("Usar hook useIsMobile() para lógica condicional");
      recommendations.push("Aplicar clases utilitarias según necesidades (mobile-padding, etc)");
  }

  return recommendations;
}

/**
 * Obtiene la mejor estrategia según el tipo de componente
 */
function getBestStrategy(componentType, analysis) {
  switch (componentType) {
    case 'tabla':
      return "Transformación de tabla a cards en móvil";
    case 'formulario':
      return "Apilado vertical de campos + botones a ancho completo";
    case 'tarjeta':
      return "Ajuste de padding y márgenes + ancho completo";
    case 'grid':
      return "Cambio a 1 o 2 columnas en móvil";
    case 'botones':
      return "Botones a ancho completo y reorganización";
    case 'lista':
      return "Simplificación y ajuste de espaciado";
    default:
      return "ResponsiveWrapper + hooks condicionales";
  }
}

/**
 * Genera un ejemplo de implementación basado en el tipo de componente
 */
function getImplementationExample(componentType, analysis, content) {
  let example = '';

  switch (componentType) {
    case 'tabla':
      example = `
// Importaciones
import { useIsMobile } from '../hooks/useResponsive';

const MiComponenteTabla = () => {
  // Hook para detectar móvil
  const isMobile = useIsMobile();
  
  return (
    <div className="table-responsive">
      <table className={isMobile ? "table table-to-cards" : "table"}>
        <thead>
          <tr>
            <th>Columna 1</th>
            <th>Columna 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td data-label="Columna 1">Dato 1</td>
            <td data-label="Columna 2">Dato 2</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};`;
      break;
    case 'formulario':
      example = `
// Importaciones
import ResponsiveWrapper from '../components/layout/ResponsiveWrapper';
import { useIsMobile } from '../hooks/useResponsive';

const MiFormulario = () => {
  const isMobile = useIsMobile();
  
  return (
    <ResponsiveWrapper
      mobileClassName="mobile-padding"
      enableMobileLayout={true}
    >
      <form className={isMobile ? "mobile-stack" : ""}>
        <div className="form-group">
          <label>Campo 1</label>
          <input type="text" className="form-control" />
        </div>
        
        <div className="form-group">
          <label>Campo 2</label>
          <input type="text" className="form-control" />
        </div>
        
        <button type="submit" className={\`btn btn-primary \${isMobile ? 'mobile-btn-full' : ''}\`}>
          Enviar
        </button>
      </form>
    </ResponsiveWrapper>
  );
};`;
      break;
    case 'tarjeta':
      example = `
// Importaciones
import { useIsMobile } from '../hooks/useResponsive';

const MiTarjeta = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className={\`card \${isMobile ? 'mobile-full-width mobile-padding' : ''}\`}>
      <div className="card-header">
        <h3 className={isMobile ? 'mobile-text-center' : ''}>Título</h3>
      </div>
      <div className="card-body">
        <p>Contenido principal</p>
        
        {/* Contenido que solo se muestra en desktop */}
        <div className="hidden-mobile">
          <p>Detalles adicionales...</p>
        </div>
        
        <button className={\`btn btn-primary \${isMobile ? 'mobile-btn-full' : ''}\`}>
          Acción
        </button>
      </div>
    </div>
  );
};`;
      break;
    default:
      example = `
// Importaciones
import ResponsiveWrapper from '../components/layout/ResponsiveWrapper';
import { useIsMobile } from '../hooks/useResponsive';

const MiComponente = () => {
  const isMobile = useIsMobile();
  
  return (
    <ResponsiveWrapper
      mobileClassName="mobile-padding"
      enableMobileLayout={true}
    >
      <div className="contenedor">
        <h2 className={isMobile ? 'mobile-text-center' : ''}>Título</h2>
        
        <div className={isMobile ? 'mobile-stack' : 'row'}>
          <div className={isMobile ? '' : 'col-md-6'}>
            <p>Contenido principal</p>
          </div>
          
          <div className={isMobile ? '' : 'col-md-6'}>
            {/* Simplificar o adaptar este contenido en móvil */}
            <p>Contenido secundario {isMobile && 'simplificado'}</p>
          </div>
        </div>
        
        {/* Contenido opcional solo para desktop */}
        <div className="hidden-mobile">
          <p>Detalles adicionales...</p>
        </div>
      </div>
    </ResponsiveWrapper>
  );
};`;
  }

  return example;
}
