import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonButton, IonInput, IonSelect, IonSelectOption, IonDatetime, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon, IonLabel, IonItem } from '@ionic/react';
import { footballOutline, saveOutline, createOutline, calendarOutline, peopleOutline, closeOutline } from 'ionicons/icons';
import NavBar from '../../../components/NavBar';
import Footer from '../../../components/Footer';
import './PanelPartidos.css';

// Simulación de fetch de equipos, divisiones y ligas (reemplaza por tu API real)
const fetchEquipos = async () => [
  { id: 1, nombre: 'Manchester City' },
  { id: 2, nombre: 'Manchester United' },
  { id: 3, nombre: 'FC Barcelona' },
  { id: 4, nombre: 'Real Madrid' }
];
const fetchDivisiones = async () => [
  { id: 1, nombre: 'Primera Adulto' },
  { id: 2, nombre: 'Segunda Adulto' }
];
const fetchLigas = async () => [
  { id: 1, nombre: 'Liga Amateur' },
  { id: 2, nombre: 'Copa FCnoLimit' }
];

const initialForm = {
  equipo_local_id: '',
  equipo_visitante_id: '',
  liga_id: '',
  division_id: '',
  fecha: '',
  estadio: '',
  estado: 'pendiente'
};

const PanelPartidos: React.FC = () => {
  const [form, setForm] = useState(initialForm);
  const [equipos, setEquipos] = useState<any[]>([]);
  const [divisiones, setDivisiones] = useState<any[]>([]);
  const [ligas, setLigas] = useState<any[]>([]);
  const [partidos, setPartidos] = useState<any[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    // Cargar datos (reemplaza por fetch real)
    fetchEquipos().then(setEquipos);
    fetchDivisiones().then(setDivisiones);
    fetchLigas().then(setLigas);
    // fetchPartidos() para cargar partidos existentes si lo deseas
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: any) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí deberías hacer un POST o PUT a tu backend/API
    // Ejemplo: await api.savePartido(form);
    if (editIndex !== null) {
      // Editar partido existente
      setPartidos(prev => prev.map((p, i) => i === editIndex ? form : p));
      setEditIndex(null);
    } else {
      // Crear nuevo partido
      setPartidos(prev => [...prev, form]);
    }
    setForm(initialForm);
    // Los triggers de la DB se activarán cuando guardes en la base real
  };

  const handleEdit = (index: number) => {
    setForm(partidos[index]);
    setEditIndex(index);
  };

  const handleCancel = () => {
    setForm(initialForm);
    setEditIndex(null);
  };

  return (
    <IonPage>
      <NavBar />
      <IonContent fullscreen>
        <div className="content-section animate-on-scroll">
          <div className="section-header">
            <h2 className="section-title">
              <IonIcon icon={footballOutline} className="section-icon" />
              <span>Panel de Partidos</span>
            </h2>
          </div>
          <IonCard className="panel-card">
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={createOutline} /> {editIndex !== null ? 'Editar Partido' : 'Crear Nuevo Partido'}
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <form onSubmit={handleSubmit} className="panel-form">
                <IonItem>
                  <IonLabel position="stacked">Equipo Local</IonLabel>
                  <IonSelect
                    value={form.equipo_local_id}
                    onIonChange={e => handleSelectChange('equipo_local_id', e.detail.value)}
                    required
                  >
                    <IonSelectOption value="">Selecciona equipo</IonSelectOption>
                    {equipos.map(eq => (
                      <IonSelectOption key={eq.id} value={eq.id}>{eq.nombre}</IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Equipo Visitante</IonLabel>
                  <IonSelect
                    value={form.equipo_visitante_id}
                    onIonChange={e => handleSelectChange('equipo_visitante_id', e.detail.value)}
                    required
                  >
                    <IonSelectOption value="">Selecciona equipo</IonSelectOption>
                    {equipos.map(eq => (
                      <IonSelectOption key={eq.id} value={eq.id}>{eq.nombre}</IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Liga</IonLabel>
                  <IonSelect
                    value={form.liga_id}
                    onIonChange={e => handleSelectChange('liga_id', e.detail.value)}
                    required
                  >
                    <IonSelectOption value="">Selecciona liga</IonSelectOption>
                    {ligas.map(lg => (
                      <IonSelectOption key={lg.id} value={lg.id}>{lg.nombre}</IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">División</IonLabel>
                  <IonSelect
                    value={form.division_id}
                    onIonChange={e => handleSelectChange('division_id', e.detail.value)}
                    required
                  >
                    <IonSelectOption value="">Selecciona división</IonSelectOption>
                    {divisiones.map(div => (
                      <IonSelectOption key={div.id} value={div.id}>{div.nombre}</IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Fecha y Hora</IonLabel>
                  <IonDatetime
                    value={form.fecha}
                    onIonChange={e => handleSelectChange('fecha', e.detail.value!)}
                    presentation="date-time"
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Estadio</IonLabel>
                  <IonInput
                    name="estadio"
                    value={form.estadio}
                    onIonChange={handleChange}
                    required
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Estado</IonLabel>
                  <IonSelect
                    value={form.estado}
                    onIonChange={e => handleSelectChange('estado', e.detail.value)}
                  >
                    <IonSelectOption value="pendiente">Pendiente</IonSelectOption>
                    <IonSelectOption value="jugado">Jugado</IonSelectOption>
                    <IonSelectOption value="cancelado">Cancelado</IonSelectOption>
                  </IonSelect>
                </IonItem>
                <div className="panel-actions">
                  <IonButton type="submit" color="primary">
                    <IonIcon icon={saveOutline} slot="start" />
                    {editIndex !== null ? 'Guardar Cambios' : 'Crear Partido'}
                  </IonButton>
                  {editIndex !== null && (
                    <IonButton color="medium" onClick={handleCancel}>
                      <IonIcon icon={closeOutline} slot="start" />
                      Cancelar
                    </IonButton>
                  )}
                </div>
              </form>
            </IonCardContent>
          </IonCard>

          {/* Lista de partidos creados (simulada, reemplaza por fetch real) */}
          <div className="panel-list">
            <h3>Partidos creados</h3>
            {partidos.length === 0 && <p>No hay partidos registrados.</p>}
            {partidos.map((p, i) => (
              <IonCard key={i} className="panel-list-card">
                <IonCardHeader>
                  <IonCardTitle>
                    <IonIcon icon={footballOutline} /> {equipos.find(eq => eq.id === p.equipo_local_id)?.nombre} vs {equipos.find(eq => eq.id === p.equipo_visitante_id)?.nombre}
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p><IonIcon icon={calendarOutline} /> {p.fecha}</p>
                  <p><IonIcon icon={peopleOutline} /> Liga: {ligas.find(lg => lg.id === p.liga_id)?.nombre} | División: {divisiones.find(div => div.id === p.division_id)?.nombre}</p>
                  <p><IonIcon icon={footballOutline} /> Estadio: {p.estadio}</p>
                  <p>Estado: <b>{p.estado}</b></p>
                  <IonButton size="small" color="secondary" onClick={() => handleEdit(i)}>
                    <IonIcon icon={createOutline} slot="start" /> Editar
                  </IonButton>
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default PanelPartidos;