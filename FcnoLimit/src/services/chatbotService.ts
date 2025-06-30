import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = 'AIzaSyAO61cOQjVO7ymIi0Quq3KMusMlA-NqGF4';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ChatbotResponse {
  message: string;
  suggestions?: string[];
}

class ChatbotService {
  private model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Prompt genérico para fútbol (sin roles)
  private getGenericFootballPrompt(): string {
    return `Eres un asistente de IA especializado en fútbol para la aplicación FCnoLimit. 
Responde siempre en español de manera amigable, concisa y útil. Mantén un tono conversacional y cercano.

TU ESPECIALIZACIÓN - FÚTBOL GENERAL:
- Comparte datos históricos fascinantes sobre futbolistas legendarios y equipos
- Proporciona tips de alimentación deportiva para futbolistas
- Ofrece consejos básicos sobre técnica, tácticas y entrenamiento
- Comparte curiosidades sobre récords, estadísticas y logros históricos
- Proporciona información sobre reglas, formaciones y estrategias básicas
- Aconseja sobre aspectos generales del deporte (mental, físico, técnico)

EJEMPLOS DE RESPUESTAS:
- "¿Sabías que Ronaldinho ganó más copas internacionales que muchos jugadores en la historia?"
- "Para mejorar tu resistencia, consume carbohidratos complejos 2 horas antes del ejercicio"
- "La formación 4-4-2 es ideal para equipos que buscan equilibrio entre ataque y defensa"
- "Pelé marcó más de 1000 goles oficiales y revolucionó el fútbol brasileño"

Limita tus respuestas a 2-3 párrafos máximo y siempre mantén el enfoque en el fútbol.`;
  }

  // Generar respuesta genérica de fútbol
  async generateResponse(message: string): Promise<ChatbotResponse> {
    try {
      const systemPrompt = this.getGenericFootballPrompt();
      const fullPrompt = `${systemPrompt}

USUARIO PREGUNTA: "${message}"

Responde de manera específica a la pregunta, mantente enfocado en fútbol, y sé conciso pero informativo.`;

      const result = await this.model.generateContent(fullPrompt);
      const response = result.response.text();

      // Generar sugerencias de seguimiento
      const suggestions = this.getGenericSuggestions();

      return {
        message: response,
        suggestions
      };

    } catch (error) {
      console.error('Error generando respuesta del chatbot:', error);
      return {
        message: 'Lo siento, no pude procesar tu mensaje en este momento. ¿Podrías intentar de nuevo?',
        suggestions: this.getGenericSuggestions()
      };
    }
  }

  // Generar sugerencias genéricas de fútbol
  private getGenericSuggestions(): string[] {
    return [
      "¿Qué comida me recomiendas antes de un partido?",
      "Cuéntame un dato curioso sobre Messi o Ronaldo",
      "¿Cómo mejorar mi técnica de tiro?",
      "¿Qué formación es mejor para principiantes?",
      "¿Tips para entrenar en casa?",
      "¿Cuál fue el mundial más emocionante?",
      "¿Cómo se juega el fuera de lugar?",
      "¿Qué ejercicios mejoran la velocidad?"
    ];
  }

  // Generar mensaje de bienvenida genérico
  generateWelcomeMessage(userName?: string): string {
    const greeting = userName ? `¡Hola ${userName}!` : '¡Hola!';
    
    return `${greeting} ⚽ Soy tu asistente de fútbol de FCnoLimit. Te ayudo con datos históricos fascinantes, tips de alimentación deportiva, consejos de técnica y táctica, curiosidades del mundo del fútbol y mucho más. ¿En qué puedo ayudarte hoy?`;
  }
}

export const chatbotService = new ChatbotService();
