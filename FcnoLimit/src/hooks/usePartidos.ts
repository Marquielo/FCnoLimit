import { useState, useEffect } from 'react';

const apiBaseUrl = 'https://fcnolimit-back.onrender.com';

export interface PartidoVista {
  partido_id?: number;
  id?: number;
  equipo_local: string;
  equipo_visitante: string;
  goles_local?: number | null;
  goles_visitante?: number | null;
  fecha: string;
  estadio?: string;
  estado?: string;
  descripcion?: string;
  logo_local?: string | null;
  logo_visitante?: string | null;
  division_id?: number;
  division_equipo_id?: number;
}

export function usePartidos(division_id?: number, division_equipo_id?: number) {
  const [jugados, setJugados] = useState<PartidoVista[]>([]);
  const [pendientes, setPendientes] = useState<PartidoVista[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartidos = async () => {
      setLoading(true);
      setError(null);
      try {
        // Pendientes filtrados por división y división equipo
        let urlPendientes = `${apiBaseUrl}/api/partidos/pendientes`;
        if (division_id && division_equipo_id) {
          urlPendientes = `${apiBaseUrl}/api/partidos/pendientes/division/${division_equipo_id}/${division_id}`;
        }
        // Jugados: si tienes endpoint filtrado, úsalo. Si no, filtra en frontend
        const [resJugados, resPendientes] = await Promise.all([
          fetch(`${apiBaseUrl}/api/partidos/jugados`, { cache: 'no-store' }),
          fetch(urlPendientes, { cache: 'no-store' }),
        ]);

        if (!resJugados.ok) {
          throw new Error(`Error al cargar partidos jugados: ${resJugados.statusText}`);
        }
        if (!resPendientes.ok) {
          throw new Error(`Error al cargar partidos pendientes: ${resPendientes.statusText}`);
        }

        let dataJugados = await resJugados.json();
        const dataPendientes = await resPendientes.json();

        // Filtrar jugados en frontend si no hay endpoint específico
        if (division_id && division_equipo_id) {
          dataJugados = Array.isArray(dataJugados)
            ? dataJugados.filter((p: any) =>
                String(p.division_id) === String(division_id) &&
                String(p.division_equipo_id) === String(division_equipo_id)
              )
            : [];
        }

        setJugados(Array.isArray(dataJugados) ? dataJugados : []);
        setPendientes(Array.isArray(dataPendientes) ? dataPendientes : []);
      } catch (err: any) {
        setError(err.message || 'No se pudieron cargar los partidos');
        setJugados([]);
        setPendientes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPartidos();
  }, [division_id, division_equipo_id]);

  return { jugados, pendientes, loading, error };
}
