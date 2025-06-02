import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { IonPage, IonContent } from "@ionic/react";
import NavBar from "../../../components/NavBar";
import Footer from "../../../components/Footer";
import SearchBar from "../../../components/SearchBar";
import "./BuscarPage.css";

const apiBaseUrl = 'https://fcnolimit-back.onrender.com';

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
      let url = "";
      let params = "";
      if (searchType === "equipo") {
        params = `?nombre=${encodeURIComponent(search.trim())}`;
        url = `${apiBaseUrl}/api/equipos/buscar${params}`;
      } else {
        params = `?nombre=${encodeURIComponent(search.trim())}`;
        url = `${apiBaseUrl}/api/jugadores/buscar${params}`;
      }
      try {
        let res = await fetch(url, { cache: 'no-store' });
        let data: any[] = [];
        try {
          data = await res.json();
        } catch {
          data = [];
        }
        if (res.ok && Array.isArray(data) && data.length > 0) {
          setResults(
            data.map((item: any) => ({
              ...item,
              _type: searchType
            }))
          );
        } else {
          setResults([]);
          setError("Sin resultados.");
        }
      } catch {
        setError("Error de conexión con el servidor");
        setResults([]);
      }
      setLoading(false);
    }, 350);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line
  }, [search, searchType]);

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
            {/* Selector de tipo de búsqueda */}
            <select
              value={searchType}
              onChange={e => setSearchType(e.target.value as "equipo" | "jugador")}
              className="buscar-type-selector"
              style={{ marginRight: 8, padding: 4 }}
            >
              <option value="equipo">Equipo</option>
              <option value="jugador">Jugador</option>
            </select>
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
                          src={item.escudo || item.imagen_url || "/assets/img/escudo-default.png"}
                          alt={item.nombre}
                        />
                      ) : (
                        <img
                          src={item.foto || item.imagen_url || "/assets/img/avatar-default.png"}
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