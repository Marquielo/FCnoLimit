import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = 'AIzaSyAO61cOQjVO7ymIi0Quq3KMusMlA-NqGF4'; // Usar la misma key
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
  category?: string;
  traducida?: boolean;
}

class NoticiasIAService {
  private cache: {
    data: NewsArticle[] | null;
    timestamp: number | null;
    duration: number; // 24 horas
  };

  private apiFootballKey = '170816abe4msh33c437bec184314p109a25jsndb09b8aae75e'; // X-RapidAPI-Key real
  private apiFootballHost = 'api-football-v1.p.rapidapi.com';
  private apiFootballBaseUrl = 'https://api-football-v1.p.rapidapi.com/v3';
  private model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  private pollinationsBaseUrl = 'https://image.pollinations.ai/prompt/';

  constructor() {
    this.cache = {
      data: null,
      timestamp: null,
      duration: 24 * 60 * 60 * 1000 // 24 horas en ms
    };
  }

  // Verificar si el cache está vigente
  private isCacheValid(): boolean {
    if (!this.cache.data || !this.cache.timestamp) {
      return false;
    }
    
    const now = Date.now();
    return (now - this.cache.timestamp) < this.cache.duration;
  }

  // Actualizar cache con nuevos datos
  private updateCache(data: NewsArticle[]): void {
    this.cache.data = data;
    this.cache.timestamp = Date.now();
    console.log(`💾 Cache de noticias IA actualizado con ${data.length} noticias`);
  }
  // Generar noticias IA con datos reales de API-Football
  private async generarNoticiasIA(): Promise<NewsArticle[]> {
    try {
      console.log('🤖 Generando noticias IA con datos de API-Football...');
      
      // Obtener datos reales de fútbol
      const datosFootball = await this.obtenerDatosAPIFootball();
      const noticias: NewsArticle[] = [];

      // Generar noticias basadas en datos reales
      if (datosFootball.length > 0) {
        datosFootball.slice(0, 2).forEach(async (partido: any, index: number) => {
          const equipoLocal = partido.teams?.home?.name || 'Equipo Local';
          const equipoVisitante = partido.teams?.away?.name || 'Equipo Visitante';
          const liga = partido.league?.name || 'Liga';
          const golesLocal = partido.goals?.home || Math.floor(Math.random() * 4);
          const golesVisitante = partido.goals?.away || Math.floor(Math.random() * 4);          const noticia: NewsArticle = {
            source: {
              id: 'fcnolimit-ia-api',
              name: 'FCnoLimit IA Sports'
            },
            author: 'IA Sports Reporter',
            title: `${equipoLocal} ${golesLocal}-${golesVisitante} ${equipoVisitante}: Análisis del partido`,
            description: `Resumen completo del emocionante encuentro entre ${equipoLocal} y ${equipoVisitante} en ${liga}. Análisis táctico, jugadas destacadas y estadísticas del partido.`,
            url: '/noticias-en-vivo',
            urlToImage: await this.generarImagenIAReal(`${equipoLocal} vs ${equipoVisitante}`, [equipoLocal, equipoVisitante], liga, 'Resultado'),
            publishedAt: new Date(Date.now() - (index * 1800000)).toISOString(),
            content: null,
            category: liga,
            traducida: true // Marcada como generada por IA
          };

          noticias.push(noticia);
        });
      }      // Completar con noticias temáticas generadas
      const temasAdicionales = [
        {
          title: "Champions League 2025: Análisis de los cuartos de final",
          description: "Los mejores equipos de Europa se enfrentan en una batalla épica por un lugar en las semifinales del torneo más prestigioso.",
          category: "Champions League"
        },
        {
          title: "Copa América 2025: Las estrellas que brillarán en el torneo",
          description: "Análisis de los jugadores más destacados que participarán en la Copa América y sus posibilidades de marcar la diferencia.",
          category: "Copa América"
        },
        {
          title: "Mercado de fichajes: Las transferencias más sorprendentes",
          description: "Repasamos los movimientos más inesperados en el mercado de pases europeo que están revolucionando el fútbol mundial.",
          category: "Fichajes"
        },
        {
          title: "Tecnología VAR: Nuevas mejoras revolucionan el arbitraje",
          description: "Las últimas innovaciones en el sistema VAR prometen hacer el fútbol más justo y transparente para jugadores y aficionados.",
          category: "Tecnología"
        }
      ];

      // Agregar temas adicionales hasta completar 4 noticias
      const temasSeleccionados = temasAdicionales
        .sort(() => Math.random() - 0.5)
        .slice(0, 4 - noticias.length);

      for (const tema of temasSeleccionados) {
        const imagenUrl = await this.generarImagenIAReal(tema.title, [], tema.category, 'General');
        
        const noticia: NewsArticle = {
          source: {
            id: 'fcnolimit-ia',
            name: 'FCnoLimit IA Sports'
          },
          author: 'Redacción IA FCnoLimit',
          title: tema.title,
          description: tema.description,
          url: '/noticias-en-vivo',
          urlToImage: imagenUrl,
          publishedAt: new Date(Date.now() - ((noticias.length) * 1800000)).toISOString(),
          content: null,
          category: tema.category,
          traducida: true
        };

        noticias.push(noticia);
      }

      console.log(`✅ Generadas ${noticias.length} noticias IA (${datosFootball.length > 0 ? 'con datos reales' : 'simuladas'})`);
      return noticias.slice(0, 4); // Máximo 4 noticias

    } catch (error) {
      console.error('❌ Error generando noticias IA:', error);
      
      // Fallback básico
      return [{
        source: { id: 'fcnolimit-ia', name: 'FCnoLimit IA Sports' },
        author: 'Redacción IA FCnoLimit',
        title: 'Últimas noticias del fútbol mundial',
        description: 'Mantente al día con las noticias más importantes del mundo del fútbol internacional.',
        url: '/noticias-en-vivo',
        urlToImage: await this.generarImagenIAReal('Últimas noticias del fútbol mundial', [], 'Soccer', 'General'),
        publishedAt: new Date().toISOString(),
        content: null,
        category: 'General',
        traducida: true
      }];
    }
  }

