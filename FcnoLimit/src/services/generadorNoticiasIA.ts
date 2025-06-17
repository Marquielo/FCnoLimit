import { GoogleGenerativeAI } from '@google/generative-ai';
import { generadorImagenes } from './generadorImagenesIA';

const API_KEY = 'AIzaSyAO61cOQjVO7ymIi0Quq3KMusMlA-NqGF4';
const genAI = new GoogleGenerativeAI(API_KEY);

interface NoticiaGenerada {
  titulo: string;
  contenido: string;
  resumen: string;
  categoria: string;
  fechaCreacion: string;
  equipos: string[];
  imagenUrl: string;
  descripcionImagen: string;
}

export class GeneradorNoticiasIA {
  private model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  // Generar noticia de pre-partido
  async generarNoticiaPrePartido(equipoLocal: string, equipoVisitante: string, liga: string, fecha: string): Promise<NoticiaGenerada> {
    const prompt = `
Eres un periodista deportivo profesional. Genera una noticia de pre-partido con los siguientes datos:
- Equipo Local: ${equipoLocal}
- Equipo Visitante: ${equipoVisitante}
- Liga: ${liga}
- Fecha: ${fecha}

Genera una noticia con:
1. Título llamativo (máximo 60 caracteres)
2. Contenido de 2-3 párrafos con análisis, estadísticas previas, y expectativas
3. Resumen de 1 línea (máximo 120 caracteres)
4. Descripción para imagen (máximo 100 caracteres describiendo la escena del partido)

Formato de respuesta:
TITULO: [título aquí]
RESUMEN: [resumen aquí]
DESCRIPCION_IMAGEN: [descripción para la imagen]
CONTENIDO: [contenido aquí]
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
        // Generar imagen para la noticia con contexto específico
      const imagenUrl = await generadorImagenes.generarImagenNoticia(
        equipoLocal, 
        equipoVisitante, 
        'Pre-partido', 
        liga,
        'pre-match preparation, team warm-up, stadium filling with fans'
      );
      
      return this.parsearRespuesta(response, [equipoLocal, equipoVisitante], 'Pre-partido', imagenUrl);
    } catch (error) {
      console.error('Error generando noticia de pre-partido:', error);
      throw error;
    }
  }
  // Generar noticia de post-partido
  async generarNoticiaPostPartido(
    equipoLocal: string, 
    equipoVisitante: string, 
    golesLocal: number, 
    golesVisitante: number,
    liga: string,
    eventos: any[]
  ): Promise<NoticiaGenerada> {
    const eventosTexto = eventos.slice(0, 5).map(e => 
      `${e.time.elapsed}' - ${e.type} de ${e.player?.name || 'jugador'} (${e.team.name})`
    ).join(', ');

    const prompt = `
Eres un periodista deportivo profesional. Genera una crónica de partido con los siguientes datos:
- Resultado: ${equipoLocal} ${golesLocal} - ${golesVisitante} ${equipoVisitante}
- Liga: ${liga}
- Eventos principales: ${eventosTexto}

Genera una crónica con:
1. Título llamativo con el resultado (máximo 60 caracteres)
2. Contenido de 2-3 párrafos narrando el partido, eventos clave y análisis
3. Resumen de 1 línea con lo más destacado (máximo 120 caracteres)
4. Descripción para imagen (máximo 100 caracteres describiendo la celebración o momento clave)

Formato de respuesta:
TITULO: [título aquí]
RESUMEN: [resumen aquí]
DESCRIPCION_IMAGEN: [descripción para la imagen]
CONTENIDO: [contenido aquí]
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
        // Generar imagen contextual basada en eventos del partido
      const imagenUrl = await generadorImagenes.generarImagenPorEventos(
        equipoLocal, 
        equipoVisitante, 
        eventos, 
        liga
      );
      
      return this.parsearRespuesta(response, [equipoLocal, equipoVisitante], 'Post-partido', imagenUrl);
    } catch (error) {
      console.error('Error generando noticia de post-partido:', error);
      throw error;
    }
  }
  // Generar noticia de análisis de liga
  async generarAnalisisLiga(liga: string, partidosRecientes: any[]): Promise<NoticiaGenerada> {
    const resultados = partidosRecientes.slice(0, 5).map(p => 
      `${p.teams.home.name} vs ${p.teams.away.name} - Estado: ${p.status.long}`
    ).join(', ');

    const prompt = `
Eres un periodista deportivo profesional. Genera un análisis de liga con los siguientes datos:
- Liga: ${liga}
- Partidos recientes: ${resultados}

Genera un análisis con:
1. Título sobre tendencias de la liga (máximo 60 caracteres)
2. Contenido de 2-3 párrafos analizando tendencias, equipos destacados, y estadísticas
3. Resumen con el punto más importante (máximo 120 caracteres)
4. Descripción para imagen (máximo 100 caracteres describiendo elementos de la liga)

Formato de respuesta:
TITULO: [título aquí]
RESUMEN: [resumen aquí]
DESCRIPCION_IMAGEN: [descripción para la imagen]
CONTENIDO: [contenido aquí]
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
        // Generar imagen para análisis de liga con contexto
      const imagenUrl = await generadorImagenes.generarImagenAnalisisLiga(
        liga, 
        'recent match trends, team performance statistics, league standings analysis'
      );
      
      return this.parsearRespuesta(response, [], 'Análisis', imagenUrl);
    } catch (error) {
      console.error('Error generando análisis de liga:', error);
      throw error;
    }
  }
  private parsearRespuesta(response: string, equipos: string[], categoria: string, imagenUrl: string): NoticiaGenerada {
    const lineas = response.split('\n');
    let titulo = '';
    let resumen = '';
    let contenido = '';
    let descripcionImagen = '';

    lineas.forEach(linea => {
      if (linea.startsWith('TITULO:')) {
        titulo = linea.replace('TITULO:', '').trim();
      } else if (linea.startsWith('RESUMEN:')) {
        resumen = linea.replace('RESUMEN:', '').trim();
      } else if (linea.startsWith('DESCRIPCION_IMAGEN:')) {
        descripcionImagen = linea.replace('DESCRIPCION_IMAGEN:', '').trim();
      } else if (linea.startsWith('CONTENIDO:')) {
        contenido = linea.replace('CONTENIDO:', '').trim();
      }
    });

    // Si no se encontraron los marcadores, usar el texto completo como contenido
    if (!titulo && !resumen && !contenido) {
      const parrafos = response.split('\n\n');
      titulo = parrafos[0]?.substring(0, 60) || 'Noticia deportiva';
      resumen = parrafos[1]?.substring(0, 120) || '';
      contenido = response;
      descripcionImagen = `Imagen relacionada con ${equipos.join(' vs ')}`;
    }

    return {
      titulo: titulo || 'Noticia deportiva',
      contenido: contenido || response,
      resumen: resumen || titulo.substring(0, 120),
      categoria,
      fechaCreacion: new Date().toISOString(),
      equipos,
      imagenUrl: imagenUrl || '',
      descripcionImagen: descripcionImagen || `Imagen de ${categoria.toLowerCase()}`
    };
  }
}

export const generadorNoticias = new GeneradorNoticiasIA();
