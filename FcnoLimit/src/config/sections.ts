/**
 * sections.ts
 * 
 * Este archivo exporta un array con la configuración de las secciones (entidades) del sistema.
 * Sirve para construir menús, tabs o cualquier selector de entidad en la UI de forma centralizada.
 * 
 * Si agregas una nueva entidad, solo la agregas aquí y estará disponible en toda la app.
 */

const sections = [
  { key: "usuarios", label: "Usuarios" },
  { key: "campeonatos", label: "Campeonatos" },
  { key: "equipos", label: "Equipos" },
  { key: "jugadores", label: "Jugadores" },
  { key: "partidos", label: "Partidos" },
  { key: "estadisticasPartido", label: "Estadísticas Partido" },
  { key: "estadisticasJugador", label: "Estadísticas Jugador" },
  { key: "ligas", label: "Ligas" }
];

export default sections;