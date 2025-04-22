import React, { useState, useEffect } from 'react';
import './Carousel.css';

interface CarouselItem {
  id: number;
  image: string;
  title: string;
  description: string;
}

const carouselData: CarouselItem[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80',
    title: 'Final Internacional',
    description: '¡Vive la emoción de la gran final en 4K!',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1920&q=80',
    title: 'Nuevos Equipos',
    description: 'Descubre los equipos que debutan esta temporada.',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1920&q=80',
    title: 'Estadísticas 4K',
    description: 'Consulta estadísticas y récords históricos en alta definición.',
  },
];

const Carousel: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === carouselData.length - 1 ? 0 : prev + 1));
    }, 10000); // 10 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="custom-carousel-container">
        <div className="carousel-slide">
          <img src={carouselData[current].image} alt={carouselData[current].title} className="carousel-img" />
          <div className="carousel-caption">
            <h2>{carouselData[current].title}</h2>
            <p>{carouselData[current].description}</p>
          </div>
        </div>
      </div>
      <div className="carousel-dots">
        {carouselData.map((_, idx) => (
          <button
            key={idx}
            className={`carousel-dot${current === idx ? ' active' : ''}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Ir al slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;