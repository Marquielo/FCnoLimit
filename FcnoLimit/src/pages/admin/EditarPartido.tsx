import React, { useEffect, useState } from "react";
import { IonPage, IonContent, IonButton, IonInput, IonLabel, IonItem, IonSelect, IonSelectOption, IonToast } from "@ionic/react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { useLocation, useHistory } from "react-router-dom";

const EditarPartido: React.FC = () => {
  const location = useLocation<{ partido: any }>();
  const history = useHistory();
  const partido = location.state?.partido;
  const [form, setForm] = useState<any>(partido || {});
  const [equipos, setEquipos] = useState<any[]>([]);
  const [divisiones, setDivisiones] = useState<any[]>([]);
  const [divisionEquipos, setDivisionEquipos] = useState<any[]>([]);
  const [ligas, setLigas] = useState<any[]>([]);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
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
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!form.division_id || !form.division_equipo_id || !form.equipo_local_id || !form.equipo_visitante_id || !form.fecha || !form.liga_id) {
      setToastMsg("Completa todos los campos obligatorios");
      return;
    }
    if (form.equipo_local_id === form.equipo_visitante_id) {
      setToastMsg("El equipo local y visitante no pueden ser el mismo");
      return;
    }
    const token = localStorage.getItem('token');
    const payload = {
      ...form,
      division_id: Number(form.division_id),
      division_equipo_id: Number(form.division_equipo_id),
      equipo_local_id: Number(form.equipo_local_id),
      equipo_visitante_id: Number(form.equipo_visitante_id),
      liga_id: Number(form.liga_id)
    };
    try {
      const res = await fetch(`https://fcnolimit-back.onrender.com/api/partidos/${form.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setToastMsg("Partido actualizado correctamente");
        setTimeout(() => history.goBack(), 1200);
      } else {
        setToastMsg("Error al actualizar el partido");
      }
    } catch {
      setToastMsg("Error de conexión");
    }
  };

  // Filtrar equipos según la división equipo seleccionada
  const equiposFiltrados = form.division_equipo_id
    ? equipos.filter(eq => String(eq.division_equipo_id) === String(form.division_equipo_id))
    : equipos;
  // Filtrar equipos visitantes para que no incluya el equipo local seleccionado
  const equiposVisitanteFiltrados = form.equipo_local_id
    ? equiposFiltrados.filter(eq => String(eq.id) !== String(form.equipo_local_id))
    : equiposFiltrados;

  return (
    <IonPage>
      <NavBar />
      <IonContent fullscreen className="admin-partidos-bg">
        <div className="crear-partido-container">
          <h1 className="crear-partido-title">Editar Partido</h1>
          <form className="crear-partido-form" onSubmit={e => { e.preventDefault(); handleUpdate(); }}>
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
            <IonItem>
              <IonLabel position="stacked">División</IonLabel>
              <IonSelect name="division_id" value={form.division_id} onIonChange={handleChange} placeholder="Selecciona división">
                {divisiones.map(d => (
                  <IonSelectOption key={d.division_id || d.id} value={d.division_id || d.id}>{d.nombre_division || d.nombre}</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Equipo Local</IonLabel>
              <IonSelect name="equipo_local_id" value={form.equipo_local_id} onIonChange={handleChange} placeholder="Selecciona equipo local">
                {equiposFiltrados.map(eq => (
                  <IonSelectOption key={eq.id} value={eq.id}>{eq.nombre}</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Equipo Visitante</IonLabel>
              <IonSelect name="equipo_visitante_id" value={form.equipo_visitante_id} onIonChange={handleChange} placeholder="Selecciona equipo visitante">
                {equiposVisitanteFiltrados.map(eq => (
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
            <IonButton expand="block" color="primary" className="crear-partido-btn" type="submit">
              Guardar Cambios
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

export default EditarPartido;
