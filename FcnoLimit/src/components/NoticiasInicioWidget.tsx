import React, { useState, useEffect } from 'react';
import { IonIcon, IonSpinner } from '@ionic/react';
import {
  newspaperOutline,
  calendarOutline,
  linkOutline,
  languageOutline,
  footballOutline,
  arrowForward
} from 'ionicons/icons';
import { newsAPIService } from '../services/newsDataAPI';
import { traductor } from '../services/traductor';
import './NoticiasRealesAPI.css'; // Reutilizamos los mismos estilos

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
  originalTitle?: string;
  originalDescription?: string;
  originalContent?: string;
  traducida?: boolean;
}

const NoticiasInicioWidget: React.FC = () => {
  const [noticias, setNoticias] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [ultimaActualizacion, setUltimaActualizacion] = useState<string | null>(null);

  useEffect(() => {
    cargarNoticiasInicio();
    
    // Verificar actualización cada hora para mostrar tiempo restante
    const intervalCheck = setInterval(() => {
      if (newsAPIService.needsUpdate()) {
        cargarNoticiasInicio();
      }
      setUltimaActualizacion(newsAPIService.getLastUpdateTime());
    }, 60 * 60 * 1000); // Cada hora
    
    return () => clearInterval(intervalCheck);
  }, []);  const cargarNoticiasInicio = async () => {
    setLoading(true);
    try {
      console.log('🔄 Cargando noticias desde NewsData.io...');
      
      // Intentar obtener noticias reales desde NewsData.io (funciona en producción)
      const noticiasRaw = await newsAPIService.getSoccerNews(6);
      
      if (noticiasRaw.length > 0) {
        // Filtrar y tomar exactamente 3
        const noticiasValidas = noticiasRaw
          .filter(noticia => noticia.title && noticia.description)
          .slice(0, 3);
        
        if (noticiasValidas.length >= 3) {
          // Traducir automáticamente
          const noticiasTraducidas = await traductor.traducirNoticias(noticiasValidas);          setNoticias(noticiasTraducidas.slice(0, 3));
          console.log('✅ Noticias reales cargadas y traducidas');
          setUltimaActualizacion(newsAPIService.getLastUpdateTime());
        } else {
          // Si no hay suficientes, completar con fallbacks
          const noticiasTraducidas = await traductor.traducirNoticias(noticiasValidas);
          const noticiasFinales = [...noticiasTraducidas];
          while (noticiasFinales.length < 3) {
            noticiasFinales.push(obtenerNoticiaFallback(noticiasFinales.length));
          }
          setNoticias(noticiasFinales.slice(0, 3));
          console.log('⚠️ Noticias reales + fallbacks cargadas');
        }
      } else {
        console.log('📰 No se obtuvieron noticias, usando fallbacks');
        setNoticias(obtenerNoticiasFallback());
      }
    } catch (error) {
      console.warn('Error cargando noticias, usando fallbacks:', error);
      setNoticias(obtenerNoticiasFallback());
    } finally {
      setLoading(false);
    }
  };

  const obtenerNoticiasFallback = () => {
    return [
      obtenerNoticiaFallback(0),
      obtenerNoticiaFallback(1),
      obtenerNoticiaFallback(2)
    ];
  };
  const obtenerNoticiaFallback = (index: number) => {
    const noticias = [
      {
        title: "Copa América 2025: Los equipos favoritos para llevarse el título",
        description: "Análisis completo de las selecciones con mayores posibilidades de conquistar la Copa América en territorio estadounidense.",
        publishedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hora ago
        urlToImage: null,
        url: "/noticias-en-vivo",
        source: { name: "FCnoLimit Sports", id: "fcnolimit" },
        traducida: true,
        category: "Copa América",
        author: "Redacción FCnoLimit",
        content: null
      },
      {
        title: "Champions League: Messi y Mbappé lideran la lucha por el Balón de Oro",
        description: "Los astros del PSG destacan en la Champions League mientras buscan el reconocimiento individual más prestigioso del fútbol.",
        publishedAt: new Date(Date.now() - 7200000).toISOString(), // 2 horas ago
        urlToImage: null,
        url: "/noticias-en-vivo",
        source: { name: "FCnoLimit Sports", id: "fcnolimit" },
        traducida: true,
        category: "Champions League",
        author: "Redacción FCnoLimit",
        content: null
      },
      {
        title: "Premier League: Manchester City rompe récord de puntos en la temporada",
        description: "Los Citizens continúan su dominio en Inglaterra con una exhibición de fútbol que los acerca a un nuevo título consecutivo.",
        publishedAt: new Date(Date.now() - 10800000).toISOString(), // 3 horas ago
        urlToImage: null,
        url: "/noticias-en-vivo",
        source: { name: "FCnoLimit Sports", id: "fcnolimit" },
        traducida: true,
        category: "Premier League",
        author: "Redacción FCnoLimit",
        content: null
      }
    ];
    return noticias[index] || noticias[0];
  };

  const formatearFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const obtenerCategoria = (noticia: NewsArticle) => {
    if (!noticia) return 'Soccer';
    
    const titulo = noticia.title?.toLowerCase() || '';
    const descripcion = noticia.description?.toLowerCase() || '';
    
    if (titulo.includes('champions league') || descripcion.includes('champions league')) {
      return 'Champions League';
    } else if (titulo.includes('premier league') || descripcion.includes('premier league')) {
      return 'Premier League';
    } else if (titulo.includes('la liga') || descripcion.includes('la liga')) {
      return 'La Liga';
    } else if (titulo.includes('messi') || titulo.includes('ronaldo')) {
      return 'Estrellas';
    } else {
      return 'Soccer';
    }
  };

  if (loading) {
    return (
      <div className="loading-noticias">
        <IonSpinner />
        <p>Cargando noticias de soccer...</p>
      </div>
    );
  }

  return (
    <div className="noticias-grid">
      {noticias.map((noticia, index) => (
        <div key={index} className="noticia-real-card">
          <div className="noticia-imagen-container">
            {noticia.urlToImage ? (
              <img 
                src={noticia.urlToImage} 
                alt={noticia.title} 
                className="noticia-imagen"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const placeholder = target.parentElement?.querySelector('.noticia-imagen-placeholder');
                  if (placeholder) {
                    (placeholder as HTMLElement).style.display = 'flex';
                  }
                }}
              />
            ) : null}
            
            <div 
              className="noticia-imagen-placeholder" 
              style={{ display: noticia.urlToImage ? 'none' : 'flex' }}
            >
              <IonIcon icon={footballOutline} />
            </div>

            <div className="noticia-fuente-badge">
              {noticia.source.name}
            </div>

            {noticia.traducida && (
              <div className="noticia-traducido-badge">
                <IonIcon icon={languageOutline} />
                Traducido
              </div>
            )}
          </div>

          <div className="noticia-contenido">
            <div className="noticia-meta">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#3498db', fontSize: '0.8rem', fontWeight: '500' }}>
                <IonIcon icon={calendarOutline} />
                {formatearFecha(noticia.publishedAt)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#3498db', fontSize: '0.8rem', fontWeight: '500' }}>
                <IonIcon icon={linkOutline} />
                {noticia.source.name}
              </div>
            </div>

            <h3 className="noticia-titulo">
              {noticia.title}
            </h3>

            <p className="noticia-descripcion">
              {noticia.description ? 
                noticia.description.substring(0, 120) + '...' : 
                'Noticia de soccer desde fuentes verificadas.'
              }
            </p>

            <div className="noticia-footer">
              <div className="noticia-tags">
                <span className="noticia-tag">Soccer</span>
                {noticia.traducida && (
                  <span className="noticia-tag traducido">Traducido</span>
                )}
              </div>
              
              <a 
                href={noticia.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="noticia-enlace"
              >
                Leer más <IonIcon icon={arrowForward} />
              </a>
            </div>
          </div>        </div>
      ))}
      
      {/* Información de actualización automática */}
      {ultimaActualizacion && (
        <div style={{
          textAlign: 'center',
          marginTop: '1rem',
          padding: '0.5rem',
          fontSize: '0.75rem',
          color: '#7f8c8d',
          fontStyle: 'italic'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <IonIcon icon={calendarOutline} style={{ fontSize: '0.8rem' }} />
            Última actualización: {ultimaActualizacion}
          </div>
          <div style={{ marginTop: '0.25rem', fontSize: '0.7rem' }}>
            ⏰ Se actualiza automáticamente cada 24 horas
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticiasInicioWidget;
