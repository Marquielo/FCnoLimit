import React, { useEffect, useState, useRef } from 'react';
import { IonPage, IonContent, IonButton, IonIcon, IonBadge, IonCard } from '@ionic/react';
// Importar Swiper en lugar de IonSlides y IonSlide
import { Swiper, SwiperSlide } from 'swiper/react';
// Importar CSS de Swiper
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
// Import Swiper modules
import { Pagination, Autoplay } from 'swiper/modules';

// Importar componentes
import NoticiasGeneradasIA from '../../../components/NoticiasGeneradasIA';
import { getLiveEvents } from '../../../services/apiFootball';
import { noticiasIAService } from '../../../services/noticiasIAService';

import {
  footballOutline, peopleOutline, trophyOutline, statsChartOutline,
  arrowForward, calendarOutline, timeOutline, locationOutline,
  flameOutline, starOutline, personOutline, eyeOutline, // Reemplazar searchOutline con eyeOutline
  ribbonOutline, pulseOutline, checkmarkCircleOutline,
  footballSharp,
  bulbOutline, // Usar un ícono alternativo para whistle
  shirtOutline, stopwatchOutline,
  trophySharp, megaphoneOutline, flameSharp, podiumOutline,
  newspaperOutline
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './InicioPage.css';
import NavBar from '../../../components/NavBar';
import Footer from '../../../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { RenderMatchCard } from '../../../components/RenderMatchCard';
import TablaPosiciones from '../../../components/TablaPosiciones';
import NoticiasInicioWidget from '../../../components/NoticiasInicioWidget';

// Opciones de configuración para el slider (ajustado para Swiper)
const swiperParams = {
  slidesPerView: 1,
  spaceBetween: 30,
  loop: true,
  pagination: {
    clickable: true,
  },
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  modules: [Pagination, Autoplay]
};

const InicioPage: React.FC = () => {
  const history = useHistory();
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const [proximosPartidos, setProximosPartidos] = useState<any[]>([]);
  const [partidosData, setPartidosData] = useState<any[]>([]); // Para NoticiasGeneradasIA
  const [noticiasIA, setNoticiasIA] = useState<any[]>([]);
  const [loadingNoticias, setLoadingNoticias] = useState(false);

  // Efecto para animaciones al hacer scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.animate-on-scroll');
    hiddenElements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Efecto especial JS para match-card (igual que RenderMatchCard)
  useEffect(() => {
    const handleMove = (e: Event) => {
      const card = e.currentTarget as HTMLElement;
      if (!(e instanceof MouseEvent)) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--glow-x', `${x}px`);
      card.style.setProperty('--glow-y', `${y}px`);
    };
    const handleLeave = (e: Event) => {
      const card = e.currentTarget as HTMLElement;
      card.style.removeProperty('--glow-x');
      card.style.removeProperty('--glow-y');
    };
    const cards = document.querySelectorAll('.match-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', handleMove as EventListener);
      card.addEventListener('mouseleave', handleLeave as EventListener);
    });
    return () => {
      cards.forEach(card => {
        card.removeEventListener('mousemove', handleMove as EventListener);
        card.removeEventListener('mouseleave', handleLeave as EventListener);
      });
    };
  }, []);

  // Traer los próximos 3 partidos desde el backend
  useEffect(() => {
    fetch('https://fcnolimit-back.onrender.com/api/partidos/pendientes')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        // Ordenar por fecha ascendente y tomar los 3 más próximos
        const partidosOrdenados = Array.isArray(data)
          ? data.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
          : [];
        setProximosPartidos(partidosOrdenados.slice(0, 3));
      });
  }, []);

  // Ajustar la función handleAccordionClick
  const handleAccordionClick = (index: number) => {
    if (activeAccordion === index) {
      // Si ya está activo, cerrarlo
      setActiveAccordion(null);
    } else {
      // Si no está activo, abrirlo
      setActiveAccordion(index);

      // Opcional: hacer scroll suave hacia el acordeón que se abre
      setTimeout(() => {
        const element = document.querySelector(`.standings-accordion:nth-child(${index + 1})`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    }
  };

  // Cargar noticias IA automáticamente cada 24h
  useEffect(() => {
    const cargarNoticiasIA = async () => {
      setLoadingNoticias(true);
      try {
        const noticias = await noticiasIAService.getNoticiasIA();
        setNoticiasIA(noticias);
        console.log('✅ Noticias IA cargadas para Destacados del momento');
      } catch (error) {
        console.error('❌ Error cargando noticias IA:', error);
      } finally {
        setLoadingNoticias(false);
      }
    };

    cargarNoticiasIA();

    // Verificar cada hora si necesita actualización
    const interval = setInterval(() => {
      if (noticiasIAService.needsUpdate()) {
        cargarNoticiasIA();
      }
    }, 60 * 60 * 1000); // Cada hora

    return () => clearInterval(interval);
  }, []);
  // Cargar datos de partidos para NoticiasGeneradasIA usando apiFootball.ts
  useEffect(() => {
    const cargarPartidosData = async () => {
      try {
        console.log('🔄 Cargando partidos usando apiFootball.ts...');
        const partidos = await getLiveEvents();
        
        // Convertir el formato del servicio apiFootball al formato que espera NoticiasGeneradasIA
        const partidosFormateados = partidos.map(partido => ({
          fixture: { id: partido.fixtureId },
          teams: {
            home: { name: partido.teams.home.name, logo: partido.teams.home.logo },
            away: { name: partido.teams.away.name, logo: partido.teams.away.logo }
          },
          league: { name: partido.league },
          goals: { home: partido.goals.home, away: partido.goals.away },
          status: { short: partido.goals.home !== null ? 'FT' : 'NS' },
          date: new Date().toISOString(),
          events: [] // Agregar array vacío para eventos
        }));

        setPartidosData(partidosFormateados);
        console.log(`✅ ${partidosFormateados.length} partidos cargados para NoticiasGeneradasIA`);
        
        // Si no hay partidos reales, usar datos simulados
        if (partidosFormateados.length === 0) {
          console.log('⚠️ No hay partidos reales, usando datos simulados');
          setPartidosData([
            {
              fixture: { id: 1 },
              teams: { 
                home: { name: 'Manchester City', logo: '' }, 
                away: { name: 'Liverpool', logo: '' } 
              },
              league: { name: 'Premier League - Inglaterra' },
              goals: { home: 2, away: 1 },
              status: { short: 'FT' },
              date: new Date().toISOString(),
              events: []
            },
            {
              fixture: { id: 2 },
              teams: { 
                home: { name: 'Real Madrid', logo: '' }, 
                away: { name: 'Barcelona', logo: '' } 
              },
              league: { name: 'La Liga - España' },
              goals: { home: 3, away: 1 },
              status: { short: 'FT' },
              date: new Date().toISOString(),
              events: []
            }
          ]);
        }
      } catch (error) {
        console.error('❌ Error cargando datos de partidos con apiFootball:', error);
        // Datos simulados como fallback seguro
        setPartidosData([
          {
            fixture: { id: 1 },
            teams: { 
              home: { name: 'Manchester City', logo: '' }, 
              away: { name: 'Liverpool', logo: '' } 
            },
            league: { name: 'Premier League - Inglaterra' },
            goals: { home: 2, away: 1 },
            status: { short: 'FT' },
            date: new Date().toISOString(),
            events: []
          }
        ]);
      }
    };

    cargarPartidosData();
  }, []);

  return (
    <IonPage>
      <NavBar />
      <IonContent fullscreen>
        {/* Hero Section Renovada con Video o Animación de Fondo */}
        <div className="hero-section">
          <video autoPlay muted loop className="hero-video">
            <source src="/assets/soccer-background.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay animated-gradient"></div>
          <div className="hero-content">
            <div className="hero-top-badges">
              <div className="top-badge">
                <IonIcon icon={trophySharp} />
                Liga Amateur
              </div>
              <div className="top-badge">
                <IonIcon icon={flameSharp} />
                Torneos 2025
              </div>
            </div>

            <h1 className="main-title" data-text="FCnoLimit">
              <span>FC</span>noLimit
            </h1>
            <p className="hero-subtitle">Tu pasión por el fútbol no tiene límites</p>

            <div className="hero-badges">
              <div className="hero-badge">
                <span className="badge-count">250+</span>
                <span className="badge-label">Jugadores</span>
              </div>
              <div className="hero-badge">
                <span className="badge-count">120+</span>
                <span className="badge-label">Partidos</span>
              </div>
              <div className="hero-badge">
                <span className="badge-count">15+</span>
                <span className="badge-label">Torneos</span>
              </div>
            </div>

            <div className="hero-buttons">
              <IonButton className="primary-btn" onClick={() => history.push('/registro')}>
                <IonIcon icon={personOutline} slot="start" />
                ¡Únete ahora!
              </IonButton>
              <IonButton className="secondary-btn" onClick={() => history.push('/partidos')}>
                <IonIcon icon={footballOutline} slot="start" />
                Ver partidos
              </IonButton>
            </div>
          </div>

          <div className="hero-scroll-indicator">
            <div className="mouse">
              <div className="wheel"></div>
            </div>
            <div>
              <span className="scroll-arrows">
                ↓
              </span>
            </div>
          </div>
        </div>

        {/* Banner informativo con cuenta regresiva */}
        <div className="upcoming-tournament-banner">
          <div className="tournament-banner-content">
            <div className="banner-left">
              <h3><IonIcon icon={megaphoneOutline} /> Próximo Gran Torneo</h3>
              <p>Copa FCnoLimit de Verano 2025 | 20 de Agosto</p>
            </div>
            <div className="tournament-countdown">
              <div className="countdown-item">
                <span className="countdown-value">{countdown.days}</span>
                <span className="countdown-label">días</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-value">{countdown.hours}</span>
                <span className="countdown-label">horas</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-value">{countdown.minutes}</span>
                <span className="countdown-label">min</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-value">{countdown.seconds}</span>
                <span className="countdown-label">seg</span>
              </div>
            </div>
            {/* <a href="/torneos/verano2025" className="banner-link">
              Inscribe tu equipo <IonIcon icon={arrowForward} />
            </a> */}
          </div>
        </div>

        {/* Próximos partidos en cards horizontales con diseño mejorado */}
        <div className="content-section">
          <div className="upcoming-matches-section animate-on-scroll">
            <div className="section-header">
              <h2 className="section-title">
                <IonIcon icon={bulbOutline} className="section-icon" />
                <span>Próximos Partidos</span>
              </h2>
              <a href="/partidos" className="view-all-link">
                Ver calendario completo <IonIcon icon={arrowForward} />
              </a>
            </div>

            <div className="matches-slider">
              {proximosPartidos.map(p => (
                <RenderMatchCard key={p.partido_id || p.id} partido={p} isJugado={false} />
              ))}
            </div>
          </div>
        </div>

        {/* Características destacadas con nueva visualización */}
        <div className="features-section-wrapper">
          <div className="features-background"></div>
          <div className="features-section animate-on-scroll">
            <h2 className="section-title">Tu experiencia futbolística completa</h2>
            <p className="section-subtitle">Todo lo que necesitas para disfrutar del fútbol amateur</p>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon-container">
                  <div className="feature-icon-wrapper">
                    <div className="feature-icon-inner">
                      <IonIcon icon={footballSharp} className="feature-icon" />
                    </div>
                    <div className="feature-icon-orbit">
                      <span className="feature-particle"></span>
                      <span className="feature-particle"></span>
                      <span className="feature-particle"></span>
                    </div>
                  </div>
                </div>
                <h3>Partidos en vivo</h3>
                <p>Sigue todos los partidos en tiempo real con estadísticas detalladas y notificaciones.</p>
                <ul className="feature-list">
                  <li><IonIcon icon={checkmarkCircleOutline} /> Estadísticas en tiempo real</li>
                  <li><IonIcon icon={checkmarkCircleOutline} /> Notificaciones de goles</li>
                  <li><IonIcon icon={checkmarkCircleOutline} /> Resúmenes post-partido</li>
                </ul>
              </div>

              <div className="feature-card">
                <div className="feature-icon-container">
                  <div className="feature-icon-wrapper">
                    <div className="feature-icon-inner">
                      <IonIcon icon={peopleOutline} className="feature-icon" />
                    </div>
                    <div className="feature-icon-orbit">
                      <span className="feature-particle"></span>
                      <span className="feature-particle"></span>
                      <span className="feature-particle"></span>
                    </div>
                  </div>
                </div>
                <h3>Comunidad activa</h3>
                <p>Forma parte de una comunidad apasionada por el fútbol amateur de tu localidad.</p>
                <ul className="feature-list">
                  <li><IonIcon icon={checkmarkCircleOutline} /> Perfil personalizado</li>
                  <li><IonIcon icon={checkmarkCircleOutline} /> Contacto con equipos</li>
                  <li><IonIcon icon={checkmarkCircleOutline} /> Eventos comunitarios</li>
                </ul>
              </div>

              <div className="feature-card">
                <div className="feature-icon-container">
                  <div className="feature-icon-wrapper">
                    <div className="feature-icon-inner">
                      <IonIcon icon={trophyOutline} className="feature-icon" />
                    </div>
                    <div className="feature-icon-orbit">
                      <span className="feature-particle"></span>
                      <span className="feature-particle"></span>
                      <span className="feature-particle"></span>
                    </div>
                  </div>
                </div>
                <h3>Torneos exclusivos</h3>
                <p>Participa en torneos organizados con sistemas de competición profesionales.</p>
                <ul className="feature-list">
                  <li><IonIcon icon={checkmarkCircleOutline} /> Inscripción en línea</li>
                  <li><IonIcon icon={checkmarkCircleOutline} /> Calendarios automáticos</li>
                  <li><IonIcon icon={checkmarkCircleOutline} /> Premios y reconocimientos</li>
                </ul>
              </div>

              <div className="feature-card">
                <div className="feature-icon-container">
                  <div className="feature-icon-wrapper">
                    <div className="feature-icon-inner">
                      <IonIcon icon={statsChartOutline} className="feature-icon" />
                    </div>
                    <div className="feature-icon-orbit">
                      <span className="feature-particle"></span>
                      <span className="feature-particle"></span>
                      <span className="feature-particle"></span>
                    </div>
                  </div>
                </div>
                <h3>Estadísticas avanzadas</h3>
                <p>Analiza tu rendimiento con métricas detalladas para mejorar tu juego.</p>
                <ul className="feature-list">
                  <li><IonIcon icon={checkmarkCircleOutline} /> Heatmaps de posición</li>
                  <li><IonIcon icon={checkmarkCircleOutline} /> Gráficos de rendimiento</li>
                  <li><IonIcon icon={checkmarkCircleOutline} /> Comparativas entre jugadores</li>
                </ul>
              </div>
            </div>
          </div>
        </div>        {/* Destacados del momento - NoticiasGeneradasIA con datos reales */}
        <div className="fcnl-highlights-wrapper">
          <div className="">
            <NoticiasGeneradasIA partidosData={partidosData} />
          </div>
        </div>

        {/* Call to action mejorado */}
        <div className="cta-section">
          <div className="cta-content">
            <h2>¿Listo para llevar tu pasión al siguiente nivel?</h2>
            <p>Únete a FCnoLimit y disfruta del fútbol amateur como nunca antes</p>

            <div className="cta-benefits">
              <div className="cta-benefit">
                <IonIcon icon={shirtOutline} />
                <span>Juega en equipos organizados</span>
              </div>
              <div className="cta-benefit">
                <IonIcon icon={stopwatchOutline} />
                <span>Reserva canchas al instante</span>
              </div>
              <div className="cta-benefit">
                <IonIcon icon={trophySharp} />
                <span>Compite por premios reales</span>
              </div>
            </div>

            <IonButton className="primary-btn large-btn" onClick={() => history.push('/registro')}>
              Comenzar ahora <IonIcon slot="end" icon={arrowForward} />
            </IonButton>
          </div>
        </div>

        {/* Últimas noticias con diseño y clases específicas */}
        <div className="fcnl-news-wrapper">
          <section className="fcnl-news-container">
            <div className="fcnl-news-header">
              <h2 className="fcnl-news-title">
                <IonIcon icon={newspaperOutline} className="fcnl-news-icon" />
                <span>Últimas Noticias</span>
              </h2>
              <a
                className="fcnl-news-viewall"
                onClick={e => {
                  e.preventDefault();
                  history.push('/noticias-en-vivo');
                }}
                href="/noticias-en-vivo"
              >
                Ver todas las noticias <IonIcon icon={arrowForward} />
              </a>
            </div>            <div >
              <NoticiasInicioWidget />
            </div>

            <div className="fcnl-subscribe-box">
              <div className="fcnl-subscribe-content">
                <h3>No te pierdas ninguna noticia</h3>
                <p>Suscríbete a nuestro boletín semanal</p>
                <div className="fcnl-subscribe-form">
                  <input type="email" placeholder="Tu correo electrónico" className="fcnl-subscribe-input" />
                  <button className="fcnl-subscribe-button">Suscribirme</button>
                </div>
              </div>
            </div>
          </section>
        </div>        {/* Tabla de clasificación */}
        <TablaPosiciones showHeader={true} showTabs={true} showSelectors={false} />

        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default InicioPage;
