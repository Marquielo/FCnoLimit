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

  constructor(apiKey: string = NEWS_API_KEY) {
    this.apiKey = apiKey;
  }
  // Obtener noticias específicas de CBS Sports y ESPN sobre soccer
  async getSoccerNews(
    pageSize: number = 20,
    page: number = 1
  ): Promise<NewsArticle[]> {
    try {
      // Fuentes específicas: CBS Sports y ESPN
      const response = await axios.get(`${NEWS_BASE_URL}/everything`, {
        params: {
          sources: 'cbs-sports,espn',
          q: 'soccer OR "Premier League" OR "La Liga" OR "Champions League" OR "World Cup" OR FIFA OR UEFA OR MLS OR "Major League Soccer"',
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: pageSize,
          page: page,
          apiKey: this.apiKey
        }
      });

      const data = response.data as NewsResponse;
      console.log('Noticias de soccer de CBS Sports y ESPN:', data.totalResults);
      
      // Filtrar aún más para asegurar contenido de soccer
      const noticiasFiltradasSoccer = data.articles.filter(article => {
        const texto = `${article.title} ${article.description} ${article.content}`.toLowerCase();
        const palabrasClave = ['soccer', 'fifa', 'uefa', 'premier league', 'la liga', 'champions league', 'world cup', 'messi', 'ronaldo', 'goal', 'mls', 'major league soccer', 'pitch', 'striker', 'midfielder'];
        return palabrasClave.some(palabra => texto.includes(palabra));
      });

      console.log('Noticias filtradas de soccer:', noticiasFiltradasSoccer.length);
      
      return noticiasFiltradasSoccer.map(article => ({
        ...article,
        category: 'soccer'
      }));
    } catch (error) {
      console.error('Error obteniendo noticias de soccer de CBS Sports y ESPN:', error);
      return [];
    }
  }
  // Buscar noticias específicas de soccer de CBS Sports y ESPN
  async getSpecificSoccerNews(
    query: string = 'Premier League OR "La Liga" OR "Champions League"',
    sortBy: 'publishedAt' | 'relevancy' | 'popularity' = 'publishedAt',
    pageSize: number = 15
  ): Promise<NewsArticle[]> {
    try {
      const response = await axios.get(`${NEWS_BASE_URL}/everything`, {
        params: {
          sources: 'cbs-sports,espn',
          q: `(${query}) AND soccer`,
          language: 'en',
          sortBy: sortBy,
          pageSize: pageSize,
          apiKey: this.apiKey
        }
      });

      const data = response.data as NewsResponse;
      console.log('Noticias específicas de soccer encontradas:', data.totalResults);
      
      return data.articles.map(article => ({
        ...article,
        category: 'soccer-specific'
      }));
    } catch (error) {
      console.error('Error obteniendo noticias específicas de soccer:', error);
      return [];
    }
  }

  // Noticias específicas de equipos
  async getTeamNews(
    teamName: string,
    language: string = 'en',
    from?: string // Formato: YYYY-MM-DD
  ): Promise<NewsArticle[]> {
    try {
      const params: any = {
        q: `"${teamName}" AND (football OR soccer)`,
        language: language,
        sortBy: 'publishedAt',
        pageSize: 20,
        apiKey: this.apiKey
      };

      if (from) {
        params.from = from;
      }

      const response = await axios.get(`${NEWS_BASE_URL}/everything`, {
        params
      });

      const data = response.data as NewsResponse;
      console.log(`Noticias de ${teamName}:`, data.totalResults);
      
      return data.articles.map(article => ({
        ...article,
        category: 'team'
      }));
    } catch (error) {
      console.error(`Error obteniendo noticias de ${teamName}:`, error);
      return [];
    }
  }

  // Noticias de ligas específicas
  async getLeagueNews(
    leagueName: string,
    language: string = 'en'
  ): Promise<NewsArticle[]> {
    try {
      const response = await axios.get(`${NEWS_BASE_URL}/everything`, {
        params: {
          q: `"${leagueName}" AND football`,
          language: language,
          sortBy: 'publishedAt',
          pageSize: 15,
          apiKey: this.apiKey
        }
      });

      const data = response.data as NewsResponse;
      console.log(`Noticias de ${leagueName}:`, data.totalResults);
      
      return data.articles.map(article => ({
        ...article,
        category: 'league'
      }));
    } catch (error) {
      console.error(`Error obteniendo noticias de ${leagueName}:`, error);
      return [];
    }
  }

  // Noticias de múltiples fuentes deportivas
  async getSportsNewsBySources(
    sources: string[] = ['espn', 'bbc-sport', 'fox-sports'],
    pageSize: number = 20
  ): Promise<NewsArticle[]> {
    try {
      const response = await axios.get(`${NEWS_BASE_URL}/everything`, {
        params: {
          sources: sources.join(','),
          pageSize: pageSize,
          sortBy: 'publishedAt',
          apiKey: this.apiKey
        }
      });

      const data = response.data as NewsResponse;
      console.log('Noticias de fuentes deportivas:', data.totalResults);
      
      return data.articles.map(article => ({
        ...article,
        category: 'sports-sources'
      }));
    } catch (error) {
      console.error('Error obteniendo noticias de fuentes deportivas:', error);
      return [];
    }
  }
  // Combinar noticias de soccer de CBS Sports y ESPN
  async getCombinedSoccerNews(): Promise<{
    general: NewsArticle[];
    premierLeague: NewsArticle[];
    laLiga: NewsArticle[];
    championsLeague: NewsArticle[];
  }> {
    try {
      const [general, premierLeague, laLiga, championsLeague] = await Promise.all([
        this.getSoccerNews(10),
        this.getSpecificSoccerNews('Premier League', 'publishedAt', 8),
        this.getSpecificSoccerNews('La Liga OR "Real Madrid" OR "Barcelona"', 'publishedAt', 8),
        this.getSpecificSoccerNews('Champions League OR UEFA', 'publishedAt', 8)
      ]);

      return {
        general,
        premierLeague,
        laLiga,
        championsLeague
      };
    } catch (error) {
      console.error('Error obteniendo noticias combinadas de soccer:', error);
      return {
        general: [],
        premierLeague: [],
        laLiga: [],
        championsLeague: []
      };
    }
  }

  // Filtrar noticias por palabras clave
  filterNewsByKeywords(articles: NewsArticle[], keywords: string[]): NewsArticle[] {
    return articles.filter(article => {
      const text = `${article.title} ${article.description} ${article.content}`.toLowerCase();
      return keywords.some(keyword => text.includes(keyword.toLowerCase()));
    });
  }
  // Obtener fuentes disponibles
  async getAvailableSources(category: string = 'sports'): Promise<any[]> {
    try {
      const response = await axios.get(`${NEWS_BASE_URL}/sources`, {
        params: {
          category: category,
          apiKey: this.apiKey
        }
      });

      const data = response.data as { sources: any[] };
      console.log('Fuentes deportivas disponibles:', data.sources.length);
      return data.sources;
    } catch (error) {
      console.error('Error obteniendo fuentes:', error);
      return [];
    }
  }
}

// Instancia por defecto del servicio
export const newsAPIService = new NewsAPIService();

// Funciones de conveniencia para usar en componentes
export const getLatestSoccerNews = () => newsAPIService.getSoccerNews();
export const getTeamSpecificNews = (team: string) => newsAPIService.getTeamNews(team);
export const getCombinedSoccerNews = () => newsAPIService.getCombinedSoccerNews();
