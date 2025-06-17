// Servicio para generar imágenes gratuitas con Pollinations.ai
export class GeneradorImagenesIA {
  private baseUrl = 'https://image.pollinations.ai/prompt/';
  // Generar imagen para noticia deportiva
  async generarImagenNoticia(
    equipoLocal: string, 
    equipoVisitante: string, 
    categoria: string,
    liga: string,
    contextoAdicional?: string
  ): Promise<string> {
    try {
      // Crear prompt específico y contextual para fútbol
      let prompt = '';
      
      switch (categoria) {
        case 'Pre-partido':
          prompt = `Football match preview scene: ${equipoLocal} vs ${equipoVisitante} at ${liga}, stadium exterior with team banners, fans gathering before kickoff, pre-game atmosphere, team colors visible, anticipation and excitement, modern football stadium, golden hour lighting, sports photography style, high quality, realistic`;
          break;
        case 'Post-partido':
          prompt = `Football post-match scene: ${equipoLocal} vs ${equipoVisitante} in ${liga}, players celebrating or showing emotion after final whistle, stadium crowd reaction, post-game atmosphere, team jerseys visible, victory celebration or disappointment, dramatic stadium lighting, professional sports photography, realistic, high quality`;
          break;
        case 'Análisis':
          prompt = `Football analysis visualization for ${liga}: tactical board with team formations, football strategy diagram, professional sports analytics, modern design with ${liga} branding, statistical graphics, football field aerial view, clean professional layout, sports journalism style, high quality`;
          break;
        default:
          prompt = `Football match scene: ${equipoLocal} vs ${equipoVisitante}, ${liga} championship, dynamic action on football field, players in action, stadium atmosphere, professional sports photography, realistic, high quality`;
      }

      // Agregar contexto adicional si está disponible
      if (contextoAdicional) {
        prompt += `, ${contextoAdicional}`;
      }

      // Limpiar y formatear el prompt
      const promptLimpio = this.limpiarPrompt(prompt);
      
      // Generar URL de imagen con parámetros optimizados
      const imageUrl = `${this.baseUrl}${encodeURIComponent(promptLimpio)}?width=800&height=600&model=flux&nologo=true&enhance=true`;
      
      return imageUrl;
    } catch (error) {
      console.error('Error generando imagen:', error);
      // Imagen de fallback
      return this.generarImagenFallback();
    }
  }
  // Generar imagen para análisis de liga
  async generarImagenAnalisisLiga(liga: string, contexto?: string): Promise<string> {
    const basePrompt = `${liga} football championship analysis: professional sports graphics, league standings table, statistical charts, modern sports design, football tactical diagrams, clean professional layout`;
    
    const prompt = contexto 
      ? `${basePrompt}, ${contexto}, sports journalism style, high quality`
      : `${basePrompt}, official league branding, sports analytics visualization, high quality`;
      
    const promptLimpio = this.limpiarPrompt(prompt);
    return `${this.baseUrl}${encodeURIComponent(promptLimpio)}?width=800&height=600&model=flux&nologo=true&enhance=true`;
  }

  // Generar imagen específica según eventos del partido
  async generarImagenPorEventos(
    equipoLocal: string, 
    equipoVisitante: string, 
    eventos: any[], 
    liga: string
  ): Promise<string> {
    let contextoEventos = '';
    
    // Analizar eventos para crear contexto más específico
    const tiposEventos = eventos.map(e => e.type).slice(0, 3);
    
    if (tiposEventos.includes('Goal')) {
      contextoEventos = 'goal celebration, players celebrating, crowd cheering, exciting moment';
    } else if (tiposEventos.includes('Card')) {
      contextoEventos = 'intense match moment, referee action, competitive football';
    } else if (tiposEventos.includes('Substitution')) {
      contextoEventos = 'tactical substitution, coach strategy, bench players';
    } else {
      contextoEventos = 'dynamic football action, players in motion, competitive match';
    }
    
    return this.generarImagenNoticia(equipoLocal, equipoVisitante, 'Post-partido', liga, contextoEventos);
  }

  // Generar imagen genérica de fútbol
  async generarImagenGenerica(): Promise<string> {
    const prompt = 'Football stadium, green grass, soccer ball, modern sports arena, dramatic lighting, professional photography';
    const promptLimpio = this.limpiarPrompt(prompt);
    return `${this.baseUrl}${encodeURIComponent(promptLimpio)}?width=800&height=600&model=flux&nologo=true`;
  }

  private limpiarPrompt(prompt: string): string {
    return prompt
      .replace(/[^\w\s,]/g, '') // Remover caracteres especiales excepto comas
      .replace(/\s+/g, ' ') // Normalizar espacios
      .trim()
      .substring(0, 200); // Limitar longitud
  }

  private generarImagenFallback(): string {
    // Imagen de placeholder si falla la generación
    return 'https://via.placeholder.com/800x600/3498db/ffffff?text=Noticia+Deportiva';
  }
}

export const generadorImagenes = new GeneradorImagenesIA();
