import React, { useEffect, useState } from 'react';
import { 
  IonCard, 
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
  refreshOutline,
  arrowForward
} from 'ionicons/icons';
import { GeneradorNoticiasIA } from '../services/generadorNoticiasIA';
import { GeneradorImagenesIA } from '../services/generadorImagenesIA';
import './NoticiasGeneradasIA.css';

interface NoticiaGenerada {
  id: string;
  titulo: string;
  resumen: string;
  contenido: string;
  categoria: string;
  equipos: string[];
  fechaCreacion: string;
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
  const [cardExpandida, setCardExpandida] = useState<number | null>(null);
  
  // Instanciar servicio de imágenes
  const generadorImagenes = new GeneradorImagenesIA();

  // Función para expandir/contraer card
  const toggleCard = (index: number) => {
    setCardExpandida(cardExpandida === index ? null : index);
  };

  const generarNoticiasAutomaticas = async () => {
    if (partidosData.length === 0) return;
    
    setGenerando(true);
    const nuevasNoticias: NoticiaGenerada[] = [];

    try {
      // Generar 3 noticias de diferentes tipos
      const tiposNoticias = ['Pre-partido', 'Post-partido', 'Análisis'];
        for (let i = 0; i < Math.min(3, partidosData.length); i++) {
        const partido = partidosData[i];
        const tipo = tiposNoticias[i % tiposNoticias.length];
        
        // Generar noticia con IA según el tipo
        let noticia;
        const generadorNoticiasInstancia = new GeneradorNoticiasIA();
        
        switch (tipo) {
          case 'Pre-partido':
            noticia = await generadorNoticiasInstancia.generarNoticiaPrePartido(
              partido.teams.home.name,
              partido.teams.away.name,
              partido.league?.name || 'Liga',
              new Date().toISOString()
            );
            break;          case 'Post-partido':
            noticia = await generadorNoticiasInstancia.generarNoticiaPostPartido(
              partido.teams.home.name,
              partido.teams.away.name,
              partido.goals?.home || 0,
              partido.goals?.away || 0,
              partido.league?.name || 'Liga',
              partido.events || []
            );
            break;
          case 'Análisis':
            noticia = await generadorNoticiasInstancia.generarAnalisisLiga(
              partido.league?.name || 'Liga',
              [partido]
            );
            break;
          default:
            // Fallback con datos simulados
            noticia = {
              titulo: `${partido.teams.home.name} vs ${partido.teams.away.name}`,
              resumen: `Encuentro emocionante entre ${partido.teams.home.name} y ${partido.teams.away.name}`,
              contenido: `Un partido lleno de emociones entre estos dos grandes equipos. La afición espera un gran espectáculo.`,
              categoria: tipo,
              fechaCreacion: new Date().toISOString(),
              equipos: [partido.teams.home.name, partido.teams.away.name],
              imagenUrl: '',
              descripcionImagen: ''
            };
        }// Generar imagen con IA
        const imagenUrl = await generadorImagenes.generarImagenNoticia(
          partido.teams.home.name,
          partido.teams.away.name,
          tipo,
          partido.league?.name || 'Liga'
        );
          const noticiaCompleta: NoticiaGenerada = {
          id: `noticia-${Date.now()}-${i}`,
          titulo: noticia.titulo,
          resumen: noticia.resumen,
          contenido: noticia.contenido,
          categoria: tipo,
          equipos: [partido.teams.home.name, partido.teams.away.name],
          fechaCreacion: new Date().toISOString(),
          imagenUrl: imagenUrl,
          descripcionImagen: `${partido.teams.home.name} vs ${partido.teams.away.name} - ${tipo}`
        };
        
        nuevasNoticias.push(noticiaCompleta);
      }
      
      setNoticias(nuevasNoticias);
      console.log('✅ Noticias generadas exitosamente:', nuevasNoticias.length);
      
    } catch (error) {
      console.error('❌ Error generando noticias:', error);
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
          Asistente deportivo IA: Noticias Generadas
        </h2>
        
        <IonButton 
          fill="outline" 
          onClick={generarNoticiasAutomaticas}
          disabled={generando || partidosData.length === 0}
        >
          <IonIcon icon={refreshOutline} />
          {generando ? 'Generando...' : 'Generar Noticias'}
        </IonButton>
      </div>

      {generando && (
        <div className="generando-container">
          <IonSpinner name="crescent" />
          <div style={{ fontSize: '1.2rem', color: '#666', marginTop: '1rem' }}>
            🤖 Generando noticias con IA...
          </div>
        </div>
      )}

      {!generando && noticias.length === 0 && (
        <div className="sin-noticias">
          <IonIcon icon={newspaperOutline} />
          <p>No hay noticias generadas aún.</p>
          <p>Haz clic en "Generar Noticias" para crear contenido automáticamente.</p>
        </div>
      )}

      <div className="noticias-grid">
        {noticias.map((noticia, index) => {
          const isExpandida = cardExpandida === index;
          return (
            <IonCard 
              key={index} 
              className={`noticia-card ${isExpandida ? 'expandida' : 'compacta'}`}
            >
              {/* Imagen siempre visible */}
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
                      {noticia.categoria}
                    </IonBadge>
                  </div>
                </div>
              )}
              
              {/* Título siempre visible */}
              <IonCardTitle className="noticia-titulo">
                {noticia.titulo}
              </IonCardTitle>
              
              {/* Resumen siempre visible */}
              {noticia.resumen && (
                <p className="noticia-resumen">{noticia.resumen}</p>
              )}

              {/* Información de equipos si no está expandida */}
              {!isExpandida && noticia.equipos.length > 0 && (
                <div className="equipos-info">
                  <IonIcon icon={footballOutline} />
                  {noticia.equipos.slice(0, 2).join(' vs ')}
                  {noticia.equipos.length > 2 && ` +${noticia.equipos.length - 2} más`}
                </div>
              )}

              {/* Botón "Más información" si no está expandida */}
              {!isExpandida && (
                <IonButton 
                  className="boton-mas-info"
                  fill="solid"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCard(index);
                  }}
                >
                  Más información
                  <IonIcon icon={arrowForward} />
                </IonButton>
              )}

              {/* Contenido expandido */}
              {isExpandida && (
                <IonCardContent>
                  <div className="noticia-fecha">
                    <IonIcon icon={timeOutline} />
                    {new Date(noticia.fechaCreacion).toLocaleString()}
                  </div>

                  <div className="noticia-contenido">
                    {noticia.contenido.split('\n').map((parrafo: string, idx: number) => (
                      <p key={idx}>{parrafo}</p>
                    ))}
                  </div>

                  {noticia.equipos.length > 0 && (
                    <div className="equipos-tags">
                      {noticia.equipos.map((equipo: string, idx: number) => (
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

                  <IonButton 
                    className="boton-mas-info"
                    fill="outline"
                    onClick={() => toggleCard(index)}
                  >
                    Cerrar
                  </IonButton>
                </IonCardContent>
              )}
            </IonCard>
          );
        })}
      </div>
    </div>
  );
};

export default NoticiasGeneradasIA;
