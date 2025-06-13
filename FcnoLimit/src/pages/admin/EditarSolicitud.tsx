import React, { useEffect, useState } from "react";
import { IonPage, IonContent, IonButton, IonInput, IonLabel, IonItem, IonSelect, IonSelectOption, IonToast } from "@ionic/react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { useLocation, useHistory } from "react-router-dom";

const EditarSolicitud: React.FC = () => {
  const location = useLocation<{ solicitud: any }>();
  const history = useHistory();
  const solicitud = location.state?.solicitud;
  const [form, setForm] = useState<any>(solicitud || {});
  const [toastMsg, setToastMsg] = useState("");
  const [clubes, setClubes] = useState<any[]>([]);
  const [divisiones, setDivisiones] = useState<any[]>([]);

  useEffect(() => {
    fetch("https://fcnolimit-back.onrender.com/api/equipos")
      .then(res => res.json())
      .then(data => setClubes(Array.isArray(data) ? data : []));
    fetch("https://fcnolimit-back.onrender.com/api/divisiones/vista_division_jugadores")
      .then(res => res.json())
      .then(data => setDivisiones(Array.isArray(data) ? data : []));
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!form.nombres || !form.rut || !form.apellido_paterno || !form.tipo_solic_inscripcion) {
      setToastMsg("Completa todos los campos obligatorios");
      return;
    }
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`https://fcnolimit-back.onrender.com/api/solicitudes/inscripciones/${form.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setToastMsg("Solicitud actualizada correctamente");
        setTimeout(() => history.goBack(), 1200);
      } else {
        setToastMsg("Error al actualizar la solicitud");
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
          <h1 className="crear-partido-title">Editar Solicitud</h1>
          <form className="crear-partido-form" onSubmit={e => { e.preventDefault(); handleUpdate(); }}>
            <IonItem>
              <IonLabel position="stacked">Nombres</IonLabel>
              <IonInput name="nombres" value={form.nombres} readonly />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Apellido Paterno</IonLabel>
              <IonInput name="apellido_paterno" value={form.apellido_paterno} readonly />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Apellido Materno</IonLabel>
              <IonInput name="apellido_materno" value={form.apellido_materno} readonly />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">RUT</IonLabel>
              <IonInput name="rut" value={form.rut} readonly />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Fecha Nacimiento</IonLabel>
              <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
                <IonInput
                  name="fecha_nacimiento"
                  type="date"
                  value={form.fecha_nacimiento ? new Date(form.fecha_nacimiento).toISOString().slice(0, 10) : ''}
                  readonly
                  style={{flex: 1}}
                />
                {form.fecha_nacimiento && (() => {
                  const hoy = new Date();
                  const nac = new Date(form.fecha_nacimiento);
                  let edad = hoy.getFullYear() - nac.getFullYear();
                  const m = hoy.getMonth() - nac.getMonth();
                  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) {
                    edad--;
                  }
                  return (
                    <span style={{marginLeft: 12, fontWeight: 500, color: '#444', fontSize: '1rem'}}>
                      {edad} años
                    </span>
                  );
                })()}
              </div>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Tipo Solicitud</IonLabel>
              <IonInput name="tipo_solic_inscripcion" value={form.tipo_solic_inscripcion} readonly />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Club a Inscribir</IonLabel>
              <IonSelect name="club_a_inscribir_id" value={form.club_a_inscribir_id} onIonChange={handleChange} placeholder="Selecciona un club">
                {clubes.map((club: any) => (
                  <IonSelectOption key={club.id} value={club.id}>{club.nombre}</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">División</IonLabel>
              <IonSelect name="division_id" value={form.division_id} onIonChange={handleChange} placeholder="Selecciona una división">
                {divisiones.map((div: any) => (
                  <IonSelectOption key={div.id || div.division_id} value={div.id || div.division_id}>{div.nombre || div.nombre_division}</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Asociación</IonLabel>
              <IonInput name="asociacion" value={form.asociacion} readonly />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Estado</IonLabel>
              <IonSelect name="estado" value={form.estado} onIonChange={handleChange} placeholder="Selecciona estado">
                <IonSelectOption value="aceptada">Aceptada</IonSelectOption>
                <IonSelectOption value="rechazada">Rechazada</IonSelectOption>
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

export default EditarSolicitud;
