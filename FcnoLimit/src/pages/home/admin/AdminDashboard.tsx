import React, { useState, useEffect } from "react";
import { IonPage, IonContent, IonButton, IonIcon, useIonRouter } from "@ionic/react";
import { calendarOutline, calendarNumberOutline, timeOutline, trophyOutline, peopleOutline } from "ionicons/icons";
import NavBar from "../../../components/NavBar";
import Footer from "../../../components/Footer";
import FormGenerico from "../../../components/FormGenerico";
import SearchBar from "../../../components/SearchBar";
import sections from "../../../config/sections";
import fieldsMap from "../../../config/fieldsMap";
import { useUserSearch } from "../../../hooks/useUserSearch";
import api from "../../../api/axios";
import { useHistory } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard: React.FC = () => {
  const [partidos, setPartidos] = useState<any[]>([]);
  const history = useHistory();
  const [selected, setSelected] = useState<string>("partidos");
  const [partidosPendientes, setPartidosPendientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useIonRouter();

  useEffect(() => {
    // Cargar partidos al montar el componente
    fetch("https://fcnolimit-back.onrender.com/api/partidos")
      .then(res => res.json())
      .then(data => setPartidos(Array.isArray(data) ? data : []))
      .catch(() => setPartidos([]));
  }, []);

  useEffect(() => {
    if (selected === "partidos") {
      setLoading(true);
      // Traer partidos pendientes y los nombres de los equipos
      fetch("https://fcnolimit-back.onrender.com/api/partidos/pendientes")
        .then(res => res.json())
        .then(async data => {
          const partidosOrdenados = Array.isArray(data)
            ? data.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
            : [];
          // Obtener IDs únicos de equipos
          const equipoIds = new Set();
          partidosOrdenados.forEach(p => {
            if (p.equipo_local_id) equipoIds.add(p.equipo_local_id);
            if (p.equipo_visitante_id) equipoIds.add(p.equipo_visitante_id);
          });
          // Traer nombres de equipos en un solo fetch si hay IDs
          // Solución: declara equiposMap como Record<string, string>
          let equiposMap: Record<string, string> = {};
          if (equipoIds.size > 0) {
            const idsArray = Array.from(equipoIds);
            const equiposRes = await fetch(`https://fcnolimit-back.onrender.com/api/equipos?ids=${idsArray.join(",")}`);
            const equiposData = await equiposRes.json();
            equiposMap = {};
            equiposData.forEach((eq: any) => {
              equiposMap[String(eq.id)] = eq.nombre;
            });
          }
          // Asignar nombres a los partidos (asegura que las claves sean string)
          const partidosConNombres = partidosOrdenados.map(p => ({
            ...p,
            equipo_local_nombre: equiposMap[String(p.equipo_local_id)] || p.equipo_local_nombre || p.equipo_local,
            equipo_visitante_nombre: equiposMap[String(p.equipo_visitante_id)] || p.equipo_visitante_nombre || p.equipo_visitante
          }));
          setPartidosPendientes(partidosConNombres);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [selected]);

  const [usuarioEditando, setUsuarioEditando] = useState<any | null>(null);

  // Función para obtener configuración del formulario según contexto
  function getFormConfig() {
    if (selected === "usuarios") {
      if (usuarioEditando) {
        // Para editar usuario
        return {
          fields: fieldsMap["usuarios"].map(field =>
            field.name === "contraseña" ? { ...field, required: false } : field
          ),
          initialValues: usuarioEditando,
          onSubmit: async (data: any) => {
            if (!data.contraseña) delete data.contraseña;
            try {
              await api.put(`/usuarios/${usuarioEditando.id}`, data);
              alert("Usuario actualizado correctamente");
              setUsuarioEditando(null);
            } catch (err: any) {
              alert(err.response?.data?.error || "Error al actualizar usuario");
            }
          },
          onCancel: () => setUsuarioEditando(null)
        };
      } else {
        // Para crear usuario (NO incluyas initialValues)
        return {
          fields: fieldsMap["usuarios"],
          onSubmit: async (data: any) => {
            try {
              await api.post("/usuarios/register", data);
              alert("Usuario creado correctamente");
            } catch (err: any) {
              alert(err.response?.data?.error || "Error al crear usuario");
            }
          }
        };
      }
    }
    return null;
  }

  const formConfig = getFormConfig();

  // Función para navegar a AdminPartidos con los datos del partido
  const handleSeleccionarPartido = (partido: any) => {
    history.push("/admin/AdminPartidos", {
      partido: {
        id: partido.id,
        equipoLocal: partido.equipo_local_nombre || partido.equipo_local || "",
        equipoVisitante: partido.equipo_visitante_nombre || partido.equipo_visitante || "",
        division: partido.nombre_division || "",
        divisionEquipo: partido.nombre_division_equipo || "",
        equipoLId: partido.equipo_local_id, // <-- nombre exacto del backend
        equipoVid: partido.equipo_visitante_id, // <-- nombre exacto del backend
        divisionId: partido.division_id, // <-- nombre exacto del backend
        // Puedes agregar más campos si lo necesitas
      }
    });
  };

  return (
    <IonPage>
      <NavBar />
      <IonContent fullscreen className="admin-dashboard-bg">
        <div className="admin-dashboard-flex elegant-admin">
          <aside className="admin-sidebar elegant-sidebar">
            <IonButton
              expand="block"
              color={selected === "partidos" ? "primary" : "light"}
              className={`sidebar-btn ${selected === "partidos" ? "active" : ""}`}
              onClick={() => setSelected("partidos")}
            >
              <span className="sidebar-btn-icon">
                <IonIcon icon={calendarOutline} />
              </span>
              Partidos
            </IonButton>
            <IonButton
              expand="block"
              color={selected === "crear-partido" ? "primary" : "light"}
              className={`sidebar-btn ${selected === "crear-partido" ? "active" : ""}`}
              onClick={() => history.push("/admin/crear-partido")}
              style={{ marginTop: 8 }}
            >
              <span className="sidebar-btn-icon">
                <IonIcon icon={calendarOutline} />
              </span>
              Crear Partido
            </IonButton>
          </aside>
          <main className="admin-main-content elegant-main">
            <div className="admin-section-title">
              <IonIcon icon={calendarNumberOutline} className="admin-section-icon" />
              <h2>Partidos pendientes por fecha</h2>
            </div>
            {loading && (
              <div className="admin-loading">Cargando...</div>
            )}
            {!loading && partidosPendientes.length === 0 && (
              <div className="admin-empty">No hay partidos pendientes.</div>
            )}
            {!loading && partidosPendientes.length > 0 && (
              <div className="admin-partidos-list">
                {partidosPendientes.map((partido) => {
                  const fecha = new Date(partido.fecha);
                  const diaSemana = fecha.toLocaleDateString("es-ES", { weekday: "long" });
                  const numeroDia = fecha.getDate();
                  const mes = fecha.toLocaleDateString("es-ES", { month: "long" });

                  let hora = fecha.getHours();
                  let minutos = fecha.getMinutes();
                  if (minutos >= 30) {
                    hora = (hora + 1) % 24;
                    minutos = 0;
                  } else {
                    minutos = 0;
                  }
                  const horaFormateada = `${hora.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")}`;

                  return (
                    <div
                      className="admin-partido-card"
                      key={partido.id}
                      tabIndex={0}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSeleccionarPartido(partido)}
                    >
                      <div className="admin-partido-header">
                        <span className="admin-partido-equipos">
                          <span className="admin-partido-local">{partido.equipo_local_nombre || partido.equipo_local}</span>
                          <span className="admin-partido-vs">vs</span>
                          <span className="admin-partido-visitante">{partido.equipo_visitante_nombre || partido.equipo_visitante}</span>
                        </span>
                        <span className="admin-partido-fecha">
                          <IonIcon icon={timeOutline} />
                          {`${diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)} ${numeroDia} de ${mes.charAt(0).toUpperCase() + mes.slice(1)} - ${horaFormateada}`}
                        </span>
                      </div>
                      <div className="admin-partido-info">
                        <span>
                          <IonIcon icon={trophyOutline} />
                          División: {partido.nombre_division || "Sin división"}
                        </span>
                        <span>
                          <IonIcon icon={peopleOutline} />
                          División equipo: {partido.nombre_division_equipo || "Sin división equipo"}
                        </span>
                      </div>
                      <div style={{marginTop: "0.7rem", fontSize: "0.97rem", color: "#888"}}>
                        <strong>Detalle del partido:</strong> División: {partido.nombre_division || "Sin división"} | División equipo: {partido.nombre_division_equipo || "Sin división equipo"}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default AdminDashboard;