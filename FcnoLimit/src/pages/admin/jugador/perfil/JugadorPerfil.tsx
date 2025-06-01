import React, { useState, useEffect } from 'react';
import './JugadorPerfil.css';

interface JugadorDetalle {
  id: number;
  nombre_corto: string;
  apellido_principal: string;
  fecha_nacimiento: string;
  posicion: string;
  estatura: number;
  estado: 'activo' | 'inactivo' | 'lesionado' | 'suspendido';
  imagen_cabecera_url?: string;
  equipo_actual?: string;
  numero_camiseta?: number;
  estadisticas: {
    partidos_jugados: number;
    goles: number;
    asistencias: number;
    tarjetas_amarillas: number;
    tarjetas_rojas: number;
  }
}

const calcularEdad = (fechaNacimiento: string): number => {
  if (!fechaNacimiento) return 0;
  const hoy = new Date();
  const cumpleanos = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - cumpleanos.getFullYear();
  const m = hoy.getMonth() - cumpleanos.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
    edad--;
  }
  return edad;
};

const JugadorPerfil: React.FC = () => {
  const [perfil, setPerfil] = useState<JugadorDetalle | null>(null);

  useEffect(() => {
    // Simulación de datos
    const nombreCompleto = "Jefferson Alexis Castillo Marín";
    const partesNombre = nombreCompleto.split(' ');
    const nombreCorto = partesNombre.slice(0, 2).join(' ') + " c.l.";
    const apellidoPrincipal = partesNombre.slice(2).join(' ');

    setPerfil({
      id: 1,
      nombre_corto: nombreCorto,
      apellido_principal: apellidoPrincipal,
      fecha_nacimiento: '1990-01-01',
      posicion: 'mediocampo',
      estatura: 183,
      estado: 'activo',
      imagen_cabecera_url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vdGJhbGx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=700&q=60',
      equipo_actual: 'Guillermo Rivera',
      numero_camiseta: 25,
      estadisticas: {
        partidos_jugados: 0,
        goles: 1  ,
        asistencias: 1,
        tarjetas_amarillas: 2,
        tarjetas_rojas: 1
      }
    });
  }, []);

  if (!perfil) return null;

  return (
    <div className="perfil-bg">
      <div className="perfil-card">
        <div className="perfil-img-container">
          <img
            src={perfil.imagen_cabecera_url}
            alt="Cabecera"
            className="perfil-img"
          />
          {perfil.estado === 'activo' && (
            <div className="perfil-fichado">FICHADO</div>
          )}
        </div>
        <div className="perfil-header">
          <span className="perfil-numero">{perfil.numero_camiseta}</span>
          <div>
            <span className="perfil-nombre-corto">{perfil.nombre_corto}</span>
            <span className="perfil-apellido">{perfil.apellido_principal}</span>
          </div>
        </div>
        <div className="perfil-info-grid">
          <div>
            <span className="perfil-info-label">EQUIPO</span>
            <span className="perfil-info-value">{perfil.equipo_actual}</span>
          </div>
          <div>
            <span className="perfil-info-label">EDAD</span>
            <span className="perfil-info-value">{calcularEdad(perfil.fecha_nacimiento)} años</span>
          </div>
          <div>
            <span className="perfil-info-label">POSICIÓN</span>
            <span className="perfil-info-value">{perfil.posicion}</span>
          </div>
          <div>
            <span className="perfil-info-label">ALTURA</span>
            <span className="perfil-info-value">{perfil.estatura} cm</span>
          </div>
        </div>
        <div className="perfil-stats-rapidas">
          <div>
            <span className="stat-valor">{perfil.estadisticas.partidos_jugados}</span>
            <span className="stat-label">PARTIDOS</span>
          </div>
          <div>
            <span className="stat-valor">{perfil.estadisticas.goles}</span>
            <span className="stat-label">GOLES</span>
          </div>
          <div>
            <span className="stat-valor">{perfil.estadisticas.asistencias}</span>
            <span className="stat-label">ASISTENCIAS</span>
          </div>
        </div>
        <div className="perfil-estadisticas">
          <div className="perfil-estadisticas-titulo">ESTADÍSTICAS</div>
          <div className="perfil-estadisticas-lista">
            <div className="perfil-estadistica-item">
              <span>Tarjetas amarillas</span>
              <span className="stat-indicador amarillo">{perfil.estadisticas.tarjetas_amarillas}</span>
            </div>
            <div className="perfil-estadistica-item">
              <span>Tarjetas rojas</span>
              <span className="stat-indicador rojo">{perfil.estadisticas.tarjetas_rojas}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JugadorPerfil;