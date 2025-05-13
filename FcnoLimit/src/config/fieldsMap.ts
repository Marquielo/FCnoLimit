/**
 * fieldsMap.ts
 * 
 * Este archivo exporta un objeto que define los campos de formulario para cada entidad del sistema.
 * Permite que los formularios sean dinámicos y reutilizables, ya que cada sección (usuarios, equipos, etc.)
 * puede obtener su configuración de campos desde aquí.
 * 
 * Así, si necesitas agregar, quitar o modificar campos de una entidad, solo editas este archivo.
 */

const fieldsMap: Record<string, any[]> = {
  usuarios: [
    { name: "nombre_completo", label: "Nombre completo", required: true },
    { name: "correo", label: "Correo", type: "email", required: true },
    { name: "contraseña", label: "Contraseña", type: "password", required: true },
    {
      name: "rol",
      label: "Rol",
      options: [
        { value: "jugador", label: "Jugador" },
        { value: "entrenador", label: "Entrenador" },
        { value: "administrador", label: "Administrador" },
        { value: "persona_natural", label: "Persona Natural" }
      ],
      required: true
    }
  ],
  campeonatos: [
    { name: "nombre", label: "Nombre", required: true },
    { name: "descripcion", label: "Descripción", required: true },
    { name: "fecha_inicio", label: "Fecha de inicio", type: "date", required: true },
    { name: "fecha_fin", label: "Fecha de fin", type: "date", required: true }
  ],
  equipos: [
    { name: "nombre", label: "Nombre", required: true },
    { name: "categoria", label: "Categoría", required: true },
    { name: "liga_id", label: "ID Liga", required: true },
    { name: "imagen_url", label: "Imagen URL" }
  ],
  jugadores: [
    { name: "usuario_id", label: "ID Usuario", required: true },
    { name: "equipo_id", label: "ID Equipo", required: true },
    { name: "posicion", label: "Posición", required: true },
    { name: "dorsal", label: "Dorsal", required: true },
    { name: "imagen_url", label: "Imagen URL" }
  ],
  partidos: [
    { name: "equipo_local_id", label: "ID Equipo Local", required: true },
    { name: "equipo_visitante_id", label: "ID Equipo Visitante", required: true },
    { name: "goles_local", label: "Goles Local", type: "number", required: true },
    { name: "goles_visitante", label: "Goles Visitante", type: "number", required: true },
    { name: "fecha", label: "Fecha", type: "date", required: true },
    { name: "estadio", label: "Estadio", required: true },
    { name: "liga_id", label: "ID Liga", required: true },
    { name: "administrador_id", label: "ID Administrador", required: true },
    {
      name: "estado",
      label: "Estado",
      options: [
        { value: "pendiente", label: "Pendiente" },
        { value: "jugado", label: "Jugado" },
        { value: "cancelado", label: "Cancelado" }
      ],
      required: true
    },
    { name: "jugado_en", label: "Jugado en", type: "date" }
  ],
  estadisticasPartido: [
    { name: "partido_id", label: "ID Partido", required: true },
    { name: "equipo_id", label: "ID Equipo", required: true },
    { name: "posesion", label: "Posesión (%)", type: "number" },
    { name: "tiros_totales", label: "Tiros Totales", type: "number" },
    { name: "tiros_a_puerta", label: "Tiros a Puerta", type: "number" },
    { name: "faltas", label: "Faltas", type: "number" },
    { name: "tarjetas_amarillas", label: "Tarjetas Amarillas", type: "number" },
    { name: "tarjetas_rojas", label: "Tarjetas Rojas", type: "number" },
    { name: "saques_de_esquina", label: "Saques de Esquina", type: "number" },
    { name: "fueras_de_juego", label: "Fueras de Juego", type: "number" },
    { name: "pases_completados", label: "Pases Completados", type: "number" },
    { name: "atajadas", label: "Atajadas", type: "number" },
    { name: "cambios_realizados", label: "Cambios Realizados", type: "number" }
  ],
  estadisticasJugador: [
    { name: "partido_id", label: "ID Partido", required: true },
    { name: "jugador_id", label: "ID Jugador", required: true },
    { name: "goles", label: "Goles", type: "number" },
    { name: "asistencias", label: "Asistencias", type: "number" },
    { name: "tarjetas_amarillas", label: "Tarjetas Amarillas", type: "number" },
    { name: "tarjetas_rojas", label: "Tarjetas Rojas", type: "number" },
    { name: "faltas_cometidas", label: "Faltas Cometidas", type: "number" },
    { name: "pases_completados", label: "Pases Completados", type: "number" },
    { name: "minutos_jugados", label: "Minutos Jugados", type: "number" }
  ],
  ligas: [
    { name: "nombre", label: "Nombre", required: true },
    { name: "descripcion", label: "Descripción", required: true },
    { name: "temporada", label: "Temporada", required: true },
    { name: "campeonato_id", label: "ID Campeonato", required: true }
  ]
};

export default fieldsMap;