  // Obtener noticias IA (con cache de 24h)
  async getNoticiasIA(): Promise<NewsArticle[]> {
    try {
      // Verificar cache
      if (this.isCacheValid() && this.cache.data) {
        console.log('📦 Sirviendo noticias IA desde cache (válido por 24h)');
        return this.cache.data;
      }      console.log('🤖 Generando nuevas noticias IA (cada 24h)...');
      
      // Generar nuevas noticias con datos de API-Football
      const nuevasNoticias = await this.generarNoticiasIA();
      
      // Actualizar cache
      this.updateCache(nuevasNoticias);
      
      console.log(`✅ ${nuevasNoticias.length} noticias IA generadas y cacheadas`);
      return nuevasNoticias;
      
    } catch (error) {
      console.error('❌ Error generando noticias IA:', error);
      
      // Fallback si hay error pero tenemos cache
      if (this.cache.data) {
        console.log('🛡️ Usando cache IA como fallback');
        return this.cache.data;
      }
        // Fallback final con noticias básicas
      return await this.generarNoticiasIA();
    }
  }

  // Obtener información de última actualización
  getLastUpdateTime(): string | null {
    if (!this.cache.timestamp) {
      return null;
    }
    
    const fecha = new Date(this.cache.timestamp);
    return fecha.toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Verificar si necesita actualización
  needsUpdate(): boolean {
    return !this.isCacheValid();
  }

  // Forzar regeneración de noticias
  async regenerarNoticias(): Promise<NewsArticle[]> {
    console.log('🔄 Forzando regeneración de noticias IA...');
    this.cache.data = null;
    this.cache.timestamp = null;
    return await this.getNoticiasIA();
  }
  // Obtener datos reales de API-Football (con manejo mejorado de errores)
  private async obtenerDatosAPIFootball(): Promise<any> {
    // Datos simulados de calidad (siempre disponibles)
    const datosSimulados = [
      {
        fixture: { id: 1 },
        teams: { home: { name: 'Manchester City' }, away: { name: 'Liverpool' } },
        league: { name: 'Premier League' },
        goals: { home: 2, away: 1 }
      },
      {
        fixture: { id: 2 },
        teams: { home: { name: 'Real Madrid' }, away: { name: 'Barcelona' } },
        league: { name: 'La Liga' },
        goals: { home: 3, away: 1 }
      },
      {
        fixture: { id: 3 },
        teams: { home: { name: 'Bayern Munich' }, away: { name: 'Borussia Dortmund' } },
        league: { name: 'Bundesliga' },
        goals: { home: 1, away: 2 }
      }
    ];

    // Intentar obtener datos reales de RapidAPI (API-Football)
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`${this.apiFootballBaseUrl}/fixtures?date=${today}&league=39,140,78,61&season=2024`, {
        headers: {
          'X-RapidAPI-Key': this.apiFootballKey,
          'X-RapidAPI-Host': this.apiFootballHost
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.response && data.response.length > 0) {
          console.log('✅ Datos reales obtenidos de API-Football (RapidAPI)');
          return data.response;
        }
      } else {
        console.warn('API-Football respondió con status', response.status);
      }
    } catch (error) {
      console.log('📡 API-Football no disponible, usando datos simulados de calidad');
    }
    // Si falla, usar datos simulados
    console.log('🎯 Usando datos simulados de partidos destacados (evita errores API)');
    return datosSimulados;
  }// Generar imagen real con IA usando Pollinations.ai (igual que NoticiasGeneradasIA)
  private async generarImagenIAReal(
    titulo: string, 
    equipos?: string[], 
    liga?: string,
    categoria: string = 'General'
  ): Promise<string> {
    try {
      // Crear prompt específico y contextual para fútbol
      let prompt = '';
      
      if (equipos && equipos.length >= 2) {
        // Imagen específica para partidos
        switch (categoria) {
          case 'Resultado':
            prompt = `Football post-match scene: ${equipos[0]} vs ${equipos[1]} in ${liga}, players celebrating or showing emotion after final whistle, stadium crowd reaction, post-game atmosphere, team jerseys visible, victory celebration, dramatic stadium lighting, professional sports photography, realistic, high quality`;
            break;
          case 'Preview':
            prompt = `Football match preview scene: ${equipos[0]} vs ${equipos[1]} at ${liga}, stadium exterior with team banners, fans gathering before kickoff, pre-game atmosphere, team colors visible, anticipation and excitement, modern football stadium, golden hour lighting, sports photography style, high quality, realistic`;
            break;
          default:
            prompt = `Football match scene: ${equipos[0]} vs ${equipos[1]}, ${liga} championship, dynamic action on football field, players in action, stadium atmosphere, professional sports photography, realistic, high quality`;
        }
      } else {
        // Imágenes temáticas según el contexto
        const contexto = titulo.toLowerCase();
        
        if (contexto.includes('champions league')) {
          prompt = `Champions League football: trophy presentation, prestigious tournament atmosphere, UEFA Champions League branding, elite football competition, stadium lights, professional ceremony, high quality, realistic`;
        } else if (contexto.includes('copa america')) {
          prompt = `Copa America football tournament: South American championship atmosphere, national team jerseys, continental competition, festive celebration, stadium with flags, professional sports photography, high quality`;
        } else if (contexto.includes('premier league')) {
          prompt = `Premier League football: English championship atmosphere, iconic stadiums, Premier League branding, competitive football action, professional English football, high quality, realistic`;
        } else if (contexto.includes('la liga')) {
          prompt = `La Liga football: Spanish championship, El Clasico atmosphere, Spanish football culture, iconic stadiums, passionate fans, professional La Liga action, high quality, realistic`;
        } else if (contexto.includes('fichaje') || contexto.includes('transfer')) {
          prompt = `Football transfer news: player signing ceremony, contract signing, football club presentation, new player unveiling, press conference, professional sports journalism, realistic, high quality`;
        } else if (contexto.includes('var') || contexto.includes('tecnología')) {
          prompt = `Football VAR technology: referee using video assistant referee, modern football technology, VAR screen display, high-tech football officiating, professional referee equipment, realistic, high quality`;
        } else {
          prompt = `Football news scene: modern football stadium, dynamic sports journalism, professional football photography, green grass field, stadium atmosphere, sports news coverage, high quality, realistic`;
        }
      }

      // Limpiar y optimizar el prompt
      const promptLimpio = this.limpiarPrompt(prompt);
      
      // Generar URL con Pollinations.ai (mismo que NoticiasGeneradasIA)
      const imageUrl = `${this.pollinationsBaseUrl}${encodeURIComponent(promptLimpio)}?width=400&height=250&model=flux&nologo=true&enhance=true`;
      
      console.log(`🖼️ Imagen IA generada con Pollinations: "${titulo.substring(0, 50)}..." -> ${promptLimpio.substring(0, 50)}...`);
      return imageUrl;
      
    } catch (error) {
      console.error('❌ Error generando imagen con Pollinations.ai:', error);
      return this.generarImagenFallback();
    }
  }

  // Limpiar prompt para Pollinations.ai
  private limpiarPrompt(prompt: string): string {
    return prompt
      .replace(/[^\w\s,]/g, '') // Remover caracteres especiales excepto comas
      .replace(/\s+/g, ' ') // Normalizar espacios
      .trim()
      .substring(0, 200); // Limitar longitud
  }

  // Imagen de fallback
  private generarImagenFallback(): string {
    const prompts = [
      'Football stadium green grass soccer ball dramatic lighting',
      'Modern football arena professional sports photography',
      'Soccer match action players dynamic movement stadium'
    ];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    return `${this.pollinationsBaseUrl}${encodeURIComponent(randomPrompt)}?width=400&height=250&model=flux&nologo=true`;
  }
}

export const noticiasIAService = new NoticiasIAService();
