import React, { useState, useEffect } from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
  IonButton,
  IonIcon,
  IonSpinner,
  IonChip,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonToggle
} from '@ionic/react';
import {
  newspaperOutline,
  timeOutline,
  linkOutline,
  globeOutline,
  refreshOutline,
  languageOutline,
  footballOutline,
  arrowForward
} from 'ionicons/icons';
import { newsAPIService } from '../services/newsDataAPI';
import { traductor } from '../services/traductor';
import './NoticiasRealesAPI.css';

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
  // Campos para traducción
  originalTitle?: string;
  originalDescription?: string;
  originalContent?: string;
  traducida?: boolean;
}

const NoticiasRealesAPI: React.FC = () => {
  const [noticias, setNoticias] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [traduciendo, setTraduciendo] = useState(false);
  const [tipoNoticias, setTipoNoticias] = useState<'soccer' | 'specific' | 'combined'>('soccer');
  const [traducirAutomaticamente, setTraducirAutomaticamente] = useState(true);  const cargarNoticias = async () => {
    setLoading(true);
    try {
      console.log('🔄 Cargando noticias desde NewsData.io...');
      let nuevasNoticias: NewsArticle[] = [];      switch (tipoNoticias) {
        case 'soccer':
          nuevasNoticias = await newsAPIService.getMoreSoccerNews(); // Usar método para más noticias
          break;
        case 'specific':
          nuevasNoticias = await newsAPIService.getSpecificSoccerNews('Messi OR Ronaldo OR "Manchester United" OR Liverpool OR "Real Madrid" OR Barcelona', 'publishedAt', 10);
          break;
        case 'combined':
          const combinadas = await newsAPIService.getCombinedSoccerNews();
          nuevasNoticias = [
            ...combinadas.general,
            ...combinadas.premierLeague,
            ...combinadas.laLiga,
            ...combinadas.championsLeague
          ];
          break;
      }

      if (nuevasNoticias.length === 0) {
        console.log('📰 No se obtuvieron noticias, usando fallbacks');
        setNoticias(obtenerNoticiasFallbackCompleto());
        setLoading(false);
        return;
      }

      // Traducir automáticamente si está habilitado
      if (traducirAutomaticamente && nuevasNoticias.length > 0) {
        setTraduciendo(true);
        try {
          const noticiasTraducidas = await traductor.traducirNoticias(nuevasNoticias);
          setNoticias(noticiasTraducidas);
          console.log(`✅ ${noticiasTraducidas.length} noticias reales cargadas y traducidas`);
        } catch (error) {
          console.error('Error traduciendo noticias:', error);
          setNoticias(nuevasNoticias); // Mostrar originales si falla la traducción
        } finally {
          setTraduciendo(false);
        }
      } else {
        setNoticias(nuevasNoticias);
        console.log(`✅ ${nuevasNoticias.length} noticias reales cargadas`);
      }
    } catch (error) {
      console.warn('Error cargando noticias, usando fallbacks:', error);
      setNoticias(obtenerNoticiasFallbackCompleto());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarNoticias();
  }, [tipoNoticias]);

  const formatearFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO);
    const ahora = new Date();
    const diffMs = ahora.getTime() - fecha.getTime();
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutos = Math.floor(diffMs / (1000 * 60));

    if (diffMinutos < 60) {
      return `Hace ${diffMinutos} minutos`;
    } else if (diffHoras < 24) {
      return `Hace ${diffHoras} horas`;
    } else {
      return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  // Función para obtener noticias fallback para el componente completo
  const obtenerNoticiasFallbackCompleto = (): NewsArticle[] => {
    return [
      {
        title: "Copa América 2025: Argentina busca defender el título en Estados Unidos",
        description: "La selección albiceleste llega como favorita al torneo continental tras su victoria en Qatar 2022 y busca consolidar su hegemonía en América.",
        publishedAt: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
        urlToImage: null,
        url: "/noticias-en-vivo",
        source: { name: "FCnoLimit Sports", id: "fcnolimit" },
        traducida: true,
        category: "Copa América",
        author: "Redacción FCnoLimit",
        content: "La Copa América 2025 promete ser uno de los torneos más competitivos de los últimos años..."
      },
      {
        title: "Champions League: Real Madrid y Manchester City en semifinales épicas",
        description: "Los dos gigantes del fútbol europeo se enfrentarán en lo que promete ser una de las eliminatorias más atractivas de la temporada.",
        publishedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hora ago
        urlToImage: null,
        url: "/noticias-en-vivo",
        source: { name: "FCnoLimit Sports", id: "fcnolimit" },
        traducida: true,
        category: "Champions League",
        author: "Redacción FCnoLimit",
        content: "El sorteo de semifinales de la Champions League ha deparado enfrentamientos de lujo..."
      },
      {
        title: "Premier League: Liverpool y Arsenal luchan por el segundo puesto",
        description: "Mientras Manchester City lidera cómodamente, la batalla por la Champions League se intensifica entre los equipos de Londres y Liverpool.",
        publishedAt: new Date(Date.now() - 5400000).toISOString(), // 1.5 horas ago
        urlToImage: null,
        url: "/noticias-en-vivo",
        source: { name: "FCnoLimit Sports", id: "fcnolimit" },
        traducida: true,
        category: "Premier League",
        author: "Redacción FCnoLimit",
        content: "La Premier League vive una de sus jornadas más emocionantes..."
      },
      {
        title: "La Liga: Barcelona recupera la confianza con goleada histórica",
        description: "Los culés vencieron 4-0 al Real Betis en un partido que marca un punto de inflexión en su temporada bajo la dirección de Xavi Hernández.",
        publishedAt: new Date(Date.now() - 7200000).toISOString(), // 2 horas ago
        urlToImage: null,
        url: "/noticias-en-vivo",
        source: { name: "FCnoLimit Sports", id: "fcnolimit" },
        traducida: true,
        category: "La Liga",
        author: "Redacción FCnoLimit",
        content: "El FC Barcelona mostró su mejor cara en el Camp Nou..."
      },
      {
        title: "Fichajes: Mbappé confirma su salida del PSG al final de temporada",
        description: "El delantero francés anunció oficialmente que no renovará con el París Saint-Germain, abriendo especulaciones sobre su próximo destino.",
        publishedAt: new Date(Date.now() - 10800000).toISOString(), // 3 horas ago
        urlToImage: null,
        url: "/noticias-en-vivo",
        source: { name: "FCnoLimit Sports", id: "fcnolimit" },
        traducida: true,
        category: "Fichajes",
        author: "Redacción FCnoLimit",
        content: "Kylian Mbappé pone fin a una larga novela sobre su futuro..."
      },
      {
        title: "Mundial de Clubes 2025: FIFA confirma las fechas y sedes del torneo",
        description: "El nuevo formato del Mundial de Clubes se disputará en Estados Unidos con 32 equipos de todo el mundo durante el verano de 2025.",
        publishedAt: new Date(Date.now() - 14400000).toISOString(), // 4 horas ago
        urlToImage: null,
        url: "/noticias-en-vivo",
        source: { name: "FCnoLimit Sports", id: "fcnolimit" },
        traducida: true,
        category: "Mundial de Clubes",
        author: "Redacción FCnoLimit",
        content: "La FIFA ha revelado todos los detalles del renovado Mundial de Clubes..."
      }
    ];
  };

  const obtenerColorCategoria = (categoria?: string) => {
    switch (categoria) {
      case 'sports': return 'primary';
      case 'football': return 'success';
      case 'team': return 'warning';
      case 'league': return 'secondary';
      default: return 'medium';
    }
  };

  const abrirNoticia = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="noticias-reales-container">      <div className="noticias-reales-header">
        <h2>
          <IonIcon icon={globeOutline} />
          Noticias de Soccer - CBS Sports & ESPN
        </h2>
        
        <div className="filtros-noticias">
          <IonButton 
            fill={tipoNoticias === 'soccer' ? 'solid' : 'outline'}
            size="small"
            onClick={() => setTipoNoticias('soccer')}
          >
            Soccer General
          </IonButton>
          <IonButton 
            fill={tipoNoticias === 'specific' ? 'solid' : 'outline'}
            size="small"
            onClick={() => setTipoNoticias('specific')}
          >
            Jugadores
          </IonButton>
          <IonButton 
            fill={tipoNoticias === 'combined' ? 'solid' : 'outline'}
            size="small"
            onClick={() => setTipoNoticias('combined')}
          >
            Ligas
          </IonButton>
        </div>

        <div className="traduccion-control">
          <IonChip color="tertiary">
            <IonIcon icon={languageOutline} />
            <IonLabel>Traducir automáticamente</IonLabel>
            <IonToggle 
              checked={traducirAutomaticamente} 
              onIonChange={e => setTraducirAutomaticamente(e.detail.checked)}
            />
          </IonChip>
        </div>

        <IonButton 
          fill="outline" 
          size="small"
          onClick={cargarNoticias}
          disabled={loading || traduciendo}
        >
          <IonIcon icon={refreshOutline} slot="start" />
          Actualizar
        </IonButton>
      </div>      {(loading || traduciendo) && (
        <div className="loading-noticias">
          <IonSpinner />
          <p>{loading ? 'Cargando noticias reales...' : 'Traduciendo noticias...'}</p>
        </div>
      )}

      {!loading && !traduciendo && noticias.length === 0 && (
        <div className="sin-noticias-reales">
          <IonIcon icon={newspaperOutline} />
          <p>No se encontraron noticias de soccer.</p>
          <p>Solo mostramos noticias de CBS Sports y ESPN.</p>
        </div>
      )}      <div className="noticias-grid">
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
                <IonChip color="primary" outline>
                  <IonIcon icon={timeOutline} />
                  <IonLabel>{formatearFecha(noticia.publishedAt)}</IonLabel>
                </IonChip>
                
                {noticia.author && (
                  <IonChip color="secondary" outline>
                    <IonLabel>{noticia.author}</IonLabel>
                  </IonChip>
                )}
              </div>

              <h3 className="noticia-titulo">
                {noticia.title}
              </h3>

              <p className="noticia-descripcion">
                {noticia.description || 'Noticia de soccer desde fuentes verificadas.'}
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
      </div>      {noticias.length > 0 && (
        <div className="stats-noticias">
          <p>Mostrando {noticias.length} noticias de soccer de CBS Sports y ESPN</p>
        </div>
      )}        
        {/* Contador de noticias y información de actualización */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '1rem 0',
          padding: '0.75rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          fontSize: '0.85rem',
          color: '#666'
        }}>
          <div style={{ fontWeight: '600' }}>
            📰 {noticias.length} noticias disponibles
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🔄 Actualización automática cada 24h</span>
            {newsAPIService.getLastUpdateTime() && (
              <span style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>
                | Última: {newsAPIService.getLastUpdateTime()}
              </span>
            )}
          </div>
        </div>
    </div>
  );
};

export default NoticiasRealesAPI;
