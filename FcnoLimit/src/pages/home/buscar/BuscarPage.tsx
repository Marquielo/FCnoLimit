import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { IonPage, IonContent } from "@ionic/react";
import NavBar from "../../../components/NavBar";
import Footer from "../../../components/Footer";
import SearchBar from "../../../components/SearchBar";
import "./BuscarPage.css";

const BuscarPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<"equipos" | "jugadores">("equipos");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();

  // URL base igual que en AuthPage
  const apiBaseUrl = 'https://fcnolimit-back.onrender.com';
  const API_BASE = apiBaseUrl.replace(/^=/, '');

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const token = localStorage.getItem("token");
      let url = "";
      let params = "";

      if (selectedType === "equipos") {
        params = search ? `?nombre=${encodeURIComponent(search)}` : "";
        url = `${API_BASE}/api/equipos/buscar${params}`;
      } else {
        params = search ? `?nombre=${encodeURIComponent(search)}` : "";
        url = `${API_BASE}/api/jugadores/buscar${params}`;
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setResults(Array.isArray(data) ? data : [data]);
      } else {
        setError(data?.error || "Error al buscar");
      }
    } catch {
      setError("Error de conexión con el servidor");
    }
    setLoading(false);
  };

  // Manejar click en resultado para navegar a la página de detalle
  const handleResultClick = (item: any) => {
    if (selectedType === "equipos") {
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
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value as "equipos" | "jugadores")}
                style={{
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  padding: "8px 12px",
                  fontSize: "1rem",
                  fontWeight: 500,
                  background: "#fff",
                  color: "#222"
                }}
              >
                <option value="equipos">Equipos</option>
                <option value="jugadores">Jugadores</option>
              </select>
              <SearchBar
                placeholder={`Buscar ${selectedType === "equipos" ? "equipo" : "jugador"}...`}
                value={search}
                onChange={setSearch}
                onSearch={handleSearch}
              />
            </div>
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
                    {selectedType === "equipos"
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
