import React, { useState } from 'react';
import { IonPage, IonContent, IonIcon, IonSearchbar } from '@ionic/react';
import { calendar, person, time, chevronBack, chevronForward } from 'ionicons/icons';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import './NoticiasPage.css';

const NoticiasPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Aquí puedes agregar la lógica para cargar las noticias de la página seleccionada
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const showEllipsis = totalPages > 7;
    
    if (showEllipsis) {
      if (currentPage <= 4) {
        // Mostrar primeras páginas
        for (let i = 1; i <= 5; i++) {
          buttons.push(i);
        }
        buttons.push('ellipsis');
        buttons.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Mostrar últimas páginas
        buttons.push(1);
        buttons.push('ellipsis');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          buttons.push(i);
        }
      } else {
        // Mostrar páginas intermedias
        buttons.push(1);
        buttons.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          buttons.push(i);
        }
        buttons.push('ellipsis');
        buttons.push(totalPages);
      }
    } else {
      // Mostrar todas las páginas si son pocas
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    }
    
    return buttons;
  };

  return (
    <IonPage>
      <NavBar />
      <IonContent fullscreen>
        <div className="noticias-container">
          <div className="noticias-header">
            <h1>Noticias y Actualizaciones</h1>
            <IonSearchbar 
              placeholder="Buscar noticias..." 
              className="noticias-search"
            />
          </div>

          <div className="noticias-grid">
            {/* Noticia destacada */}
            <article className="noticia-destacada">
              <div className="noticia-image-container">
                <img src="/assets/news-destacada.jpg" alt="Noticia destacada" />
                <div className="noticia-badge">Destacado</div>
              </div>
              <div className="noticia-content">
                <div className="noticia-meta">
                  <span><IonIcon icon={calendar} /> 20 Abril, 2024</span>
                  <span><IonIcon icon={person} /> Admin</span>
                  <span><IonIcon icon={time} /> 5 min lectura</span>
                </div>
                <h2>Final del Torneo de Primavera 2024</h2>
                <p>
                  La emocionante final del torneo reunió a los mejores equipos en una 
                  jornada inolvidable llena de goles y jugadas espectaculares...
                </p>
                <button className="leer-mas-btn">Leer más</button>
              </div>
            </article>

            {/* Grid de noticias regulares */}
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <article key={index} className="noticia-card">
                <div className="noticia-image-container">
                  <img src={`/assets/news${index}.jpg`} alt={`Noticia ${index}`} />
                </div>
                <div className="noticia-content">
                  <div className="noticia-meta">
                    <span><IonIcon icon={calendar} /> 15 Abril, 2024</span>
                    <span><IonIcon icon={time} /> 3 min</span>
                  </div>
                  <h3>Título de la noticia {index}</h3>
                  <p>
                    Breve descripción de la noticia que proporciona un resumen del contenido...
                  </p>
                  <button className="leer-mas-btn">Leer más</button>
                </div>
              </article>
            ))}
          </div>

          <div className="pagination-container">
            <button 
              className="pagination-arrow"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <IonIcon icon={chevronBack} />
            </button>
            
            <div className="pagination">
              {renderPaginationButtons().map((item, index) => (
                item === 'ellipsis' ? (
                  <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
                ) : (
                  <button
                    key={item}
                    className={`pagination-btn ${currentPage === item ? 'active' : ''}`}
                    onClick={() => handlePageChange(item as number)}
                    disabled={currentPage === item}
                  >
                    {item}
                  </button>
                )
              ))}
            </div>

            <button 
              className="pagination-arrow"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <IonIcon icon={chevronForward} />
            </button>
          </div>
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default NoticiasPage;