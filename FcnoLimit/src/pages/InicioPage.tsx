import React from 'react';
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/react';
import { footballOutline, peopleOutline, trophyOutline, statsChartOutline, arrowForward } from 'ionicons/icons';
import './InicioPage.css';
import NavBar from '../components/NavBar';
import CardList from '../components/CardList';
import Footer from '../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';

const InicioPage: React.FC = () => {
  return (
    <IonPage>
      <NavBar />
      <IonContent fullscreen>
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="main-title">FCnoLimit</h1>
            <p className="hero-subtitle">La plataforma definitiva para el fútbol amateur</p>
            <div className="hero-buttons">
              <IonButton routerLink="/register" color="secondary" size="large">
                ¡Únete ahora!
              </IonButton>
              <IonButton routerLink="/matches" color="secondary" fill="outline" size="large">
                Ver partidos
              </IonButton>
            </div>
          </div>
        </div>

        <div className="features-section">
          <div className="feature-card">
            <IonIcon icon={footballOutline} />
            <h3>Partidos en Vivo</h3>
            <p>Sigue todos los partidos en tiempo real</p>
          </div>
          <div className="feature-card">
            <IonIcon icon={peopleOutline} />
            <h3>Comunidad</h3>
            <p>Únete a la comunidad futbolera más grande</p>
          </div>
          <div className="feature-card">
            <IonIcon icon={trophyOutline} />
            <h3>Torneos</h3>
            <p>Participa en torneos y compite</p>
          </div>
          <div className="feature-card">
            <IonIcon icon={statsChartOutline} />
            <h3>Estadísticas</h3>
            <p>Analiza tu rendimiento</p>
          </div>
        </div>

        <div className="content-container">
          <section className="news-section">
            <h2 className="section-title">Últimas Noticias</h2>
            <div className="news-grid">
              <article className="news-card">
                <img src="/assets/news1.jpg" alt="Noticia 1" className="news-image" />
                <div className="news-content">
                  <div className="news-date">15 de Abril, 2024</div>
                  <h3 className="news-title">Gran victoria en el torneo local</h3>
                  <p className="news-excerpt">
                    El equipo logró una importante victoria que lo coloca en los primeros lugares de la tabla...
                  </p>
                  <a href="#" className="news-link">
                    Leer más <IonIcon icon={arrowForward} />
                  </a>
                </div>
              </article>

              <article className="news-card">
                <img src="/assets/news2.jpg" alt="Noticia 2" className="news-image" />
                <div className="news-content">
                  <div className="news-date">12 de Abril, 2024</div>
                  <h3 className="news-title">Nuevo fichaje estrella</h3>
                  <p className="news-excerpt">
                    FCnoLimit refuerza su plantilla con la llegada de un prometedor delantero...
                  </p>
                  <a href="#" className="news-link">
                    Leer más <IonIcon icon={arrowForward} />
                  </a>
                </div>
              </article>

              <article className="news-card">
                <img src="/assets/news3.jpg" alt="Noticia 3" className="news-image" />
                <div className="news-content">
                  <div className="news-date">10 de Abril, 2024</div>
                  <h3 className="news-title">Próximo torneo de verano</h3>
                  <p className="news-excerpt">
                    Anunciamos las fechas y detalles del próximo torneo de verano...
                  </p>
                  <a href="#" className="news-link">
                    Leer más <IonIcon icon={arrowForward} />
                  </a>
                </div>
              </article>
            </div>
            <div className="view-all-container">
              <IonButton 
                routerLink="/noticias" 
                color="secondary" 
                fill="outline" 
                size="large"
              >
                Ver todas las noticias
                <IonIcon slot="end" icon={arrowForward} />
              </IonButton>
            </div>
          </section>

          <section className="highlights-section">
            <h2 className="section-title">Jugadores Destacados</h2>
            <CardList />
          </section>

          <section className="stats-section">
            <h2 className="section-title">Estadísticas del Club</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <h3>250+</h3>
                <p>Jugadores</p>
              </div>
              <div className="stat-item">
                <h3>100+</h3>
                <p>Partidos</p>
              </div>
              <div className="stat-item">
                <h3>15+</h3>
                <p>Torneos</p>
              </div>
              <div className="stat-item">
                <h3>98%</h3>
                <p>Satisfacción</p>
              </div>
            </div>
          </section>

          <section className="upcoming-tournaments-section">
            <h2 className="section-title">Próximos Torneos</h2>
            <div className="tournaments-grid">
              <div className="tournament-card">
                <div className="tournament-date">Mayo 2024</div>
                <h3>Copa Primavera</h3>
                <p>Torneo para todas las categorías</p>
                <IonButton fill="outline" size="small">Ver detalles</IonButton>
              </div>
              <div className="tournament-card">
                <div className="tournament-date">Junio 2024</div>
                <h3>Liga Amateur Regional</h3>
                <p>Competencia entre equipos locales</p>
                <IonButton fill="outline" size="small">Ver detalles</IonButton>
              </div>
            </div>
          </section>

          <section className="training-section">
            <h2 className="section-title">Entrenamientos y Desarrollo</h2>
            <div className="training-grid">
              <div className="training-card">
                <IonIcon icon={footballOutline} size="large"/>
                <h3>Escuela de Fútbol</h3>
                <p>Para todas las edades y niveles</p>
                <IonButton fill="outline" size="small">Inscríbete</IonButton>
              </div>
              <div className="training-card">
                <IonIcon icon={peopleOutline} size="large"/>
                <h3>Clínicas Deportivas</h3>
                <p>Mejora tu técnica con expertos</p>
                <IonButton fill="outline" size="small">Más información</IonButton>
              </div>
            </div>
          </section>

          <section className="academy-section">
            <h2 className="section-title">Academia de Fútbol</h2>
            <div className="academy-grid">
              <div className="academy-card">
                <IonIcon icon={footballOutline} size="large"/>
                <h3>Categorías Infantiles</h3>
                <p>De 6 a 12 años</p>
                <ul className="academy-features">
                  <li>Desarrollo motriz</li>
                  <li>Fundamentos técnicos</li>
                  <li>Valores deportivos</li>
                </ul>
                <IonButton fill="outline" size="small">Inscribir</IonButton>
              </div>
              <div className="academy-card">
                <IonIcon icon={footballOutline} size="large"/>
                <h3>Juveniles</h3>
                <p>De 13 a 17 años</p>
                <ul className="academy-features">
                  <li>Técnica avanzada</li>
                  <li>Táctica de juego</li>
                  <li>Preparación física</li>
                </ul>
                <IonButton fill="outline" size="small">Inscribir</IonButton>
              </div>
            </div>
          </section>

          <section className="events-section">
            <h2 className="section-title">Eventos Especiales</h2>
            <div className="events-grid">
              <div className="event-card">
                <div className="event-date">Próximo fin de semana</div>
                <h3>Visorías</h3>
                <p>Búsqueda de talentos para equipos profesionales</p>
                <IonButton fill="outline" size="small">Registrarse</IonButton>
              </div>
              <div className="event-card">
                <div className="event-date">Cada mes</div>
                <h3>Torneos Relámpago</h3>
                <p>Competencias de un día con premios</p>
                <IonButton fill="outline" size="small">Participar</IonButton>
              </div>
            </div>
          </section>

          <section className="services-section">
            <h2 className="section-title">Servicios Adicionales</h2>
            <div className="services-grid">
              <div className="service-card">
                <IonIcon icon={peopleOutline} size="large"/>
                <h3>Nutrición Deportiva</h3>
                <p>Asesoría personalizada para deportistas</p>
                <IonButton fill="outline" size="small">Consultar</IonButton>
              </div>
              <div className="service-card">
                <IonIcon icon={statsChartOutline} size="large"/>
                <h3>Análisis de Rendimiento</h3>
                <p>Evaluación técnica con tecnología</p>
                <IonButton fill="outline" size="small">Agendar</IonButton>
              </div>
              <div className="service-card">
                <IonIcon icon={trophyOutline} size="large"/>
                <h3>Preparación Mental</h3>
                <p>Psicología deportiva</p>
                <IonButton fill="outline" size="small">Informarse</IonButton>
              </div>
            </div>
          </section>

          <section className="community-section">
            <h2 className="section-title">Comunidad Futbolera</h2>
            <div className="community-grid">
              <div className="community-card">
                <h3>Encuentra Equipo</h3>
                <p>Únete a un equipo o crea el tuyo</p>
                <IonButton fill="outline" size="small">Explorar equipos</IonButton>
              </div>
              <div className="community-card">
                <h3>Organiza Partidos</h3>
                <p>Coordina encuentros amistosos</p>
                <IonButton fill="outline" size="small">Crear partido</IonButton>
              </div>
              <div className="community-card">
                <h3>Foro de Discusión</h3>
                <p>Comparte experiencias y consejos</p>
                <IonButton fill="outline" size="small">Ir al foro</IonButton>
              </div>
            </div>
          </section>

          <section className="facilities-section">
            <h2 className="section-title">Nuestras Instalaciones</h2>
            <div className="facilities-grid">
              <div className="facility-card">
                <img src="/assets/campo1.jpg" alt="Campo de fútbol" />
                <h3>Campos de Fútbol</h3>
                <p>Canchas profesionales de césped natural y sintético</p>
              </div>
              <div className="facility-card">
                <img src="/assets/gimnasio.jpg" alt="Gimnasio" />
                <h3>Gimnasio</h3>
                <p>Área de entrenamiento físico completa</p>
              </div>
            </div>
          </section>

          <section className="partners-section">
            <h2 className="section-title">Nuestros Aliados</h2>
            <div className="partners-grid">
              <div className="partner-card">
                <img src="/assets/partner1.jpg" alt="Patrocinador" />
                <h3>Equipamiento Deportivo</h3>
                <p>Descuentos especiales para miembros</p>
              </div>
              <div className="partner-card">
                <img src="/assets/partner2.jpg" alt="Patrocinador" />
                <h3>Centro Médico Deportivo</h3>
                <p>Atención especializada</p>
              </div>
            </div>
          </section>
        </div>

        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default InicioPage;
