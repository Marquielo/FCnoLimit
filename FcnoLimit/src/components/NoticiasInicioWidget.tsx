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
import { newsAPIService } from '../services/newsAPI';
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

  useEffect(() => {
    cargarNoticiasInicio();
  }, []);

  const cargarNoticiasInicio = async () => {
    setLoading(true);
    try {
      // Obtener exactamente 3 noticias de soccer
      const noticiasRaw = await newsAPIService.getSoccerNews(10);
      
      if (noticiasRaw.length > 0) {
        // Filtrar y tomar exactamente 3
        const noticiasValidas = noticiasRaw
          .filter(noticia => noticia.title && noticia.description)
          .slice(0, 3);
        
        if (noticiasValidas.length > 0) {
          // Traducir automáticamente
          const noticiasTraducidas = await traductor.traducirNoticias(noticiasValidas);
          
          // Completar con fallbacks si faltan noticias
          const noticiasFinales = [...noticiasTraducidas];
          while (noticiasFinales.length < 3) {
            noticiasFinales.push(obtenerNoticiaFallback(noticiasFinales.length));
          }
          
          setNoticias(noticiasFinales.slice(0, 3));
        } else {
          setNoticias(obtenerNoticiasFallback());
        }
      } else {
        setNoticias(obtenerNoticiasFallback());
      }
    } catch (error) {
      console.error('Error cargando noticias para inicio:', error);
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
        title: "Champions League: Los mejores momentos de la jornada",
        description: "Revive los goles más espectaculares y las jugadas que marcaron la diferencia en la última jornada de la Champions League.",
        publishedAt: new Date().toISOString(),
        urlToImage: null,
        url: "/noticias-en-vivo",
        source: { name: "FCnoLimit Sports", id: "fcnolimit" },
        traducida: false,
        category: "Champions League",
        author: null,
        content: null
      },
      {
        title: "Premier League: Análisis de la tabla de posiciones",
        description: "Los equipos ingleses luchan por los primeros puestos mientras se define el campeonato en las últimas jornadas.",
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        urlToImage: null,
        url: "/noticias-en-vivo",
        source: { name: "FCnoLimit Sports", id: "fcnolimit" },
        traducida: false,
        category: "Premier League",
        author: null,
        content: null
      },
      {
        title: "La Liga: Real Madrid y Barcelona en la lucha por el título",
        description: "El clásico español se intensifica con ambos equipos buscando la victoria en esta temporada decisiva.",
        publishedAt: new Date(Date.now() - 172800000).toISOString(),
        urlToImage: null,
        url: "/noticias-en-vivo",
        source: { name: "FCnoLimit Sports", id: "fcnolimit" },
        traducida: false,
        category: "La Liga",
        author: null,
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
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoticiasInicioWidget;
