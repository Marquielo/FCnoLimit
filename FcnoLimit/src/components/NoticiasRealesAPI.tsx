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
import { newsAPIService } from '../services/newsAPI';
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
  const [traducirAutomaticamente, setTraducirAutomaticamente] = useState(true);

  const cargarNoticias = async () => {
    setLoading(true);
    try {
      let nuevasNoticias: NewsArticle[] = [];

      switch (tipoNoticias) {
        case 'soccer':
          nuevasNoticias = await newsAPIService.getSoccerNews(20);
          break;
        case 'specific':
          nuevasNoticias = await newsAPIService.getSpecificSoccerNews('Messi OR Ronaldo OR "Manchester United" OR Liverpool OR "Real Madrid" OR Barcelona', 'publishedAt', 20);
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

      // Traducir automáticamente si está habilitado
      if (traducirAutomaticamente && nuevasNoticias.length > 0) {
        setTraduciendo(true);
        try {
          const noticiasTraducidas = await traductor.traducirNoticias(nuevasNoticias);
          setNoticias(noticiasTraducidas);
        } catch (error) {
          console.error('Error traduciendo noticias:', error);
          setNoticias(nuevasNoticias); // Mostrar originales si falla la traducción
        } finally {
          setTraduciendo(false);
        }
      } else {
        setNoticias(nuevasNoticias);
      }
    } catch (error) {
      console.error('Error cargando noticias:', error);
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
      )}    </div>
  );
};

export default NoticiasRealesAPI;
