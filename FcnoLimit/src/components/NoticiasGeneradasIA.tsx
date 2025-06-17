import React, { useEffect, useState } from 'react';
import { 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent, 
  IonBadge, 
  IonButton, 
  IonIcon,
  IonSpinner,
  IonChip
} from '@ionic/react';
import { 
  newspaperOutline, 
  timeOutline, 
  footballOutline,
  sparklesOutline,
  refreshOutline
} from 'ionicons/icons';
import { generadorNoticias } from '../services/generadorNoticiasIA';
import './NoticiasGeneradasIA.css';

interface NoticiaGenerada {
  titulo: string;
  contenido: string;
  resumen: string;
  categoria: string;
  fechaCreacion: string;
  equipos: string[];
  imagenUrl: string;
  descripcionImagen: string;
}

interface Props {
  partidosData: any[];
}

const NoticiasGeneradasIA: React.FC<Props> = ({ partidosData }) => {
  const [noticias, setNoticias] = useState<NoticiaGenerada[]>([]);
  const [loading, setLoading] = useState(false);
  const [generando, setGenerando] = useState(false);

  const generarNoticiasAutomaticas = async () => {
    if (partidosData.length === 0) return;
    
    setGenerando(true);
    const nuevasNoticias: NoticiaGenerada[] = [];

    try {
      // Generar 3 noticias de diferentes tipos
      const partidosParaNoticias = partidosData.slice(0, 3);

      for (const partido of partidosParaNoticias) {
        // Determinar el tipo de noticia según el estado del partido
        if (partido.status.short === 'FT') {
          // Post-partido si ya terminó
          const noticia = await generadorNoticias.generarNoticiaPostPartido(
            partido.teams.home.name,
            partido.teams.away.name,
            partido.goals?.home || 0,
            partido.goals?.away || 0,
            partido.league,
            partido.events || []
          );
          nuevasNoticias.push(noticia);
        } else {
          // Pre-partido si no ha comenzado o está en curso
          const noticia = await generadorNoticias.generarNoticiaPrePartido(
            partido.teams.home.name,
            partido.teams.away.name,
            partido.league,
            new Date(partido.date).toLocaleDateString()
          );
          nuevasNoticias.push(noticia);
        }

        // Esperar un poco entre solicitudes para no saturar la API
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Generar una noticia de análisis general
      if (partidosData.length > 0) {
        const liga = partidosData[0].league;
        const analisis = await generadorNoticias.generarAnalisisLiga(liga, partidosData.slice(0, 5));
        nuevasNoticias.push(analisis);
      }

      setNoticias(nuevasNoticias);
    } catch (error) {
      console.error('Error generando noticias:', error);
    } finally {
      setGenerando(false);
    }
  };

  const obtenerColorCategoria = (categoria: string) => {
    switch (categoria) {
      case 'Pre-partido': return 'primary';
      case 'Post-partido': return 'success';
      case 'Análisis': return 'secondary';
      default: return 'medium';
    }
  };

  return (
    <div className="noticias-ia-container">
      <div className="noticias-ia-header">
        <h2>
          <IonIcon icon={sparklesOutline} />
          Noticias Generadas por IA
        </h2>
        <IonButton 
          fill="outline" 
          size="small"
          onClick={generarNoticiasAutomaticas}
          disabled={generando || partidosData.length === 0}
        >
          <IonIcon icon={refreshOutline} slot="start" />
          {generando ? 'Generando...' : 'Generar Noticias'}
        </IonButton>
      </div>

      {generando && (
        <div className="generando-container">
          <IonSpinner />
          <p>Generando noticias con IA...</p>
        </div>
      )}

      {noticias.length === 0 && !generando && (
        <div className="sin-noticias">
          <IonIcon icon={newspaperOutline} />
          <p>No hay noticias generadas aún.</p>
          <p>Haz clic en "Generar Noticias" para crear contenido automáticamente.</p>
        </div>
      )}

      <div className="noticias-grid">        {noticias.map((noticia, index) => (
          <IonCard key={index} className="noticia-card">
            {noticia.imagenUrl && (
              <div className="noticia-imagen-container">
                <img 
                  src={noticia.imagenUrl} 
                  alt={noticia.descripcionImagen}
                  className="noticia-imagen"
                  loading="lazy"
                />
                <div className="imagen-overlay">
                  <IonBadge color={obtenerColorCategoria(noticia.categoria)}>
                    <IonIcon icon={footballOutline} />
                    {noticia.categoria}
                  </IonBadge>
                </div>
              </div>
            )}
            
            <IonCardHeader>
              <div className="noticia-header">
                {!noticia.imagenUrl && (
                  <IonBadge color={obtenerColorCategoria(noticia.categoria)}>
                    <IonIcon icon={footballOutline} />
                    {noticia.categoria}
                  </IonBadge>
                )}
                <div className="noticia-fecha">
                  <IonIcon icon={timeOutline} />
                  {new Date(noticia.fechaCreacion).toLocaleString()}
                </div>
              </div>
              
              <IonCardTitle className="noticia-titulo">
                {noticia.titulo}
              </IonCardTitle>
              
              {noticia.resumen && (
                <p className="noticia-resumen">{noticia.resumen}</p>
              )}
            </IonCardHeader>

            <IonCardContent>
              <div className="noticia-contenido">
                {noticia.contenido.split('\n').map((parrafo, idx) => (
                  <p key={idx}>{parrafo}</p>
                ))}
              </div>

              {noticia.equipos.length > 0 && (
                <div className="equipos-tags">
                  {noticia.equipos.map((equipo, idx) => (
                    <IonChip key={idx} color="primary" outline>
                      {equipo}
                    </IonChip>
                  ))}
                </div>
              )}

              <div className="noticia-footer">
                <span className="ia-badge">
                  <IonIcon icon={sparklesOutline} />
                  Generado por IA
                </span>
              </div>
            </IonCardContent>
          </IonCard>
        ))}
      </div>
    </div>
  );
};

export default NoticiasGeneradasIA;
