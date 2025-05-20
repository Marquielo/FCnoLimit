import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonButton, IonIcon, IonBadge, IonCard } from '@ionic/react';
// Importar Swiper en lugar de IonSlides y IonSlide
import { Swiper, SwiperSlide } from 'swiper/react';
// Importar CSS de Swiper
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
// Import Swiper modules
import { Pagination, Autoplay } from 'swiper/modules';

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
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';

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

    // Actualizar cuenta regresiva para el próximo gran torneo
    const eventDate = new Date('2025-05-13T09:00:00');

    const updateCountdown = () => {
      const now = new Date();
      const difference = eventDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => {
      hiddenElements.forEach(el => observer.unobserve(el));
      clearInterval(interval);
    };
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
            <a href="/torneos/verano2025" className="banner-link">
              Inscribe tu equipo <IonIcon icon={arrowForward} />
            </a>
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
              <div className="match-card">
                <div className="match-card-header">
                  <div className="match-league">Liga Municipal • Jornada 5</div>
                  <div className="match-date">Hoy • 17:00</div>
                </div>

                <div className="match-teams">
                  <div className="team">
                    <div className="team-logo">
                      <img src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/Paris_Saint-Germain_F.C..svg/180px-Paris_Saint-Germain_F.C..svg.png" alt="Manchester City" />
                    </div>
                    <div className="team-name">Manchester City</div>
                  </div>

                  <div className="match-vs">
                    <div className="vs-badge">VS</div>
                  </div>

                  <div className="team">
                    <div className="team-logo">
                      <img src="https://cdn-icons-png.flaticon.com/512/824/824725.png" alt="Liverpool" />
                    </div>
                    <div className="team-name">Manchester United</div>
                  </div>
                </div>

                <div className="match-info">
                  <div className="match-info-item">
                    <IonIcon icon={locationOutline} />
                    <span>Cancha Principal</span>
                  </div>
                  <a href="/partidos/123" className="match-details-btn">
                    Detalles <IonIcon icon={arrowForward} />
                  </a>
                </div>

                {/* Nueva imagen de fondo para el partido */}
                <div className="match-background-image">
                  <img src="https://images.pexels.com/photos/270085/pexels-photo-270085.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Stadium background" />
                </div>
              </div>

              <div className="match-card">
                <div className="match-card-header">
                  <div className="match-league">Liga Amateur • Jornada 7</div>
                  <div className="match-date">Mañana • 19:30</div>
                </div>

                <div className="match-teams">
                  <div className="team">
                    <div className="team-logo">
                      <img src="https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/180px-FC_Barcelona_%28crest%29.svg.png" alt="Barcelona" />
                    </div>
                    <div className="team-name">FC Barcelona</div>
                  </div>

                  <div className="match-vs">
                    <div className="vs-badge">VS</div>
                  </div>

                  <div className="team">
                    <div className="team-logo">
                      <img src="https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/180px-Real_Madrid_CF.svg.png" alt="Real Madrid" />
                    </div>
                    <div className="team-name">Real Madrid</div>
                  </div>
                </div>

                <div className="match-info">
                  <div className="match-info-item">
                    <IonIcon icon={locationOutline} />
                    <span>Complejo Deportivo Este</span>
                  </div>
                  <a href="/partidos/124" className="match-details-btn">
                    Detalles <IonIcon icon={arrowForward} />
                  </a>
                </div>

                {/* Nueva imagen de fondo para el segundo partido */}
                <div className="match-background-image">
                  <img src="https://images.pexels.com/photos/3148452/pexels-photo-3148452.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Stadium background" />
                </div>
              </div>

              <div className="match-card">
                <div className="match-card-header">
                  <div className="match-league">Copa FCnoLimit • Cuartos</div>
                  <div className="match-date">Sábado • 10:00</div>
                </div>

                <div className="match-teams">
                  <div className="team">
                    <div className="team-logo">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/FC_Internazionale_Milano_2021.svg/180px-FC_Internazionale_Milano_2021.svg.png" alt="Atlético de Madrid" />
                    </div>
                    <div className="team-name">Inter Milan</div>
                  </div>

                  <div className="match-vs">
                    <div className="vs-badge">VS</div>
                  </div>

                  <div className="team">
                    <div className="team-logo">
                      <img src="https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Chelsea_FC.svg/180px-Chelsea_FC.svg.png" alt="Chelsea" />
                    </div>
                    <div className="team-name">Chelsea</div>
                  </div>
                </div>

                <div className="match-info">
                  <div className="match-info-item">
                    <IonIcon icon={locationOutline} />
                    <span>Estadio Municipal</span>
                  </div>
                  <a href="/partidos/125" className="match-details-btn">
                    Detalles <IonIcon icon={arrowForward} />
                  </a>
                </div>

                {/* Nueva imagen de fondo para el tercer partido */}
                <div className="match-background-image">
                  <img src="https://images.pexels.com/photos/2291006/pexels-photo-2291006.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Stadium background" />
                </div>
              </div>
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
        </div>

        {/* Destacados del momento - Slider con nuevo diseño */}
        <div className="fcnl-highlights-wrapper">
          <div className="fcnl-highlights-container">
            <div className="fcnl-highlights-header">
              <h2 className="fcnl-highlights-title">
                <IonIcon icon={flameOutline} className="fcnl-highlights-icon" />
                <span>Destacados del momento</span>
              </h2>
              <a href="/destacados" className="fcnl-highlights-view-all">
                Todos los destacados <IonIcon icon={arrowForward} />
              </a>
            </div>

            <Swiper
              spaceBetween={25}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              className="fcnl-highlights-swiper"
            >
              <SwiperSlide>
                <div className="fcnl-highlight-item fcnl-highlight-goal">
                  <div className="fcnl-highlight-image">
                    <img src="/assets/highlights/goal.jpg" alt="Gol destacado" />
                    <div className="fcnl-highlight-badge goal-badge">Gol de la semana</div>
                    <div className="fcnl-highlight-overlay">
                      <div className="fcnl-highlight-play">
                        <IonIcon icon={flameSharp} />
                      </div>
                    </div>
                  </div>
                  <div className="fcnl-highlight-content">
                    <h3 className="fcnl-highlight-title">Golazo de Carlos Méndez desde media cancha</h3>
                    <p className="fcnl-highlight-desc">Un impresionante gol que dio la victoria a su equipo en el último minuto del partido en una jugada que será recordada por mucho tiempo.</p>
                    <div className="fcnl-highlight-footer">
                      <div className="fcnl-highlight-meta">
                        <span className="fcnl-highlight-match"><IonIcon icon={footballOutline} /> Leones FC vs Águilas</span>
                        <span className="fcnl-highlight-date"><IonIcon icon={calendarOutline} /> 10 de Mayo, 2025</span>
                      </div>
                      <a href="/highlights/1" className="fcnl-highlight-button">
                        Ver video <IonIcon icon={arrowForward} />
                      </a>
                    </div>
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="fcnl-highlight-item fcnl-highlight-tournament">
                  <div className="fcnl-highlight-image">
                    <img src="/assets/highlights/tournament.jpg" alt="Torneo destacado" />
                    <div className="fcnl-highlight-badge tournament-badge">Torneo destacado</div>
                    <div className="fcnl-highlight-overlay">
                      <div className="fcnl-highlight-play">
                        <IonIcon icon={trophySharp} />
                      </div>
                    </div>
                  </div>
                  <div className="fcnl-highlight-content">
                    <h3 className="fcnl-highlight-title">Copa Primavera 2025</h3>
                    <p className="fcnl-highlight-desc">El torneo más esperado de la temporada con la participación de 16 equipos de primer nivel. Compite por premios exclusivos y el prestigioso trofeo de campeón.</p>
                    <div className="fcnl-highlight-footer">
                      <div className="fcnl-highlight-meta">
                        <span className="fcnl-highlight-match"><IonIcon icon={peopleOutline} /> 16 equipos</span>
                        <span className="fcnl-highlight-date"><IonIcon icon={calendarOutline} /> Inicia: 5 de junio</span>
                      </div>
                      <a href="/highlights/2" className="fcnl-highlight-button">
                        Más información <IonIcon icon={arrowForward} />
                      </a>
                    </div>
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="fcnl-highlight-item fcnl-highlight-player">
                  <div className="fcnl-highlight-image">
                    <img src="/assets/highlights/player.jpg" alt="Jugador destacado" />
                    <div className="fcnl-highlight-badge player-badge">Jugador destacado</div>
                    <div className="fcnl-highlight-overlay">
                      <div className="fcnl-highlight-play">
                        <IonIcon icon={personOutline} />
                      </div>
                    </div>
                  </div>
                  <div className="fcnl-highlight-content">
                    <h3 className="fcnl-highlight-title">Laura Gutiérrez: La revelación del mes</h3>
                    <p className="fcnl-highlight-desc">Con 6 goles y 14 asistencias, se ha convertido en la jugadora más valiosa de la liga. Su visión de juego y capacidad de definición la destacan en cada partido.</p>
                    <div className="fcnl-highlight-footer">
                      <div className="fcnl-highlight-meta">
                        <span className="fcnl-highlight-match"><IonIcon icon={shirtOutline} /> Mediocampista - Delfines</span>
                        <span className="fcnl-highlight-date"><IonIcon icon={starOutline} /> MVP Mayo 2025</span>
                      </div>
                      <a href="/highlights/3" className="fcnl-highlight-button">
                        Ver perfil <IonIcon icon={arrowForward} />
                      </a>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
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
              <a href="/noticias" className="fcnl-news-viewall">
                Ver todas las noticias <IonIcon icon={arrowForward} />
              </a>
            </div>

            <div className="fcnl-news-grid">
              <article className="fcnl-news-item">
                <div className="fcnl-news-image-wrapper">
                  <img src="/assets/news/news1.jpg" alt="Noticia 1" className="fcnl-news-image" />
                  <div className="fcnl-news-category">Torneos</div>
                  <div className="fcnl-news-overlay">
                    <div className="fcnl-news-icon-circle">
                      <IonIcon icon={newspaperOutline} />
                    </div>
                  </div>
                </div>
                <div className="fcnl-news-body">
                  <div className="fcnl-news-metadata">
                    <div className="fcnl-news-date"><IonIcon icon={calendarOutline} /> 15 de Abril, 2025</div>
                    <div className="fcnl-news-views"><IonIcon icon={eyeOutline} /> 238</div>
                  </div>
                  <h3 className="fcnl-news-headline">Gran victoria en el torneo local</h3>
                  <p className="fcnl-news-summary">
                    El equipo logró una importante victoria que lo coloca en los primeros lugares de la tabla de clasificación y lo mantiene con opciones de título.
                  </p>
                  <div className="fcnl-news-footer">
                    <div className="fcnl-news-tags">
                      <span className="fcnl-news-tag">Liga</span>
                      <span className="fcnl-news-tag">Victoria</span>
                    </div>
                    <a href="/noticias/1" className="fcnl-news-button">
                      Leer más <IonIcon icon={arrowForward} />
                    </a>
                  </div>
                </div>
              </article>

              <article className="fcnl-news-item">
                <div className="fcnl-news-image-wrapper">
                  <img src="/assets/news/news2.jpg" alt="Noticia 2" className="fcnl-news-image" />
                  <div className="fcnl-news-category">Fichajes</div>
                  <div className="fcnl-news-overlay">
                    <div className="fcnl-news-icon-circle">
                      <IonIcon icon={newspaperOutline} />
                    </div>
                  </div>
                </div>
                <div className="fcnl-news-body">
                  <div className="fcnl-news-metadata">
                    <div className="fcnl-news-date"><IonIcon icon={calendarOutline} /> 12 de Abril, 2025</div>
                    <div className="fcnl-news-views"><IonIcon icon={eyeOutline} /> 456</div>
                  </div>
                  <h3 className="fcnl-news-headline">Nuevo fichaje estrella para la temporada</h3>
                  <p className="fcnl-news-summary">
                    FCnoLimit refuerza su plantilla con la llegada de un prometedor delantero que promete marcar diferencia en los próximos torneos.
                  </p>
                  <div className="fcnl-news-footer">
                    <div className="fcnl-news-tags">
                      <span className="fcnl-news-tag">Fichajes</span>
                      <span className="fcnl-news-tag">Delantero</span>
                    </div>
                    <a href="/noticias/2" className="fcnl-news-button">
                      Leer más <IonIcon icon={arrowForward} />
                    </a>
                  </div>
                </div>
              </article>

              <article className="fcnl-news-item">
                <div className="fcnl-news-image-wrapper">
                  <img src="/assets/news/news3.jpg" alt="Noticia 3" className="fcnl-news-image" />
                  <div className="fcnl-news-category">Eventos</div>
                  <div className="fcnl-news-overlay">
                    <div className="fcnl-news-icon-circle">
                      <IonIcon icon={newspaperOutline} />
                    </div>
                  </div>
                </div>
                <div className="fcnl-news-body">
                  <div className="fcnl-news-metadata">
                    <div className="fcnl-news-date"><IonIcon icon={calendarOutline} /> 10 de Abril, 2025</div>
                    <div className="fcnl-news-views"><IonIcon icon={eyeOutline} /> 183</div>
                  </div>
                  <h3 className="fcnl-news-headline">Próximo torneo de verano: fechas confirmadas</h3>
                  <p className="fcnl-news-summary">
                    Anunciamos las fechas y detalles del próximo torneo de verano, que promete ser el más competitivo hasta la fecha con premios exclusivos.
                  </p>
                  <div className="fcnl-news-footer">
                    <div className="fcnl-news-tags">
                      <span className="fcnl-news-tag">Verano</span>
                      <span className="fcnl-news-tag">Torneos</span>
                    </div>
                    <a href="/noticias/3" className="fcnl-news-button">
                      Leer más <IonIcon icon={arrowForward} />
                    </a>
                  </div>
                </div>
              </article>
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
        </div>

        {/* Tabla de clasificación */}
        <div className="content-section standings-section animate-on-scroll">
          <div className="section-header">
            <h2 className="section-title">
              <IonIcon icon={podiumOutline} className="section-icon" />
              <span>Clasificación actual</span>
            </h2>
            <a href="/clasificacion" className="view-all-link">
              Ver completa <IonIcon icon={arrowForward} />
            </a>
          </div>

          <div className="standings-tabs">
            <div className="standings-tab active">Liga Amateur</div>
            <div className="standings-tab">Copa FCnoLimit</div>
            <div className="standings-tab">Torneo Verano</div>
          </div>

          {/* Vista para escritorio - tabla completa */}
          <div className="standings-table-container desktop-only">
            <table className="standings-table">
              <thead>
                <tr>
                  <th>Pos</th>
                  <th>Equipo</th>
                  <th>PJ</th>
                  <th>G</th>
                  <th>E</th>
                  <th>P</th>
                  <th>GF</th>
                  <th>GC</th>
                  <th>DG</th>
                  <th>Pts</th>
                  <th>Forma</th>
                </tr>
              </thead>
              <tbody>
                <tr className="promotion-zone">
                  <td>1</td>
                  <td className="team-cell">
                    <div className="team-logo">
                      <img src="https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/180px-Manchester_City_FC_badge.svg.png" alt="Manchester City" />
                    </div>
                    <span>Manchester City</span>
                  </td>
                  <td>10</td>
                  <td>8</td>
                  <td>1</td>
                  <td>1</td>
                  <td>24</td>
                  <td>8</td>
                  <td>+16</td>
                  <td className="points">25</td>
                  <td className="form">
                    <span className="form-win">G</span>
                    <span className="form-win">G</span>
                    <span className="form-win">G</span>
                    <span className="form-draw">E</span>
                    <span className="form-win">G</span>
                  </td>
                </tr>
                <tr className="promotion-zone">
                  <td>2</td>
                  <td className="team-cell">
                    <div className="team-logo">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/FC_Internazionale_Milano_2021.svg/180px-FC_Internazionale_Milano_2021.svg.png" alt="Liverpool" />
                    </div>
                    <span>Inter Milan</span>
                  </td>
                  <td>10</td>
                  <td>6</td>
                  <td>3</td>
                  <td>1</td>
                  <td>18</td>
                  <td>9</td>
                  <td>+9</td>
                  <td className="points">21</td>
                  <td className="form">
                    <span className="form-win">G</span>
                    <span className="form-draw">E</span>
                    <span className="form-win">G</span>
                    <span className="form-win">G</span>
                    <span className="form-draw">E</span>
                  </td>
                </tr>
                <tr>
                  <td>3</td>
                  <td className="team-cell">
                    <div className="team-logo">
                      <img src="https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/180px-FC_Barcelona_%28crest%29.svg.png" alt="Barcelona" />
                    </div>
                    <span>FC Barcelona</span>
                  </td>
                  <td>10</td>
                  <td>6</td>
                  <td>2</td>
                  <td>2</td>
                  <td>20</td>
                  <td>12</td>
                  <td>+8</td>
                  <td className="points">20</td>
                  <td className="form">
                    <span className="form-loss">P</span>
                    <span className="form-win">G</span>
                    <span className="form-win">G</span>
                    <span className="form-draw">E</span>
                    <span className="form-win">G</span>
                  </td>
                </tr>
                <tr>
                  <td>4</td>
                  <td className="team-cell">
                    <div className="team-logo">
                      <img src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/180px-Manchester_United_FC_crest.svg.png" alt="Manchester United" />
                    </div>
                    <span>Manchester United</span>
                  </td>
                  <td>10</td>
                  <td>5</td>
                  <td>3</td>
                  <td>2</td>
                  <td>15</td>
                  <td>10</td>
                  <td>+5</td>
                  <td className="points">18</td>
                  <td className="form">
                    <span className="form-win">G</span>
                    <span className="form-win">G</span>
                    <span className="form-draw">E</span>
                    <span className="form-loss">P</span>
                    <span className="form-draw">E</span>
                  </td>
                </tr>
                <tr>
                  <td>5</td>
                  <td className="team-cell">
                    <div className="team-logo">
                      <img src="https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Chelsea_FC.svg/180px-Chelsea_FC.svg.png" alt="Chelsea" />
                    </div>
                    <span>Chelsea</span>
                  </td>
                  <td>10</td>
                  <td>4</td>
                  <td>3</td>
                  <td>3</td>
                  <td>14</td>
                  <td>12</td>
                  <td>+2</td>
                  <td className="points">15</td>
                  <td className="form">
                    <span className="form-win">G</span>
                    <span className="form-loss">P</span>
                    <span className="form-draw">E</span>
                    <span className="form-win">G</span>
                    <span className="form-loss">P</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Vista para móvil - acordeones */}
          <div className="standings-accordion-container mobile-only">
            {/* Equipo 1 - Leones FC */}
            <div className="standings-accordion">
              <div
                className={`standings-accordion-header ${activeAccordion === 0 ? 'active' : ''}`}
                onClick={() => handleAccordionClick(0)}
              >
                <div className="accordion-rank">
                  <div className="accordion-position promotion-position">1</div>
                </div>
                <div className="accordion-team-info">
                  <div className="team-logo-container">
                    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/180px-Manchester_City_FC_badge.svg.png" alt="Manchester City" />
                  </div>
                  <span className="accordion-team-name">Manchester City</span>
                </div>
                <div className="accordion-summary">
                  <div className="accordion-points">25</div>
                  <div className="accordion-toggle">
                    <IonIcon icon={arrowForward} className="toggle-icon" />
                  </div>
                </div>
              </div>
              <div
                className={`standings-accordion-content ${activeAccordion === 0 ? 'active' : ''}`}
                style={{ maxHeight: activeAccordion === 0 ? '500px' : '0px' }}
              >
                <div className="accordion-content-inner">
                  <div className="accordion-main-stats">
                    <div className="main-stat-item">
                      <div className="stat-value">10</div>
                      <div className="stat-label">PJ</div>
                    </div>
                    <div className="main-stat-item">
                      <div className="stat-value wins">8</div>
                      <div className="stat-label">G</div>
                    </div>
                    <div className="main-stat-item">
                      <div className="stat-value draws">1</div>
                      <div className="stat-label">E</div>
                    </div>
                    <div className="main-stat-item">
                    </div>
                    <div className="secondary-stat diff">
                      <span className="stat-label">Diferencia de goles:</span>
                      <span className="stat-value positive">+16</span>
                    </div>
                  </div>

                  <div className="accordion-form-section">
                    <div className="form-title">Últimos partidos</div>
                    <div className="form-indicators">
                      <span className="form-result win">G</span>
                      <span className="form-result win">G</span>
                      <span className="form-result win">G</span>
                      <span className="form-result draw">E</span>
                      <span className="form-result win">G</span>
                    </div>
                  </div>

                  <div className="accordion-actions">
                    <a href="/equipo/leones" className="accordion-team-link">
                      <span>Ver perfil completo</span>
                      <IonIcon icon={arrowForward} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Equipo 2 - Águilas */}
            <div className="standings-accordion">
              <div
                className={`standings-accordion-header ${activeAccordion === 1 ? 'active' : ''}`}
                onClick={() => handleAccordionClick(1)}
              >
                <div className="accordion-rank">
                  <div className="accordion-position promotion-position">2</div>
                </div>
                <div className="accordion-team-info">
                  <div className="team-logo-container">
                    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Liverpool_FC_crest.svg/180px-Liverpool_FC_crest.svg.png" alt="Liverpool" />
                  </div>
                  <span className="accordion-team-name">Liverpool</span>
                </div>
                <div className="accordion-summary">
                  <div className="accordion-points">21</div>
                  <div className="accordion-toggle">
                    <IonIcon icon={arrowForward} className="toggle-icon" />
                  </div>
                </div>
              </div>
              <div
                className={`standings-accordion-content ${activeAccordion === 1 ? 'active' : ''}`}
                style={{ maxHeight: activeAccordion === 1 ? '500px' : '0' }}
              >
                <div className="accordion-content-inner">
                  <div className="accordion-main-stats">
                    <div className="main-stat-item">
                      <div className="stat-value">10</div>
                      <div className="stat-label">PJ</div>
                    </div>
                    <div className="main-stat-item">
                      <div className="stat-value wins">6</div>
                      <div className="stat-label">G</div>
                    </div>
                    <div className="main-stat-item">
                      <div className="stat-value draws">3</div>
                      <div className="stat-label">E</div>
                    </div>
                    <div className="main-stat-item">
                      <div className="stat-value losses">1</div>
                      <div className="stat-label">P</div>
                    </div>
                  </div>

                  <div className="accordion-secondary-stats">
                    <div className="secondary-stats-row">
                      <div className="secondary-stat">
                        <span className="stat-label">Goles a favor:</span>
                        <span className="stat-value">18</span>
                      </div>
                      <div className="secondary-stat">
                        <span className="stat-label">Goles en contra:</span>
                        <span className="stat-value">9</span>
                      </div>
                    </div>
                    <div className="secondary-stat diff">
                      <span className="stat-label">Diferencia de goles:</span>
                      <span className="stat-value positive">+9</span>
                    </div>
                  </div>

                  <div className="accordion-form-section">
                    <div className="form-title">Últimos partidos</div>
                    <div className="form-indicators">
                      <span className="form-result win">G</span>
                      <span className="form-result draw">E</span>
                      <span className="form-result win">G</span>
                      <span className="form-result win">G</span>
                      <span className="form-result draw">E</span>
                    </div>
                  </div>

                  <div className="accordion-actions">
                    <a href="/equipo/aguilas" className="accordion-team-link">
                      <span>Ver perfil completo</span>
                      <IonIcon icon={arrowForward} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Equipo 3 - Titanes */}
            <div className="standings-accordion">
              <div
                className={`standings-accordion-header ${activeAccordion === 2 ? 'active' : ''}`}
                onClick={() => handleAccordionClick(2)}
              >
                <div className="accordion-rank">
                  <div className="accordion-position">3</div>
                </div>
                <div className="accordion-team-info">
                  <div className="team-logo-container">
                    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/180px-FC_Barcelona_%28crest%29.svg.png" alt="Barcelona" />
                  </div>
                  <span className="accordion-team-name">FC Barcelona</span>
                </div>
                <div className="accordion-summary">
                  <div className="accordion-points">20</div>
                  <div className="accordion-toggle">
                    <IonIcon icon={arrowForward} className="toggle-icon" />
                  </div>
                </div>
              </div>
              <div
                className={`standings-accordion-content ${activeAccordion === 2 ? 'active' : ''}`}
                style={{ maxHeight: activeAccordion === 2 ? '500px' : '0' }}
              >
                <div className="accordion-content-inner">
                  <div className="accordion-main-stats">
                    <div className="main-stat-item">
                      <div className="stat-value">10</div>
                      <div className="stat-label">PJ</div>
                    </div>
                    <div className="main-stat-item">
                      <div className="stat-value wins">6</div>
                      <div className="stat-label">G</div>
                    </div>
                    <div className="main-stat-item">
                      <div className="stat-value draws">2</div>
                      <div className="stat-label">E</div>
                    </div>
                    <div className="main-stat-item">
                      <div className="stat-value losses">2</div>
                      <div className="stat-label">P</div>
                    </div>
                  </div>

                  <div className="accordion-secondary-stats">
                    <div className="secondary-stats-row">
                      <div className="secondary-stat">
                        <span className="stat-label">Goles a favor:</span>
                        <span className="stat-value">20</span>
                      </div>
                      <div className="secondary-stat">
                        <span className="stat-label">Goles en contra:</span>
                        <span className="stat-value">12</span>
                      </div>
                    </div>
                    <div className="secondary-stat diff">
                      <span className="stat-label">Diferencia de goles:</span>
                      <span className="stat-value positive">+8</span>
                    </div>
                  </div>

                  <div className="accordion-form-section">
                    <div className="form-title">Últimos partidos</div>
                    <div className="form-indicators">
                      <span className="form-result loss">P</span>
                      <span className="form-result win">G</span>
                      <span className="form-result win">G</span>
                      <span className="form-result draw">E</span>
                      <span className="form-result win">G</span>
                    </div>
                  </div>

                  <div className="accordion-actions">
                    <a href="/equipo/titanes" className="accordion-team-link">
                      <span>Ver perfil completo</span>
                      <IonIcon icon={arrowForward} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Equipo 4 - Delfines */}
            <div className="standings-accordion">
              <div
                className={`standings-accordion-header ${activeAccordion === 3 ? 'active' : ''}`}
                onClick={() => handleAccordionClick(3)}
              >
                <div className="accordion-rank">
                  <div className="accordion-position">4</div>
                </div>
                <div className="accordion-team-info">
                  <div className="team-logo-container">
                    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/180px-Manchester_United_FC_crest.svg.png" alt="Manchester United" />
                  </div>
                  <span className="accordion-team-name">Manchester United</span>
                </div>
                <div className="accordion-summary">
                  <div className="accordion-points">18</div>
                  <div className="accordion-toggle">
                    <IonIcon icon={arrowForward} className="toggle-icon" />
                  </div>
                </div>
              </div>
              <div
                className={`standings-accordion-content ${activeAccordion === 3 ? 'active' : ''}`}
                style={{ maxHeight: activeAccordion === 3 ? '500px' : '0' }}
              >
                <div className="accordion-content-inner">
                  <div className="accordion-main-stats">
                    <div className="main-stat-item">
                      <div className="stat-value">10</div>
                      <div className="stat-label">PJ</div>
                    </div>
                    <div className="main-stat-item">
                      <div className="stat-value wins">5</div>
                      <div className="stat-label">G</div>
                    </div>
                    <div className="main-stat-item">
                      <div className="stat-value draws">3</div>
                      <div className="stat-label">E</div>
                    </div>
                    <div className="main-stat-item">
                      <div className="stat-value losses">2</div>
                      <div className="stat-label">P</div>
                    </div>
                  </div>

                  <div className="accordion-secondary-stats">
                    <div className="secondary-stats-row">
                      <div className="secondary-stat">
                        <span className="stat-label">Goles a favor:</span>
                        <span className="stat-value">15</span>
                      </div>
                      <div className="secondary-stat">
                        <span className="stat-label">Goles en contra:</span>
                        <span className="stat-value">10</span>
                      </div>
                    </div>
                    <div className="secondary-stat diff">
                      <span className="stat-label">Diferencia de goles:</span>
                      <span className="stat-value positive">+5</span>
                    </div>
                  </div>

                  <div className="accordion-form-section">
                    <div className="form-title">Últimos partidos</div>
                    <div className="form-indicators">
                      <span className="form-result win">G</span>
                      <span className="form-result win">G</span>
                      <span className="form-result draw">E</span>
                      <span className="form-result loss">P</span>
                      <span className="form-result draw">E</span>
                    </div>
                  </div>

                  <div className="accordion-actions">
                    <a href="/equipo/delfines" className="accordion-team-link">
                      <span>Ver perfil completo</span>
                      <IonIcon icon={arrowForward} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Equipo 5 - Guerreros */}
            <div className="standings-accordion">
              <div
                className={`standings-accordion-header ${activeAccordion === 4 ? 'active' : ''}`}
                onClick={() => handleAccordionClick(4)}
              >
                <div className="accordion-rank">
                  <div className="accordion-position">5</div>
                </div>
                <div className="accordion-team-info">
                  <div className="team-logo-container">
                    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Chelsea_FC.svg/180px-Chelsea_FC.svg.png" alt="Chelsea" />
                  </div>
                  <span className="accordion-team-name">Chelsea</span>
                </div>
                <div className="accordion-summary">
                  <div className="accordion-points">15</div>
                  <div className="accordion-toggle">
                    <IonIcon icon={arrowForward} className="toggle-icon" />
                  </div>
                </div>
              </div>
              <div
                className={`standings-accordion-content ${activeAccordion === 4 ? 'active' : ''}`}
                style={{ maxHeight: activeAccordion === 4 ? '500px' : '0' }}
              >
                <div className="accordion-content-inner">
                  <div className="accordion-main-stats">
                    <div className="main-stat-item">
                      <div className="stat-value">10</div>
                      <div className="stat-label">PJ</div>
                    </div>
                    <div className="main-stat-item">
                      <div className="stat-value wins">4</div>
                      <div className="stat-label">G</div>
                    </div>
                    <div className="main-stat-item">
                      <div className="stat-value draws">3</div>
                      <div className="stat-label">E</div>
                    </div>
                    <div className="main-stat-item">
                      <div className="stat-value losses">3</div>
                      <div className="stat-label">P</div>
                    </div>
                  </div>

                  <div className="accordion-secondary-stats">
                    <div className="secondary-stats-row">
                      <div className="secondary-stat">
                        <span className="stat-label">Goles a favor:</span>
                        <span className="stat-value">14</span>
                      </div>
                      <div className="secondary-stat">
                        <span className="stat-label">Goles en contra:</span>
                        <span className="stat-value">12</span>
                      </div>
                    </div>
                    <div className="secondary-stat diff">
                      <span className="stat-label">Diferencia de goles:</span>
                      <span className="stat-value positive">+2</span>
                    </div>
                  </div>

                  <div className="accordion-form-section">
                    <div className="form-title">Últimos partidos</div>
                    <div className="form-indicators">
                      <span className="form-result win">G</span>
                      <span className="form-result loss">P</span>
                      <span className="form-result draw">E</span>
                      <span className="form-result win">G</span>
                      <span className="form-result loss">P</span>
                    </div>
                  </div>

                  <div className="accordion-actions">
                    <a href="/equipo/guerreros" className="accordion-team-link">
                      <span>Ver perfil completo</span>
                      <IonIcon icon={arrowForward} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default InicioPage;
