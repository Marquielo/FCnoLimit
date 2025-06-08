import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonLabel,
  IonItem,
  IonToast
} from "@ionic/react";
import { useLocation } from "react-router-dom";
import {
  footballOutline,
  checkmarkCircleOutline,
  personCircleOutline,
  addCircleOutline,
  closeCircleOutline
} from "ionicons/icons";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import bannerBg from "../../assets/banner-fc-bg.png";
import "./AdminPartidos.css";

const apiBaseUrl = "https://fcnolimit-back.onrender.com";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const AdminPartidos: React.FC = () => {
  const query = useQuery();
  const partidoId = query.get("id");
  const [partido, setPartido] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [isJugado, setIsJugado] = useState(false);
  const [golesLocal, setGolesLocal] = useState<number>(0);
  const [golesVisitante, setGolesVisitante] = useState<number>(0);
  const [goleadoresLocal, setGoleadoresLocal] = useState<{ jugador: string; }[]>([]);
  const [goleadoresVisitante, setGoleadoresVisitante] = useState<{ jugador: string; }[]>([]);
  const [jugadoresLocal, setJugadoresLocal] = useState<any[]>([]);
  const [jugadoresVisitante, setJugadoresVisitante] = useState<any[]>([]);
  // Agrega estados de carga para los jugadores
  const [cargandoJugadoresLocal, setCargandoJugadoresLocal] = useState(false);
  const [cargandoJugadoresVisitante, setCargandoJugadoresVisitante] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    if (partidoId) {
      fetch(`${apiBaseUrl}/api/partidos/${partidoId}`)
        .then(res => res.json())
        .then(async data => {
          let equipo_local_nombre = data.equipo_local_nombre || "";
          let equipo_visitante_nombre = data.equipo_visitante_nombre || "";
          if ((!equipo_local_nombre || !equipo_visitante_nombre) && (data.equipo_local_id || data.equipo_visitante_id)) {
            const ids = [];
            if (data.equipo_local_id) ids.push(data.equipo_local_id);
            if (data.equipo_visitante_id) ids.push(data.equipo_visitante_id);
            if (ids.length > 0) {
              const equiposRes = await fetch(`${apiBaseUrl}/api/equipos?ids=${ids.join(",")}`);
              const equiposData = await equiposRes.json();
              const equiposMap: Record<string, string> = {};
              equiposData.forEach((eq: any) => {
                equiposMap[String(eq.id)] = eq.nombre;
              });
              equipo_local_nombre = equiposMap[String(data.equipo_local_id)] || data.equipo_local || "";
              equipo_visitante_nombre = equiposMap[String(data.equipo_visitante_id)] || data.equipo_visitante || "";
            }
          }
          setPartido({
            ...data,
            equipo_local_nombre,
            equipo_visitante_nombre
          });

          // Simplificado: obtener jugadores por equipo y división
          // Asegura que los parámetros sean números
          const equipoLocalId = Number(data.equipo_local_id);
          const equipoVisitanteId = Number(data.equipo_visitante_id);
          const idDivision = Number(data.id_division);

          if (equipoLocalId && idDivision) {
            fetch(`${apiBaseUrl}/api/equipo/${equipoLocalId}/division/${idDivision}`)
              .then(res => res.json())
              .then(jugs => {
                setJugadoresLocal(Array.isArray(jugs) ? jugs : []);
              });
          } else {
            setJugadoresLocal([]);
          }

          if (equipoVisitanteId && idDivision) {
            fetch(`${apiBaseUrl}/api/equipo/${equipoVisitanteId}/division/${idDivision}`)
              .then(res => res.json())
              .then(jugs => {
                setJugadoresVisitante(Array.isArray(jugs) ? jugs : []);
              });
          } else {
            setJugadoresVisitante([]);
          }

          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [partidoId]);

  // Nuevo useEffect para cargar jugadores al entrar en modo "jugado" o cambiar partido
  useEffect(() => {
    if (isJugado && partido) {
      // Asegura que los parámetros sean números
      const equipoLocalId = Number(partido.equipo_local_id);
      const equipoVisitanteId = Number(partido.equipo_visitante_id);
      const idDivision = Number(partido.id_division);

      if (equipoLocalId && idDivision) {
        setCargandoJugadoresLocal(true);
        fetch(`${apiBaseUrl}/api/equipo/${equipoLocalId}/division/${idDivision}`)
          .then(res => res.json())
          .then(jugs => {
            setJugadoresLocal(Array.isArray(jugs) ? jugs : []);
          })
          .finally(() => setCargandoJugadoresLocal(false));
      } else {
        setJugadoresLocal([]);
        setCargandoJugadoresLocal(false);
      }
      if (equipoVisitanteId && idDivision) {
        setCargandoJugadoresVisitante(true);
        fetch(`${apiBaseUrl}/api/equipo/${equipoVisitanteId}/division/${idDivision}`)
          .then(res => res.json())
          .then(jugs => {
            setJugadoresVisitante(Array.isArray(jugs) ? jugs : []);
          })
          .finally(() => setCargandoJugadoresVisitante(false));
      } else {
        setJugadoresVisitante([]);
        setCargandoJugadoresVisitante(false);
      }
    }
  }, [isJugado, partido]);

  const equipoLocal = partido?.equipo_local_nombre || partido?.equipo_local || "";
  const equipoVisitante = partido?.equipo_visitante_nombre || partido?.equipo_visitante || "";

  const handleGolesLocalChange = (value: number) => {
    setGolesLocal(value);
    setGoleadoresLocal(Array.from({ length: value }, (_, i) => goleadoresLocal[i] || { jugador: "" }));
  };
  const handleGolesVisitanteChange = (value: number) => {
    setGolesVisitante(value);
    setGoleadoresVisitante(Array.from({ length: value }, (_, i) => goleadoresVisitante[i] || { jugador: "" }));
  };

  const handleGoleadorLocalChange = (idx: number, jugadorId: string) => {
    setGoleadoresLocal(prev => prev.map((g, i) => i === idx ? { jugador: jugadorId } : g));
  };
  const handleGoleadorVisitanteChange = (idx: number, jugador: string) => {
    setGoleadoresVisitante(prev => prev.map((g, i) => i === idx ? { jugador } : g));
  };

  const handleGuardarResultado = () => {
    if (
      golesLocal < 0 ||
      golesVisitante < 0 ||
      goleadoresLocal.some(g => !g.jugador) ||
      goleadoresVisitante.some(g => !g.jugador)
    ) {
      setToastMsg("Completa todos los campos de goles y responsables.");
      setShowToast(true);
      return;
    }
    setToastMsg("Resultado guardado correctamente.");
    setShowToast(true);
    setIsJugado(false);
    // Aquí puedes hacer la petición a la API para guardar el resultado
  };

  return (
    <IonPage>
      <NavBar />
      <IonContent fullscreen className="admin-partidos-bg">
        <div
          className="admin-partidos-banner"
          style={{ backgroundImage: `url(${bannerBg})` }}
        >
          <div className="admin-partidos-banner-content">
            {loading && "Cargando..."}
            {!loading && partido && equipoLocal && equipoVisitante && (
              <span>
                <span className="admin-partidos-banner-team">{equipoLocal}</span>
                {" "}
                <span className="admin-partidos-banner-vs">vs</span>
                {" "}
                <span className="admin-partidos-banner-team">{equipoVisitante}</span>
              </span>
            )}
            {!loading && (!partido || !equipoLocal || !equipoVisitante) && "Partido no encontrado"}
          </div>
        </div>

        <div className="admin-partidos-container">
          <h1 className="admin-partidos-title">Detalle del Partido</h1>
          <div className="admin-partidos-id">
            <span className="admin-partidos-id-label">ID del partido:</span> {partidoId}
          </div>
          {/* Mostrar división y división equipo si existen */}
          {!loading && partido && (
            <div className="admin-partidos-divisiones">
              <span className="admin-partidos-division-label">
                División:
              </span>{" "}
              <span className="admin-partidos-division-value">
                {partido.nombre_division || "Sin división"}
              </span>
              <span className="admin-partidos-division-sep">|</span>
              <span className="admin-partidos-division-label">
                División equipo:
              </span>{" "}
              <span className="admin-partidos-division-value">
                {partido.nombre_division_equipo || "Sin división equipo"}
              </span>
            </div>
          )}
          {!isJugado && (
            <>
              <IonButton
                color="success"
                expand="block"
                className="admin-partidos-jugado-btn"
                onClick={() => setIsJugado(true)}
              >
                <IonIcon icon={checkmarkCircleOutline} slot="start" />
                Marcar como jugado
              </IonButton>
              <IonButton
                color="warning"
                expand="block"
                className="admin-partidos-reagendar-btn"
                style={{ marginTop: 12, fontWeight: 700, fontSize: "1.1rem", borderRadius: 12 }}
                onClick={() => {
                  // Aquí puedes abrir un modal o lógica para reagendar
                  setToastMsg("Funcionalidad de reagendar próximamente.");
                  setShowToast(true);
                }}
              >
                <IonIcon icon={addCircleOutline} slot="start" />
                Reagendar partido
              </IonButton>
            </>
          )}

          {isJugado && (
            <div className="admin-partidos-goles-section">
              <div className="admin-partidos-goles-equipos">
                {/* Equipo Local */}
                <div className="admin-partidos-goles-equipo">
                  <div className="admin-partidos-goles-equipo-title">
                    <IonIcon icon={footballOutline} className="admin-partidos-goles-icon" />
                    <span>{equipoLocal}</span>
                  </div>
                  <IonItem lines="none" className="admin-partidos-goles-item">
                    <IonLabel position="stacked">Goles</IonLabel>
                    <IonInput
                      type="number"
                      min={0}
                      value={golesLocal}
                      onIonChange={e => handleGolesLocalChange(Number(e.detail.value) || 0)}
                      className="admin-partidos-goles-input"
                      inputmode="numeric"
                    />
                  </IonItem>
                  {Array.from({ length: golesLocal }).map((_, idx) => (
                    <IonItem lines="none" key={idx} className="admin-partidos-goles-item">
                      <IonLabel position="stacked">
                        Responsable del gol #{idx + 1}
                      </IonLabel>
                      <IonSelect
                        value={goleadoresLocal[idx]?.jugador || ""}
                        placeholder={
                          cargandoJugadoresLocal
                            ? "Cargando jugadores..."
                            : jugadoresLocal.length === 0
                              ? "Sin jugadores"
                              : "Selecciona jugador"
                        }
                        disabled={cargandoJugadoresLocal || jugadoresLocal.length === 0}
                        onIonChange={e => handleGoleadorLocalChange(idx, e.detail.value)}
                        interface="action-sheet"
                        className="admin-partidos-goles-select"
                      >
                        <IonSelectOption value="">-- Selecciona --</IonSelectOption>
                        {jugadoresLocal.length > 0 &&
                          jugadoresLocal.map(j => (
                            <IonSelectOption key={j.id} value={j.id}>
                              <IonIcon icon={personCircleOutline} className="admin-partidos-goles-person-icon" />
                              {j.nombre_completo || j.nombre}
                            </IonSelectOption>
                          ))}
                      </IonSelect>
                    </IonItem>
                  ))}
                </div>
                {/* Equipo Visitante */}
                <div className="admin-partidos-goles-equipo">
                  <div className="admin-partidos-goles-equipo-title">
                    <IonIcon icon={footballOutline} className="admin-partidos-goles-icon" />
                    <span>{equipoVisitante}</span>
                  </div>
                  <IonItem lines="none" className="admin-partidos-goles-item">
                    <IonLabel position="stacked">Goles</IonLabel>
                    <IonInput
                      type="number"
                      min={0}
                      value={golesVisitante}
                      onIonChange={e => handleGolesVisitanteChange(Number(e.detail.value) || 0)}
                      className="admin-partidos-goles-input"
                      inputmode="numeric"
                    />
                  </IonItem>
                  {Array.from({ length: golesVisitante }).map((_, idx) => (
                    <IonItem lines="none" key={idx} className="admin-partidos-goles-item">
                      <IonLabel position="stacked">
                        Responsable del gol #{idx + 1}
                      </IonLabel>
                      <IonSelect
                        value={goleadoresVisitante[idx]?.jugador || ""}
                        placeholder={
                          cargandoJugadoresVisitante
                            ? "Cargando jugadores..."
                            : jugadoresVisitante.length === 0
                              ? "Sin jugadores"
                              : "Selecciona jugador"
                        }
                        disabled={cargandoJugadoresVisitante || jugadoresVisitante.length === 0}
                        onIonChange={e => handleGoleadorVisitanteChange(idx, e.detail.value)}
                        interface="action-sheet"
                        className="admin-partidos-goles-select"
                      >
                        <IonSelectOption value="">-- Selecciona --</IonSelectOption>
                        {jugadoresVisitante.length > 0 &&
                          jugadoresVisitante.map(j => (
                            <IonSelectOption key={j.id} value={j.id}>
                              <IonIcon icon={personCircleOutline} className="admin-partidos-goles-person-icon" />
                              {j.nombre_completo || j.nombre}
                            </IonSelectOption>
                          ))}
                      </IonSelect>
                    </IonItem>
                  ))}
                </div>
              </div>
              <div className="admin-partidos-goles-actions">
                <IonButton
                  color="medium"
                  className="admin-partidos-cancelar-btn"
                  onClick={() => setIsJugado(false)}
                >
                  <IonIcon icon={closeCircleOutline} slot="start" />
                  Cancelar
                </IonButton>
                <IonButton
                  color="primary"
                  className="admin-partidos-guardar-btn"
                  onClick={handleGuardarResultado}
                >
                  <IonIcon icon={addCircleOutline} slot="start" />
                  Guardar resultado
                </IonButton>
              </div>
            </div>
          )}
        </div>
        <Footer />
        <IonToast
          isOpen={showToast}
          message={toastMsg}
          duration={2200}
          color={toastMsg.includes("guardado") ? "success" : "danger"}
          onDidDismiss={() => setShowToast(false)}
          position="top"
          className="admin-partidos-toast"
        />
      </IonContent>
    </IonPage>
  );
};

export default AdminPartidos;

// Para probar el endpoint:
// 1. Abre la consola de tu navegador (F12 > Consola) o usa Node.js.
// 2. Copia y pega el siguiente código en la consola.
// 3. Cambia los valores de equipoId y idDivision por valores reales de tu base de datos.
// 4. Presiona Enter y revisa el resultado.

const equipoId = 1; // Cambia por un id real de equipo
const idDivision = 2; // Cambia por un id real de división

fetch(`https://fcnolimit-back.onrender.com/api/equipo/${equipoId}/division/${idDivision}`)
  .then(res => res.json())
  .then(data => console.log("Jugadores del equipo y división:", data))
  .catch(err => console.error("Error al probar endpoint:", err));

// Si ves un array de jugadores en la consola, el endpoint funciona correctamente.
