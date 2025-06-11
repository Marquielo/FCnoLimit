import React, { useState, useEffect } from "react";
import { IonPage, IonContent, IonButton, IonInput, IonLabel, IonItem, IonSelect, IonSelectOption, IonToast } from "@ionic/react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import "./CrearPartido.css";

const CrearPartido: React.FC = () => {
  const [equipos, setEquipos] = useState<any[]>([]);
  const [divisiones, setDivisiones] = useState<any[]>([]);
  const [divisionEquipos, setDivisionEquipos] = useState<any[]>([]);
  const [ligas, setLigas] = useState<any[]>([]);
  const [form, setForm] = useState({
    equipo_local_id: "",
    equipo_visitante_id: "",
    fecha: "",
    estadio: "Estadio Genérico",
    liga_id: "",
    administrador_id: "1",
    estado: "pendiente",
    jugado_en: "",
    division_id: "",
    division_equipo_id: ""
  });
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    // Cargar equipos, divisiones, ligas y division_equipos
    fetch("https://fcnolimit-back.onrender.com/api/equipos")
      .then(res => res.json())
      .then(data => setEquipos(Array.isArray(data) ? data : []));
    fetch("https://fcnolimit-back.onrender.com/api/divisiones/vista_division_jugadores")
      .then(res => res.json())
      .then(data => setDivisiones(Array.isArray(data) ? data : []));
    fetch("https://fcnolimit-back.onrender.com/api/ligas")
      .then(res => res.json())
      .then(data => setLigas(Array.isArray(data) ? data : []));
    fetch("https://fcnolimit-back.onrender.com/api/divisiones/equipos")
      .then(res => res.json())
      .then(data => setDivisionEquipos(Array.isArray(data) ? data : []));
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.equipo_local_id || !form.equipo_visitante_id || !form.fecha || !form.liga_id || !form.division_id || !form.division_equipo_id) {
      setToastMsg("Completa todos los campos obligatorios");
      return;
    }
    if (form.equipo_local_id === form.equipo_visitante_id) {
      setToastMsg("El equipo local y visitante no pueden ser el mismo");
      return;
    }
    const token = localStorage.getItem('token');
    try {
      const res = await fetch("https://fcnolimit-back.onrender.com/api/partidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setToastMsg("Partido creado correctamente");
        setForm({
          equipo_local_id: "",
          equipo_visitante_id: "",
          fecha: "",
          estadio: "Estadio Genérico",
          liga_id: "",
          administrador_id: "1",
          estado: "pendiente",
          jugado_en: "",
          division_id: "",
          division_equipo_id: ""
        });
      } else {
        setToastMsg("Error al crear el partido");
      }
    } catch {
      setToastMsg("Error de conexión");
    }
  };

  return (
    <IonPage>
      <NavBar />
      <IonContent fullscreen className="admin-partidos-bg">
        <div className="crear-partido-container">
          <h1 className="crear-partido-title">Crear Partido</h1>
          <form className="crear-partido-form" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
            <IonItem>
              <IonLabel position="stacked">Equipo Local</IonLabel>
              <IonSelect name="equipo_local_id" value={form.equipo_local_id} onIonChange={handleChange} placeholder="Selecciona equipo local">
                {equipos.map(eq => (
                  <IonSelectOption key={eq.id} value={eq.id}>{eq.nombre}</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Equipo Visitante</IonLabel>
              <IonSelect name="equipo_visitante_id" value={form.equipo_visitante_id} onIonChange={handleChange} placeholder="Selecciona equipo visitante">
                {equipos.map(eq => (
                  <IonSelectOption key={eq.id} value={eq.id}>{eq.nombre}</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Fecha y hora</IonLabel>
              <IonInput name="fecha" type="datetime-local" value={form.fecha} onIonChange={handleChange} />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Estadio</IonLabel>
              <IonInput name="estadio" value={form.estadio} onIonChange={handleChange} />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Liga</IonLabel>
              <IonSelect name="liga_id" value={form.liga_id} onIonChange={handleChange} placeholder="Selecciona liga">
                {ligas.map(l => (
                  <IonSelectOption key={l.id} value={l.id}>{l.nombre}</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">División</IonLabel>
              <IonSelect name="division_id" value={form.division_id} onIonChange={handleChange} placeholder="Selecciona división">
                {divisiones.map(d => (
                  <IonSelectOption key={d.division_id || d.id} value={d.division_id || d.id}>{d.nombre_division || d.nombre}</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">División Equipo</IonLabel>
              <IonSelect name="division_equipo_id" value={form.division_equipo_id} onIonChange={handleChange} placeholder="Selecciona división equipo">
                {divisionEquipos.map(deq => (
                  <IonSelectOption key={deq.id} value={deq.id}>
                    {deq.nombre_division ? `${deq.nombre_division} - ${deq.nombre_equipo}` : (deq.nombre || `ID ${deq.id}`)}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <IonButton expand="block" color="primary" className="crear-partido-btn" type="submit">
              Crear Partido
            </IonButton>
          </form>
        </div>
        <Footer />
        <IonToast
          isOpen={!!toastMsg}
          message={toastMsg}
          duration={2200}
          color={toastMsg.includes('correctamente') ? 'success' : 'danger'}
          position="top"
          onDidDismiss={() => setToastMsg("")}
        />
      </IonContent>
    </IonPage>
  );
};

export default CrearPartido;
