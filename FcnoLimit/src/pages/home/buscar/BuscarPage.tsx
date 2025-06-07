import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { IonPage, IonContent } from "@ionic/react";
import NavBar from "../../../components/NavBar";
import Footer from "../../../components/Footer";
import SearchBar from "../../../components/SearchBar";
import "./BuscarPage.css";

const apiBaseUrl = 'https://fcnolimit-back.onrender.com';
const defaultTeamLogo = '/assets/equipos/default.png';
const defaultPlayerAvatar = '/assets/img/avatar-default.png';

const equipoKeywords = ['FC', 'CLUB', 'DEPORTIVO', 'CF', 'AC', 'SC', 'CD', 'ATLÉTICO', 'ATHLETIC', 'REAL', 'UNIÓN', 'SPORTING'];

function detectSearchType(text: string): "equipo" | "jugador" {
  const upper = text.trim().toUpperCase();
  // Si contiene palabras clave de equipo o es todo mayúsculas, es equipo
  if (
    equipoKeywords.some(k => upper.includes(k)) ||
    upper === upper.toUpperCase()
  ) {
    return "equipo";
  }
  // Si contiene espacios y parece nombre de persona, es jugador
  if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(text) && text.trim().split(' ').length >= 2) {
    return "jugador";
  }
  // Por defecto, equipo
  return "equipo";
}

// Función para normalizar texto (quita tildes y pasa a minúsculas)
function normalizeText(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

const BuscarPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchType, setSearchType] = useState<"equipo" | "jugador">("equipo");
  const history = useHistory();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      // Buscar en ambos endpoints y combinar resultados
      const params = `?nombre=${encodeURIComponent(search.trim())}`;
      const equipoUrl = `${apiBaseUrl}/api/equipos/buscar${params}`;
      const jugadorUrl = `${apiBaseUrl}/api/jugadores/buscar${params}`;

      try {
        const [equiposRes, jugadoresRes] = await Promise.all([
          fetch(equipoUrl, { cache: 'no-store' }),
          fetch(jugadorUrl, { cache: 'no-store' })
        ]);

        let equipos: any[] = [];
        let jugadores: any[] = [];

        try {
          equipos = equiposRes.ok ? await equiposRes.json() : [];
        } catch {
          equipos = [];
        }
        try {
          jugadores = jugadoresRes.ok ? await jugadoresRes.json() : [];
        } catch {
          jugadores = [];
        }

        // Normaliza el texto de búsqueda
        const normalizedSearch = normalizeText(search.trim());

        // Filtra resultados de equipos y jugadores ignorando mayúsculas, minúsculas y tildes
        const equiposWithType = Array.isArray(equipos)
          ? equipos
              .filter((item: any) => {
                // Normaliza el nombre del equipo y lo compara con la búsqueda normalizada
                const nombreEquipo = item.nombre ? normalizeText(item.nombre) : "";
                return nombreEquipo.includes(normalizedSearch);
              })
              .map((item: any) => ({ ...item, _type: "equipo" }))
          : [];
        const jugadoresWithType = Array.isArray(jugadores)
          ? jugadores
              .filter((item: any) => {
                // Normaliza y une todos los campos posibles del jugador
                const campos = [
                  item.nombre_completo,
                  item.nombre,
                  item.apellido,
                  item.nombre + " " + item.apellido,
                  item.apellido + " " + item.nombre
                ].filter(Boolean);
                const normalizados = campos.map((str: string) => normalizeText(str));
                // Coincidencia si alguna variante contiene el texto buscado (ambos normalizados)
                return normalizados.some(nombre =>
                  nombre.includes(normalizedSearch)
                );
              })
              .map((item: any) => ({ ...item, _type: "jugador" }))
          : [];

        const combined = [...equiposWithType, ...jugadoresWithType];

        if (combined.length > 0) {
          setResults(combined);
          setError(null);
        } else {
          setResults([]);
          setError("Sin resultados.");
        }
      } catch {
        setResults([]);
        setError("Error de conexión con el servidor");
      }
      setLoading(false);
    }, 350);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line
  }, [search]);

  const handleResultClick = (item: any) => {
    if (item._type === "equipo") {
      history.push(`/equipos/${item.id}`);
    } else {
      history.push(`/jugadores/${item.id || item.usuario_id}`);
    }
  };

  return (
    <IonPage>
      <NavBar />
      <IonContent fullscreen className="buscar-content">
        <div className="buscar-minimal-container">
          <div className="buscar-title">Buscar equipos y jugadores</div>
          <div className="buscar-subtitle">Encuentra tu club o jugador favorito en segundos.</div>
          <div className="buscar-bar">
            {/* Solo la barra de búsqueda, sin selector */}
            <SearchBar
              placeholder="Buscar equipo o jugador..."
              value={search}
              onChange={setSearch}
              onSearch={() => {}}
            />
          </div>
          <div className="buscar-results-list">
            {loading && (
              <div className="buscar-loading">Buscando...</div>
            )}
            {error && (
              <div className="buscar-error">{error}</div>
            )}
            {results && results.length > 0 && (
              <>
                {results.map((item: any, idx: number) => (
                  <div
                    key={item.id || item.usuario_id || idx}
                    className="buscar-result-card"
                    onClick={() => handleResultClick(item)}
                    tabIndex={0}
                  >
                    <div className="buscar-result-img">
                      {item._type === "equipo" ? (
                        <img
                          src={
                            item.imagen_url
                              ? `${apiBaseUrl}${item.imagen_url.startsWith('/') ? item.imagen_url : '/' + item.imagen_url}`
                              : defaultTeamLogo
                          }
                          alt={item.nombre}
                        />
                      ) : (
                        <img
                          src={
                            item.foto
                              ? item.foto
                              : item.imagen_url
                                ? item.imagen_url
                                : defaultPlayerAvatar
                          }
                          alt={item.nombre || item.nombre_completo || ""}
                        />
                      )}
                    </div>
                    <div className="buscar-result-info">
                      <span className="buscar-result-nombre">
                        {item._type === "equipo"
                          ? item.nombre
                          : (item.nombre && item.apellido
                              ? `${item.nombre} ${item.apellido}`
                              : item.nombre || item.nombre_completo || "")
                        }
                      </span>
                      <span className="buscar-result-etiqueta">
                        {item._type === "equipo" ? "Equipo" : "Jugador"}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default BuscarPage;