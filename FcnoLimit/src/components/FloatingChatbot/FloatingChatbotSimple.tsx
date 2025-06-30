import React, { useState, useRef, useEffect } from 'react';
import { 
  IonButton, 
  IonIcon, 
  IonContent, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonSpinner,
  IonCard,
  IonCardContent
} from '@ionic/react';
import { chatboxOutline, closeOutline, sendOutline, expandOutline, contractOutline } from 'ionicons/icons';
import { chatbotService } from '../../services/chatbotService';
import './FloatingChatbot.css';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFloatingSuggestion, setShowFloatingSuggestion] = useState(true);
  const [currentSuggestion, setCurrentSuggestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "¡Hola! Soy tu asistente de fútbol. Puedo ayudarte con consejos, estadísticas, reglas del juego y mucho más. ¿En qué puedo ayudarte?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const chatResponse = await chatbotService.generateResponse(inputMessage.trim());
      
      const botMessage: Message = {
        id: messages.length + 2,
        text: chatResponse.message,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error al obtener respuesta del chatbot:', error);
      
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.",
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getSuggestions = () => [
    "¿Cuáles son las reglas básicas del fútbol?",
    "Dame consejos para mejorar mi técnica",
    "¿Qué ejercicios puedo hacer para ser mejor portero?",
    "Explícame la regla del fuera de juego",
    "¿Cómo puedo mejorar mi condición física?",
    "Dame datos curiosos sobre el fútbol"
  ];

  const getFloatingSuggestions = () => [
    "💡 ¿Sabías que beber agua antes del partido mejora tu rendimiento?",
    "⚽ Tip: Practica toques con ambos pies 10 minutos diarios",
    "🏃‍♂️ La proteína después del entrenamiento ayuda a la recuperación muscular",
    "🥅 Dato curioso: Pelé marcó más de 1000 goles en su carrera",
    "🧠 Visualiza tus jugadas antes del partido para mejorar tu técnica",
    "🍌 Los plátanos son perfectos para energía rápida antes de jugar",
    "🔥 Messi ha ganado más Balones de Oro que cualquier otro jugador",
    "💪 Calentar 15 minutos previene el 80% de las lesiones deportivas",
    "⭐ Ronaldinho nunca perdió una sonrisa, ¡el fútbol es diversión!",
    "🏆 Brasil es el único país que ha ganado 5 Copas del Mundo",
    "🥗 Una dieta balanceada mejora tu resistencia en el campo",
    "🎯 La precisión es más importante que la potencia en los tiros"
  ];

  // Función para manejar clic en sugerencia flotante
  const handleFloatingSuggestionClick = () => {
    // Extraer el texto sin emoji
    const suggestionText = currentSuggestion.replace(/^[^\w\s]+\s*/, '').trim();
    setInputMessage(suggestionText);
    setShowFloatingSuggestion(false);
    setIsOpen(true);
  };

  // Efecto para mostrar sugerencia flotante al cargar
  useEffect(() => {
    const suggestions = getFloatingSuggestions();
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    setCurrentSuggestion(randomSuggestion);
    
    // Ocultar la sugerencia después de 6 segundos
    const timer = setTimeout(() => {
      setShowFloatingSuggestion(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  // Efecto para scroll automático
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="floating-chatbot">
      {/* Sugerencia Flotante */}
      {showFloatingSuggestion && !isOpen && (
        <div className="floating-suggestion">
          <div 
            className="floating-suggestion-content"
            onClick={handleFloatingSuggestionClick}
          >
            <p>{currentSuggestion}</p>
            <span className="floating-suggestion-hint">¡Haz clic para preguntar!</span>
            <button 
              className="floating-suggestion-close"
              onClick={(e) => {
                e.stopPropagation();
                setShowFloatingSuggestion(false);
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Botón flotante */}
      <IonButton
        className="chatbot-toggle-btn"
        fill="solid"
        shape="round"
        onClick={() => setIsOpen(!isOpen)}
      >
        <IonIcon icon={isOpen ? closeOutline : chatboxOutline} />
      </IonButton>

      {/* Ventana del chatbot */}
      {isOpen && (
        <div className="floating-chatbot">
          <div className={`chatbot-container ${isExpanded ? 'chatbot-expanded' : ''}`}>
            <div className="chatbot-header">
              <div className="chatbot-header-info">
                <div className="chatbot-header-text">
                  <h4>Asistente de Fútbol</h4>
                  <p>Tu experto en fútbol</p>
                </div>
              </div>
              <div className="chatbot-header-actions">
                <IonButton 
                  fill="clear" 
                  size="small"
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? "Contraer chatbot" : "Expandir chatbot"}
                >
                  <IonIcon icon={isExpanded ? contractOutline : expandOutline} />
                </IonButton>
                <IonButton 
                  fill="clear" 
                  size="small"
                  onClick={() => setIsOpen(false)}
                  title="Cerrar chatbot"
                >
                  <IonIcon icon={closeOutline} />
                </IonButton>
              </div>
            </div>
            
            <div className="chatbot-messages">
              <div className="messages-container">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}
                  >
                    <div className="message-content">
                      <p>{message.text}</p>
                      <small className="message-time">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </small>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="message bot-message">
                    <div className="message-content loading">
                      <IonSpinner name="dots" />
                      <p>Escribiendo...</p>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              {messages.length === 1 && (
                <div className="chatbot-suggestions">
                  <p className="suggestions-title">Sugerencias:</p>
                  <div className="suggestions-list">
                    {getSuggestions().map((suggestion, index) => (
                      <button
                        key={index}
                        className="suggestion-btn"
                        onClick={() => setInputMessage(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="chatbot-input">
              <div className="input-container">
                <input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu pregunta..."
                  disabled={isLoading}
                />
                <IonButton
                  fill="clear"
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                >
                  <IonIcon icon={sendOutline} />
                </IonButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingChatbot;
