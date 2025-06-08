import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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

const AdminPartidos: React.FC = () => {
  const location = useLocation<any>();
  // Recibe los datos del partido si vienen por location.state
  const partido = (location.state && (location.state as any).partido) || null;

  // Guardar id del equipo local y visitante y de la división en variables locales
  const equipoLocalId = partido?.equipoId || partido?.equipoLId || partido?.equipo_local_id || null;
  const equipoVisitanteId = partido?.equipoVisitanteId || partido?.equipoVid || partido?.equipo_visitante_id || null;
  const divisionId = partido?.divisionId || partido?.division_id || partido?.division_equipo_id || null;

  const [isJugado, setIsJugado] = useState(false);

  // Estados para jugadores de cada equipo
  const [jugadoresLocal, setJugadoresLocal] = useState<any[]>([]);
  const [jugadoresVisitante, setJugadoresVisitante] = useState<any[]>([]);

  // Estados para goles y responsables
  const [golesLocal, setGolesLocal] = useState(0);
  const [golesVisitante, setGolesVisitante] = useState(0);
  const [responsablesLocal, setResponsablesLocal] = useState<string[]>([]);
  const [responsablesVisitante, setResponsablesVisitante] = useState<string[]>([]);

  // Cargar jugadores del equipo local
  useEffect(() => {
    console.log("equipoLocalId:", equipoLocalId, "divisionId:", divisionId);
    const fetchJugadoresLocal = async () => {
      if (equipoLocalId && divisionId) {
        try {
          const res = await fetch(`https://fcnolimit-back.onrender.com/api/jugadores/equipo/${equipoLocalId}/division/${divisionId}`);
          const data = await res.json();
          setJugadoresLocal(Array.isArray(data) ? data : []);
        } catch {
          setJugadoresLocal([]);
        }
      }
    };
    fetchJugadoresLocal();
  }, [equipoLocalId, divisionId]);

  // Cargar jugadores del equipo visitante
  useEffect(() => {
    console.log("equipoVisitanteId:", equipoVisitanteId, "divisionId:", divisionId);
    if (equipoVisitanteId && divisionId) {
      const fetchJugadoresVisitante = async () => {
        try {
          const res = await fetch(`https://fcnolimit-back.onrender.com/api/jugadores/equipo/${equipoVisitanteId}/division/${divisionId}`);
          const data = await res.json();
          setJugadoresVisitante(Array.isArray(data) ? data : []);
        } catch {
          setJugadoresVisitante([]);
        }
      };
      fetchJugadoresVisitante();
    }
  }, [equipoVisitanteId, divisionId]);

  // Actualizar arrays de responsables cuando cambia la cantidad de goles
  useEffect(() => {
    setResponsablesLocal(prev =>
      Array.from({ length: golesLocal }, (_, i) => prev[i] || "")
    );
  }, [golesLocal]);

  useEffect(() => {
    setResponsablesVisitante(prev =>
      Array.from({ length: golesVisitante }, (_, i) => prev[i] || "")
    );
  }, [golesVisitante]);

  // Cambiar el endpoint y agregar el token de autenticación
  const handleGuardarResultado = async () => {
    if (!partido?.id) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`https://fcnolimit-back.onrender.com/api/partidos/${partido.id}/resultado`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          estado: "jugado",
          goles_local: golesLocal,
          goles_visitante: golesVisitante
        })
      });
      if (res.ok) {
        setIsJugado(false);
        // Aquí puedes mostrar un toast de éxito si lo deseas
      } else {
        // Aquí puedes mostrar un toast de error si lo deseas
      }
    } catch (err) {
      // Aquí puedes mostrar un toast de error si lo deseas
    }
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
            <span>
              <span className="admin-partidos-banner-team">
                {partido?.equipoLocal || "Equipo Local"}
              </span>
              {" "}
              <span className="admin-partidos-banner-vs">vs</span>
              {" "}
              <span className="admin-partidos-banner-team">
                {partido?.equipoVisitante || "Equipo Visitante"}
              </span>
            </span>
          </div>
        </div>
        <div className="admin-partidos-container">
          <h1 className="admin-partidos-title">Detalle del Partido</h1>
          <div className="admin-partidos-id">
            <span className="admin-partidos-id-label">ID del partido:</span> {partido?.id || 123}
          </div>
          {/* Mostrar los IDs para depuración */}
          <div style={{margin: "10px 0", padding: "10px", background: "#f8f9fa", borderRadius: "8px", color: "#333"}}>
            <strong>ID equipo local:</strong> {String(equipoLocalId) || "N/A"}<br />
            <strong>ID equipo visitante:</strong> {String(equipoVisitanteId) || "N/A"}<br />
            <strong>ID división:</strong> {String(divisionId) || "N/A"}
          </div>
          <div className="admin-partidos-divisiones">
            <span className="admin-partidos-division-label">
              División:
            </span>{" "}
            <span className="admin-partidos-division-value">
              {partido?.division || "División 1"}
            </span>
            <span className="admin-partidos-division-sep">|</span>
            <span className="admin-partidos-division-label">
              División equipo:
            </span>{" "}
            <span className="admin-partidos-division-value">
              {partido?.divisionEquipo || "División equipo 1"}
            </span>
          </div>
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
                    <span>Equipo Local</span>
                  </div>
                  <IonItem lines="none" className="admin-partidos-goles-item">
                    <IonLabel position="stacked">Goles</IonLabel>
                    <IonInput
                      type="number"
                      min={0}
                      value={golesLocal}
                      onIonChange={e => setGolesLocal(Number(e.detail.value) || 0)}
                      className="admin-partidos-goles-input"
                      inputMode="numeric"
                    />
                  </IonItem>
                  {/* Un selector por cada gol */}
                  {Array.from({ length: golesLocal }).map((_, idx) => (
                    <IonItem lines="none" className="admin-partidos-goles-item" key={idx}>
                      <IonLabel position="stacked">
                        Responsable del gol #{idx + 1}
                      </IonLabel>
                      <IonSelect
                        placeholder="Selecciona jugador"
                        interface="action-sheet"
                        className="admin-partidos-goles-select"
                        value={responsablesLocal[idx] || ""}
                        onIonChange={e => {
                          const arr = [...responsablesLocal];
                          arr[idx] = e.detail.value;
                          setResponsablesLocal(arr);
                        }}
                      >
                        <IonSelectOption value="">-- Selecciona --</IonSelectOption>
                        {jugadoresLocal.map(j => (
                          <IonSelectOption key={j.jugador_id} value={j.jugador_id}>
                            {j.nombre_completo || j.nombre || `Jugador ${j.jugador_id}`}
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
                    <span>Equipo Visitante</span>
                  </div>
                  <IonItem lines="none" className="admin-partidos-goles-item">
                    <IonLabel position="stacked">Goles</IonLabel>
                    <IonInput
                      type="number"
                      min={0}
                      value={golesVisitante}
                      onIonChange={e => setGolesVisitante(Number(e.detail.value) || 0)}
                      className="admin-partidos-goles-input"
                      inputMode="numeric"
                    />
                  </IonItem>
                  {/* Un selector por cada gol */}
                  {Array.from({ length: golesVisitante }).map((_, idx) => (
                    <IonItem lines="none" className="admin-partidos-goles-item" key={idx}>
                      <IonLabel position="stacked">
                        Responsable del gol #{idx + 1}
                      </IonLabel>
                      <IonSelect
                        placeholder="Selecciona jugador"
                        interface="action-sheet"
                        className="admin-partidos-goles-select"
                        value={responsablesVisitante[idx] || ""}
                        onIonChange={e => {
                          const arr = [...responsablesVisitante];
                          arr[idx] = e.detail.value;
                          setResponsablesVisitante(arr);
                        }}
                      >
                        <IonSelectOption value="">-- Selecciona --</IonSelectOption>
                        {jugadoresVisitante.map(j => (
                          <IonSelectOption key={j.jugador_id} value={j.jugador_id}>
                            {j.nombre_completo || j.nombre || `Jugador ${j.jugador_id}`}
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
          isOpen={false}
          message=""
          duration={2200}
          color="success"
          position="top"
          className="admin-partidos-toast"
        />
      </IonContent>
    </IonPage>
  );
};

export default AdminPartidos;