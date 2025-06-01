import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { IonPage, IonContent } from "@ionic/react";
import NavBar from "../../../components/NavBar";
import Footer from "../../../components/Footer";
import SearchBar from "../../../components/SearchBar";
import "./BuscarPage.css";

const BuscarPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchType, setSearchType] = useState<"equipo" | "jugador" | null>(null);
  const history = useHistory();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // URL base igual que en AuthPage
  const apiBaseUrl = 'https://fcnolimit-back.onrender.com';
  const API_BASE = apiBaseUrl.replace(/^=/, '');

  // Detecta si el nombre parece de equipo o jugador
  const detectType = (text: string): "equipo" | "jugador" => {
    // Si contiene espacio, probablemente es jugador (nombre y apellido)
    if (text.trim().split(" ").length > 1) return "jugador";
    // Si termina en FC, Club, C.F., S.C., etc, probablemente es equipo
    if (/\b(fc|club|c\.f\.|s\.c\.|cd|cf|sc|deportivo|unión|union|atlético|atletico|sporting|ac|as|asociación|asociacion|academia|escuela|deportes|deportivo|deportes)\b/i.test(text)) return "equipo";
    // Si es muy corto, asume equipo
    if (text.length <= 3) return "equipo";
    // Por defecto, busca ambos pero prioriza jugador
    return "jugador";
  };

  // Búsqueda automática con debounce
  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      setError(null);
      setSearchType(null);
      return;
    }
    setLoading(true);
    setError(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      const type = detectType(search.trim());
      setSearchType(type);

      let url = "";
      let params = `?nombre=${encodeURIComponent(search.trim())}`;
      let token = localStorage.getItem("token");

      // Primero busca en el tipo detectado
      url = `${API_BASE}/api/${type === "equipo" ? "equipos" : "jugadores"}/buscar${params}`;
      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data) && data.length > 0) {
          setResults(data.map((item: any) => ({ ...item, _type: type })));
        } else {
          // Si no hay resultados y solo probaste un tipo, prueba el otro
          const altType = type === "equipo" ? "jugadores" : "equipos";
          const altUrl = `${API_BASE}/api/${altType}/buscar${params}`;
          const altRes = await fetch(altUrl, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const altData = await altRes.json();
          if (altRes.ok && Array.isArray(altData) && altData.length > 0) {
            setResults(altData.map((item: any) => ({ ...item, _type: altType === "equipos" ? "equipo" : "jugador" })));
            setSearchType(altType === "equipos" ? "equipo" : "jugador");
          } else {
            setResults([]);
            setError("Sin resultados.");
          }
        }
      } catch {
        setError("Error de conexión con el servidor");
        setResults([]);
      }
      setLoading(false);
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  // Manejar click en resultado para navegar a la página de detalle
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
        <div className="buscar-full-container">
          <div className="buscar-header">
            <h2>Búsqueda</h2>
          </div>
          <div className="buscar-bar-container">
            <SearchBar
              placeholder="Buscar equipo o jugador..."
              value={search}
              onChange={setSearch}
              onSearch={() => {}} // No hace falta, búsqueda automática
            />
          </div>
          <div className="buscar-subtitle">Busca equipos y competiciones.</div>
          <hr className="buscar-divider" />
          <div style={{ width: "100%", maxWidth: 700, marginLeft: 32, marginTop: 24 }}>
            {loading && <div style={{ color: "#888", marginBottom: 12 }}>Buscando...</div>}
            {error && <div style={{ color: "#c00", marginBottom: 12 }}>{error}</div>}
            {results && results.length > 0 ? (
              <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
                {results.map((item: any, idx: number) => (
                  <li
                    key={item.id || item.usuario_id || idx}
                    style={{
                      background: "#fff",
                      borderRadius: 8,
                      marginBottom: 12,
                      padding: "1rem 1.5rem",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                      fontWeight: 500,
                      color: "#222",
                      cursor: "pointer"
                    }}
                    onClick={() => handleResultClick(item)}
                  >
                    {item._type === "equipo"
                      ? <>{item.nombre} <span style={{ color: "#888", fontWeight: 400 }}>({item.categoria})</span></>
                      : <>{item.nombre} {item.apellido ? item.apellido : ""} <span style={{ color: "#888", fontWeight: 400 }}>{item.posicion ? `(${item.posicion})` : ""}</span></>
                    }
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <Footer />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default BuscarPage;
