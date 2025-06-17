// Servicio de traducción gratuito usando Google Translate
export class TraductorService {
  private baseUrl = 'https://translate.googleapis.com/translate_a/single';

  // Traducir texto usando Google Translate (gratuito)
  async traducirTexto(texto: string, idiomaOrigen: string = 'en', idiomaDestino: string = 'es'): Promise<string> {
    try {
      if (!texto || texto.trim() === '') {
        return texto;
      }

      // Usar la API gratuita de Google Translate
      const url = `${this.baseUrl}?client=gtx&sl=${idiomaOrigen}&tl=${idiomaDestino}&dt=t&q=${encodeURIComponent(texto)}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      // La respuesta es un array anidado, extraemos el texto traducido
      if (data && data[0] && data[0][0] && data[0][0][0]) {
        return data[0][0][0];
      }
      
      return texto; // Si falla, devolver texto original
    } catch (error) {
      console.error('Error traduciendo texto:', error);
      return texto; // Si falla, devolver texto original
    }
  }

  // Traducir múltiples textos en paralelo
  async traducirMultiplesTextos(textos: string[], idiomaOrigen: string = 'en', idiomaDestino: string = 'es'): Promise<string[]> {
    try {
      const promesasTraduccion = textos.map(texto => 
        this.traducirTexto(texto, idiomaOrigen, idiomaDestino)
      );
      
      return await Promise.all(promesasTraduccion);
    } catch (error) {
      console.error('Error traduciendo múltiples textos:', error);
      return textos; // Si falla, devolver textos originales
    }
  }

  // Traducir noticia completa
  async traducirNoticia(noticia: any): Promise<any> {
    try {
      console.log('Traduciendo noticia:', noticia.title?.substring(0, 50) + '...');
      
      const [tituloTraducido, descripcionTraducida, contenidoTraducido] = await Promise.all([
        this.traducirTexto(noticia.title || ''),
        this.traducirTexto(noticia.description || ''),
        this.traducirTexto(noticia.content || '')
      ]);

      return {
        ...noticia,
        title: tituloTraducido,
        description: descripcionTraducida,
        content: contenidoTraducido,
        // Mantener originales para referencia
        originalTitle: noticia.title,
        originalDescription: noticia.description,
        originalContent: noticia.content,
        traducida: true
      };
    } catch (error) {
      console.error('Error traduciendo noticia completa:', error);
      return {
        ...noticia,
        traducida: false
      };
    }
  }

  // Traducir array de noticias
  async traducirNoticias(noticias: any[]): Promise<any[]> {
    if (!noticias || noticias.length === 0) {
      return noticias;
    }

    console.log(`Iniciando traducción de ${noticias.length} noticias...`);
    
    try {
      // Traducir de a 3 noticias por vez para no sobrecargar la API
      const noticiasTraducidas = [];
      const batchSize = 3;
      
      for (let i = 0; i < noticias.length; i += batchSize) {
        const batch = noticias.slice(i, i + batchSize);
        const batchTraducido = await Promise.all(
          batch.map(noticia => this.traducirNoticia(noticia))
        );
        noticiasTraducidas.push(...batchTraducido);
        
        // Pequeña pausa entre batches para evitar rate limiting
        if (i + batchSize < noticias.length) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      console.log(`Traducción completada: ${noticiasTraducidas.length} noticias`);
      return noticiasTraducidas;
    } catch (error) {
      console.error('Error traduciendo noticias:', error);
      return noticias; // Si falla, devolver noticias originales
    }
  }

  // Detectar idioma del texto
  async detectarIdioma(texto: string): Promise<string> {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=es&dt=t&q=${encodeURIComponent(texto.substring(0, 100))}`;
      const response = await fetch(url);
      const data = await response.json();
      
      // La respuesta incluye el idioma detectado
      if (data && data[2]) {
        return data[2];
      }
      
      return 'en'; // Default a inglés
    } catch (error) {
      console.error('Error detectando idioma:', error);
      return 'en';
    }
  }

  // Traducir solo si el texto está en inglés
  async traducirSiEsNecesario(texto: string): Promise<string> {
    try {
      const idioma = await this.detectarIdioma(texto);
      
      if (idioma === 'en') {
        return await this.traducirTexto(texto);
      }
      
      return texto; // Ya está en español u otro idioma
    } catch (error) {
      console.error('Error en traducción condicional:', error);
      return texto;
    }
  }
}

// Instancia singleton del traductor
export const traductor = new TraductorService();