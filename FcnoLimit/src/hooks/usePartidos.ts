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
}

export function usePartidos() {
  const [jugados, setJugados] = useState<PartidoVista[]>([]);
  const [pendientes, setPendientes] = useState<PartidoVista[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartidos = async () => {
      setLoading(true);
      setError(null);
      try {
        const [resJugados, resPendientes] = await Promise.all([
          fetch(`${apiBaseUrl}/api/partidos/jugados`, { cache: 'no-store' }),
          fetch(`${apiBaseUrl}/api/partidos/pendientes`, { cache: 'no-store' }),
        ]);

        if (!resJugados.ok) {
          throw new Error(`Error al cargar partidos jugados: ${resJugados.statusText}`);
        }
        if (!resPendientes.ok) {
          throw new Error(`Error al cargar partidos pendientes: ${resPendientes.statusText}`);
        }

        const dataJugados = await resJugados.json();
        const dataPendientes = await resPendientes.json();

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
  }, []);

  return { jugados, pendientes, loading, error };
}
