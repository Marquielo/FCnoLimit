import axios from 'axios';

// API Key de NewsData.io (más permisivo para producción)
const NEWSDATA_API_KEY = 'pub_9e484407c75243eda9e6ca5445842aa4';
const NEWSDATA_BASE_URL = 'https://newsdata.io/api/1';

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
}

interface NewsDataResponse {
  status: string;
  totalResults: number;
  results: NewsDataArticle[];
  nextPage?: string;
}

interface NewsDataArticle {
  article_id: string;
  title: string;
  link: string;
  keywords?: string[];
  creator?: string[];
  video_url?: string;
  description?: string;
  content?: string;
  pubDate: string;
  image_url?: string;
  source_id: string;
  source_priority: number;
  country?: string[];
  category: string[];
  language: string;
}

export class NewsAPIService {
  private apiKey: string;
  private cache: {
    data: NewsArticle[] | null;
    timestamp: number | null;
    duration: number; // 15 minutos
  };
  constructor(apiKey: string = NEWSDATA_API_KEY) {
    this.apiKey = apiKey;
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

  // Limpiar cache manualmente
  public clearCache(): void {
    this.cache.data = null;
    this.cache.timestamp = null;
    console.log('🗑️ Cache de noticias limpiado');
  }

  // Actualizar cache con nuevos datos
  private updateCache(data: NewsArticle[]): void {
    this.cache.data = data;
    this.cache.timestamp = Date.now();
    console.log(`💾 Cache actualizado con ${data.length} noticias`);
  }

  // Convertir artículo de NewsData.io al formato esperado
  private convertToNewsArticle(article: NewsDataArticle): NewsArticle {
    return {
      source: {
        id: article.source_id,
        name: this.formatSourceName(article.source_id)
      },
      author: article.creator?.[0] || null,
      title: article.title,
      description: article.description || null,
      url: article.link,
      urlToImage: article.image_url || null,
      publishedAt: article.pubDate,
      content: article.content || null,
      category: article.category?.[0] || 'sports'
    };
  }

  // Formatear nombre de fuente
  private formatSourceName(sourceId: string): string {
    const sourceNames: { [key: string]: string } = {
      'espn': 'ESPN',
      'cbs-sports': 'CBS Sports',
      'bbc-sport': 'BBC Sport',
      'sky-sports': 'Sky Sports',
      'cnn': 'CNN Sports',
      'fox-sports': 'Fox Sports'
    };
    return sourceNames[sourceId] || sourceId.replace('-', ' ').toUpperCase();
  }

  // 🔄 MÉTODO PARA FORZAR ACTUALIZACIÓN DE NOTICIAS
  async refreshNews(limit: number = 10): Promise<NewsArticle[]> {
    console.log('🔄 Forzando actualización de noticias...');
    this.clearCache();
    return await this.getSoccerNews(limit, true);
  }
  // 📅 OBTENER ÚLTIMA FECHA DE ACTUALIZACIÓN
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

  // 🕐 OBTENER PRÓXIMA ACTUALIZACIÓN
  getNextUpdateTime(): string | null {
    if (!this.cache.timestamp) {
      return null;
    }
    
    const proximaActualizacion = new Date(this.cache.timestamp + this.cache.duration);
    return proximaActualizacion.toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // ⏳ TIEMPO RESTANTE PARA PRÓXIMA ACTUALIZACIÓN
  getTimeUntilNextUpdate(): string | null {
    if (!this.cache.timestamp) {
      return null;
    }
    
    const now = Date.now();
    const nextUpdate = this.cache.timestamp + this.cache.duration;
    const remaining = nextUpdate - now;
    
    if (remaining <= 0) {
      return 'Actualizando...';
    }
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  // ⏰ VERIFICAR SI NECESITA ACTUALIZACIÓN
  needsUpdate(): boolean {
    return !this.isCacheValid();
  }
  // Obtener noticias de soccer/fútbol con actualización automática cada 24h
  async getSoccerNews(limit: number = 10, forceRefresh: boolean = false): Promise<NewsArticle[]> {
    try {
      // Verificar cache (válido por 24 horas)
      if (!forceRefresh && this.isCacheValid() && this.cache.data) {
        console.log('📦 Sirviendo noticias desde cache (válido por 24h)');
        return this.cache.data.slice(0, limit);
      }

      console.log('🔄 Obteniendo noticias frescas desde NewsData.io (actualización cada 24h)...');
        // Usar el endpoint /latest específico que proporcionaste
      const response = await axios.get(`${NEWSDATA_BASE_URL}/latest`, {
        params: {
          apikey: this.apiKey,
          q: 'soccer',
          size: 10 // Máximo para obtener más noticias
        }
      });

      const data = response.data as NewsDataResponse;
      
      if (!data.results || data.results.length === 0) {
        console.warn('⚠️ No se encontraron noticias de soccer');
        // Si no hay noticias nuevas pero tenemos cache, usarlo
        return this.cache.data || [];
      }

      // Filtrar solo noticias realmente relacionadas con soccer/football
      const noticiasFiltradasSoccer = data.results.filter((article: NewsDataArticle) => {
        const textoCompleto = `${article.title} ${article.description || ''}`.toLowerCase();
        return textoCompleto.includes('soccer') || 
               textoCompleto.includes('football') || 
               textoCompleto.includes('premier league') ||
               textoCompleto.includes('la liga') ||
               textoCompleto.includes('champions league') ||
               textoCompleto.includes('messi') ||
               textoCompleto.includes('ronaldo') ||
               textoCompleto.includes('barcelona') ||
               textoCompleto.includes('real madrid') ||
               textoCompleto.includes('manchester') ||
               textoCompleto.includes('liverpool') ||
               textoCompleto.includes('fifa') ||
               textoCompleto.includes('uefa') ||
               textoCompleto.includes('world cup') ||
               textoCompleto.includes('copa del mundo');
      });

      const noticiasConvertidas = noticiasFiltradasSoccer.map((article: NewsDataArticle) => this.convertToNewsArticle(article));
      
      // Actualizar cache (válido por 24 horas)
      this.updateCache(noticiasConvertidas);
      
      console.log(`✅ Cache actualizado: ${noticiasConvertidas.length} noticias (próxima actualización en 24h)`);
      return noticiasConvertidas.slice(0, limit);
    } catch (error) {
      console.error('❌ Error obteniendo noticias de soccer desde NewsData.io:', error);
      
      // Si hay error pero tenemos cache, devolverlo como fallback
      if (this.cache.data && this.cache.data.length > 0) {
        console.log('🛡️ Usando cache como fallback debido a error de API');
        return this.cache.data.slice(0, limit);
      }
      
      throw error;
    }
  }

  // Obtener noticias específicas con query personalizada
  async getSpecificSoccerNews(
    query: string = 'Messi OR Ronaldo',
    sortBy: string = 'publishedAt',
    limit: number = 10
  ): Promise<NewsArticle[]> {
    try {
      console.log(`🔍 Buscando noticias específicas: "${query}"`);
      
      const response = await axios.get(`${NEWSDATA_BASE_URL}/news`, {
        params: {
          apikey: this.apiKey,
          q: `(${query}) AND (soccer OR football)`,
          category: 'sports',
          language: 'en',
          size: Math.min(limit, 10)
        }
      });

      const data = response.data as NewsDataResponse;
      
      if (!data.results || data.results.length === 0) {
        console.warn(`⚠️ No se encontraron noticias para: ${query}`);
        return [];
      }

      console.log(`✅ Encontradas ${data.results.length} noticias específicas`);
      return data.results.map((article: NewsDataArticle) => this.convertToNewsArticle(article));
    } catch (error) {
      console.error('❌ Error obteniendo noticias específicas:', error);
      throw error;
    }
  }

  // Obtener noticias combinadas de diferentes categorías
  async getCombinedSoccerNews(): Promise<{
    general: NewsArticle[];
    premierLeague: NewsArticle[];
    laLiga: NewsArticle[];
    championsLeague: NewsArticle[];
  }> {
    try {
      console.log('🔄 Obteniendo noticias combinadas de soccer...');

      // Debido a las limitaciones del plan gratuito, hacer una sola llamada y filtrar
      const response = await axios.get(`${NEWSDATA_BASE_URL}/news`, {
        params: {
          apikey: this.apiKey,
          q: 'soccer OR football OR "Premier League" OR "La Liga" OR "Champions League"',
          category: 'sports',
          language: 'en',
          size: 10 // Máximo para plan gratuito
        }
      });

      const data = response.data as NewsDataResponse;
      const allArticles = data.results?.map((article: NewsDataArticle) => this.convertToNewsArticle(article)) || [];

      // Separar por categorías
      const result = {
        general: allArticles.filter(article => {
          const text = `${article.title} ${article.description || ''}`.toLowerCase();
          return text.includes('soccer') || text.includes('football');
        }).slice(0, 3),
        
        premierLeague: allArticles.filter(article => {
          const text = `${article.title} ${article.description || ''}`.toLowerCase();
          return text.includes('premier league') || text.includes('manchester') || text.includes('liverpool');
        }).slice(0, 2),
        
        laLiga: allArticles.filter(article => {
          const text = `${article.title} ${article.description || ''}`.toLowerCase();
          return text.includes('la liga') || text.includes('barcelona') || text.includes('real madrid');
        }).slice(0, 2),
        
        championsLeague: allArticles.filter(article => {
          const text = `${article.title} ${article.description || ''}`.toLowerCase();
          return text.includes('champions league') || text.includes('uefa');
        }).slice(0, 3)
      };

      console.log('✅ Noticias combinadas obtenidas y categorizadas');
      return result;
    } catch (error) {
      console.error('❌ Error obteniendo noticias combinadas:', error);
      throw error;
    }
  }

  // 📰 OBTENER MÁS NOTICIAS PARA PÁGINA COMPLETA (hasta 20)
  async getMoreSoccerNews(forceRefresh: boolean = false): Promise<NewsArticle[]> {
    try {
      console.log('🔄 Obteniendo más noticias para página completa...');
      
      // Verificar cache (válido por 24 horas)
      if (!forceRefresh && this.isCacheValid() && this.cache.data && this.cache.data.length >= 10) {
        console.log('📦 Sirviendo más noticias desde cache');
        return this.cache.data; // Devolver todas las del cache
      }

      // Hacer múltiples llamadas para obtener más variedad de noticias
      const queries = [
        'soccer',
        'football',
        'Premier League',
        'Champions League',
        'La Liga',
        'Messi',
        'FIFA'
      ];

      const allNews: NewsArticle[] = [];
      const usedTitles = new Set<string>();

      // Hacer llamadas secuenciales para evitar rate limiting
      for (const query of queries.slice(0, 3)) { // Solo 3 queries para no exceder límites
        try {
          const response = await axios.get(`${NEWSDATA_BASE_URL}/latest`, {
            params: {
              apikey: this.apiKey,
              q: query,
              size: 5 // 5 por query = máximo 15 noticias
            }
          });

          const data = response.data as NewsDataResponse;
          
          if (data.results && data.results.length > 0) {
            const noticiasConvertidas = data.results
              .map((article: NewsDataArticle) => this.convertToNewsArticle(article))
              .filter(article => {
                // Evitar duplicados por título
                if (usedTitles.has(article.title)) {
                  return false;
                }
                usedTitles.add(article.title);
                
                // Filtrar solo contenido relevante
                const textoCompleto = `${article.title} ${article.description || ''}`.toLowerCase();
                return textoCompleto.includes('soccer') || 
                       textoCompleto.includes('football') || 
                       textoCompleto.includes('premier league') ||
                       textoCompleto.includes('la liga') ||
                       textoCompleto.includes('champions league') ||
                       textoCompleto.includes('messi') ||
                       textoCompleto.includes('ronaldo') ||
                       textoCompleto.includes('barcelona') ||
                       textoCompleto.includes('real madrid') ||
                       textoCompleto.includes('manchester') ||
                       textoCompleto.includes('liverpool') ||
                       textoCompleto.includes('fifa') ||
                       textoCompleto.includes('uefa');
              });

            allNews.push(...noticiasConvertidas);
          }

          // Pequeña pausa entre requests
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.warn(`⚠️ Error con query "${query}":`, error);
          continue;
        }

        // Si ya tenemos suficientes noticias, parar
        if (allNews.length >= 15) {
          break;
        }
      }

      // Si no obtuvimos suficientes noticias nuevas, completar con cache
      if (allNews.length < 6 && this.cache.data) {
        console.log('📦 Completando con noticias del cache');
        const noticiasDelCache = this.cache.data.filter(cached => 
          !allNews.some(news => news.title === cached.title)
        );
        allNews.push(...noticiasDelCache.slice(0, 10 - allNews.length));
      }

      // Ordenar por fecha (más recientes primero)
      allNews.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

      // Actualizar cache con todas las noticias obtenidas
      if (allNews.length > 0) {
        this.updateCache(allNews);
      }

      console.log(`✅ Obtenidas ${allNews.length} noticias para página completa`);
      return allNews.slice(0, 20); // Máximo 20 para la página completa
    } catch (error) {
      console.error('❌ Error obteniendo más noticias:', error);
      
      // Fallback al cache si existe
      if (this.cache.data && this.cache.data.length > 0) {
        console.log('🛡️ Usando cache como fallback');
        return this.cache.data;
      }
      
      throw error;
    }
  }

  // Verificar estado de la API
  async checkAPIStatus(): Promise<boolean> {
    try {
      const response = await axios.get(`${NEWSDATA_BASE_URL}/news`, {
        params: {
          apikey: this.apiKey,
          q: 'test',
          size: 1
        }
      });

      return response.status === 200;
    } catch (error) {
      console.error('❌ Error verificando estado de NewsData.io:', error);
      return false;
    }
  }
}

export const newsAPIService = new NewsAPIService();
