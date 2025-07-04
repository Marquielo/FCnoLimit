import React, { useState, useRef, useEffect, useCallback } from 'react';
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

interface Position {
  x: number;
  y: number;
}

interface FloatingChatbotProps {
  showWelcome?: boolean;
}

const FloatingChatbot: React.FC<FloatingChatbotProps> = ({ showWelcome = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFloatingSuggestion, setShowFloatingSuggestion] = useState(true);
  const [currentSuggestion, setCurrentSuggestion] = useState('');
  
  // Estados para posicionamiento
  const [position, setPosition] = useState<Position>({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [chatbotSide, setChatbotSide] = useState<'left' | 'right'>('right');
  const [hasStartedDrag, setHasStartedDrag] = useState(false); // Para evitar clicks accidentales
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

  // Funciones para drag & drop optimizadas con useCallback
  const handleMouseDown = (e: React.MouseEvent) => {
    if (window.innerWidth > 768) return; // Solo en móviles
    setIsDragging(true);
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.innerWidth > 768) return; // Solo en móviles
    
    setHasStartedDrag(false); // Reset del flag
    setIsDragging(true);
    
    const touch = e.touches[0];
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || window.innerWidth > 768) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // Mantener dentro de los límites de la pantalla considerando el tab-bar
    const maxX = window.innerWidth - 60;
    const tabBarHeight = 80;
    const maxY = window.innerHeight - tabBarHeight - 60 - 10; // 10px de margen sobre tab-bar
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(10, Math.min(newY, maxY)) // Mínimo 10px desde arriba
    });
  }, [isDragging, dragOffset, position]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || window.innerWidth > 768) return;
    
    setHasStartedDrag(true); // Marcar que se ha iniciado el arrastre
    
    // Solo prevenir el scroll del documento para evitar interferencia
    if (e.cancelable) {
      e.preventDefault();
    }
    
    const touch = e.touches[0];
    const newX = touch.clientX - dragOffset.x;
    const newY = touch.clientY - dragOffset.y;
    
    // Mantener dentro de los límites de la pantalla considerando el tab-bar
    const maxX = window.innerWidth - 60;
    const tabBarHeight = 80;
    const maxY = window.innerHeight - tabBarHeight - 60 - 10; // 10px de margen sobre tab-bar
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(10, Math.min(newY, maxY)) // Mínimo 10px desde arriba
    });
  }, [isDragging, dragOffset, position]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging || window.innerWidth > 768) return;
    setIsDragging(false);
    
    // Resetear el flag después de un breve delay para evitar click inmediato
    setTimeout(() => {
      setHasStartedDrag(false);
    }, 100);
    
    // Pegar al borde más cercano
    const centerX = position.x + 30; // 30 es la mitad del ancho del botón
    const screenWidth = window.innerWidth;
    const tabBarHeight = 80; // Altura del tab-bar
    const bubbleSize = 60;
    const minMargin = 10;
    
    // Determinar lado (izquierda o derecha)
    let newX: number;
    if (centerX < screenWidth / 2) {
      // Pegar a la izquierda
      newX = 20;
      setChatbotSide('left');
    } else {
      // Pegar a la derecha
      newX = screenWidth - 80;
      setChatbotSide('right');
    }
    
    // Mantener la posición Y actual pero asegurar que no esté debajo del tab-bar
    const maxY = window.innerHeight - tabBarHeight - bubbleSize - minMargin;
    const newY = Math.min(position.y, maxY);
    
    setPosition({ x: newX, y: Math.max(minMargin, newY) });
  }, [isDragging, position]);

  // Event listeners para drag & drop
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleDragEnd);
      // Usar passive: false solo cuando necesitamos preventDefault para evitar scroll
      document.addEventListener('touchmove', handleTouchMove, { 
        passive: false 
      });
      document.addEventListener('touchend', handleDragEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, dragOffset, position]);

  // Inicializar posición sobre el tab-bar en móvil
  useEffect(() => {
    const initPosition = () => {
      if (window.innerWidth <= 768) {
        // Posicionar sobre el tab-bar móvil (generalmente 80px desde abajo)
        const tabBarHeight = 80; // Altura típica del tab-bar
        const bubbleSize = 60; // Tamaño de la burbuja
        const margin = 10; // Margen pequeño sobre el tab-bar
        
        setPosition({
          x: window.innerWidth - 80, // Esquina derecha
          y: window.innerHeight - tabBarHeight - bubbleSize - margin // Sobre el tab-bar
        });
      }
    };

    initPosition();
    window.addEventListener('resize', initPosition);
    return () => window.removeEventListener('resize', initPosition);
  }, []);

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
    
    // Si es primera carga después del login, mostrar por más tiempo
    const displayTime = showWelcome ? 10000 : 6000; // 10 segundos para bienvenida, 6 para normal
    
    // Ocultar la sugerencia después del tiempo especificado
    const timer = setTimeout(() => {
      setShowFloatingSuggestion(false);
    }, displayTime);

    return () => clearTimeout(timer);
  }, [showWelcome]);

  // Efecto adicional para mostrar mensaje de bienvenida especial
  useEffect(() => {
    if (showWelcome) {
      // Consejos especiales de bienvenida
      const welcomeSuggestions = [
        "🎉 ¡Bienvenido a FC No Limit! Aquí tienes tu primer consejo profesional",
        "⚽ ¡Genial que te hayas unido! Empecemos con un tip para mejorar tu juego",
        "🏆 ¡Excelente elección registrarte! Te comparto un secreto del fútbol profesional",
        "💪 ¡Qué bueno tenerte aquí! Comencemos con un consejo que usan los pros",
        "🌟 ¡Bienvenido al equipo! Aquí tienes tu primera lección de fútbol"
      ];
      
      const randomWelcome = welcomeSuggestions[Math.floor(Math.random() * welcomeSuggestions.length)];
      setCurrentSuggestion(randomWelcome);
      setShowFloatingSuggestion(true);
    }
  }, [showWelcome]);

  // Efecto para scroll automático
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div 
      className="floating-chatbot"
      style={{
        left: window.innerWidth <= 768 ? `${position.x}px` : undefined,
        bottom: window.innerWidth <= 768 ? `${window.innerHeight - position.y - 60}px` : undefined,
        right: window.innerWidth > 768 ? '20px' : undefined,
        transition: isDragging ? 'none' : 'all 0.3s ease'
      }}
    >
      {/* Sugerencia Flotante */}
      {showFloatingSuggestion && !isOpen && (
        <div 
          className="floating-suggestion"
          style={{
            [chatbotSide]: '0px',
            transform: chatbotSide === 'left' ? 'translateX(70px)' : 'translateX(-70px)'
          }}
        >
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
        className={`chatbot-toggle-btn ${isDragging ? 'dragging' : ''}`}
        fill="solid"
        shape="round"
        onClick={(e) => {
          // Solo abrir/cerrar si no se ha arrastrado
          if (isDragging || hasStartedDrag) {
            e.preventDefault();
            return;
          }
          setIsOpen(!isOpen);
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{
          cursor: window.innerWidth <= 768 ? (isDragging ? 'grabbing' : 'grab') : 'pointer',
          opacity: isDragging ? 0.8 : 1,
          transform: isDragging ? 'scale(1.1)' : 'scale(1)',
          touchAction: 'none',
          userSelect: 'none'
        }}
      >
        <IonIcon icon={isOpen ? closeOutline : chatboxOutline} />
      </IonButton>

      {/* Ventana del chatbot */}
      {isOpen && (
        <div 
          className="chatbot-window"
          style={{
            position: 'fixed',
            left: window.innerWidth <= 768 ? 
              (chatbotSide === 'left' ? '70px' : 'auto') : 
              (chatbotSide === 'left' ? `${position.x + 80}px` : 'auto'),
            right: window.innerWidth <= 768 ? 
              (chatbotSide === 'right' ? '70px' : 'auto') : 
              (chatbotSide === 'right' ? '70px' : 'auto'),
            bottom: window.innerWidth <= 768 ? 
              `${window.innerHeight - position.y}px` : 
              '80px',
            zIndex: 1001
          }}
        >
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
