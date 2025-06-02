import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonLoading,
  IonToast,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/react';
import {
  logOutOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './JugadorPerfil.css';

interface JugadorDetalle {
  id: number;
  nombre_corto: string;
  apellido_principal: string;
  fecha_nacimiento: string;
  posicion: string;
  estatura: number;
  estado: 'activo' | 'inactivo' | 'lesionado' | 'suspendido';
  imagen_cabecera_url?: string;
  equipo_actual?: string;
  numero_camiseta?: number;
  estadisticas: {
    partidos_jugados: number;
    goles: number;
    asistencias: number;
    tarjetas_amarillas: number;
    tarjetas_rojas: number;
  }
}

const calcularEdad = (fechaNacimiento: string): number => {
  if (!fechaNacimiento) return 0;
  const hoy = new Date();
  const cumpleanos = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - cumpleanos.getFullYear();
  const m = hoy.getMonth() - cumpleanos.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
    edad--;
  }
  return edad;
};

const JugadorPerfil: React.FC = () => {
  const [perfil, setPerfil] = useState<JugadorDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState('danger');

  const history = useHistory();

  useEffect(() => {
    fetchJugadorPerfil();
  }, []);

  const fetchJugadorPerfil = async () => {
    setLoading(true);
    try {
      const userJSON = localStorage.getItem('usuario');
      if (!userJSON) throw new Error('No se encontró la sesión del usuario');
      const user = JSON.parse(userJSON);

      setTimeout(() => {
        const nombreCompleto = user.nombre_completo || "Jefferson Alexis Castillo Marín";
        const partesNombre = nombreCompleto.split(' ');
        const nombreCorto = partesNombre.slice(0, 2).join(' ') + (partesNombre.length > 2 && partesNombre[0].toLowerCase() !== "juan" ? " c.l." : "");
        const apellidoPrincipal = partesNombre.slice(partesNombre.length > 2 ? 2 : 1).join(' ');

        setPerfil({
          id: user.id || 1,
          nombre_corto: nombreCorto,
          apellido_principal: apellidoPrincipal,
          fecha_nacimiento: '1990-01-01',
          posicion: 'Mediocampo',
          estatura: 183,
          estado: 'activo',
          imagen_cabecera_url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vdGJhbGx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=700&q=60',
          equipo_actual: 'Guillermo Rivera',
          numero_camiseta: 22,
          estadisticas: {
            partidos_jugados: 10,
            goles: 4,
            asistencias: 6,
            tarjetas_amarillas: 2,
            tarjetas_rojas: 1
          }
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error al cargar perfil del jugador:', error);
      setToastMessage('Error al cargar los datos. Intente nuevamente.');
      setToastColor('danger');
      setShowToast(true);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    history.push('/auth');
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle>FCNOLIMIT</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleLogout}>
              <IonIcon slot="icon-only" icon={logOutOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="jugador-perfil-content-light" fullscreen>
        <IonLoading isOpen={loading} message={'Cargando perfil...'} />

        {perfil && (
          <div className="perfil-card-light">
            <div className="perfil-cabecera-imagen-container-light">
              <img
                src={perfil.imagen_cabecera_url || 'https://via.placeholder.com/600x300?text=Header+Image'}
                alt="Cabecera del perfil"
                className="perfil-cabecera-img-light"
              />
              {perfil.estado === 'activo' && (
                <div className="cabecera-overlay-fichado-light">FICHADO</div>
              )}
            </div>

            <div className="info-principal-container-light ion-padding-start ion-padding-end ion-padding-bottom">
              <div className="numero-nombre-light">
                <span className="numero-camiseta-grande-light">{perfil.numero_camiseta}</span>
                <div className="nombre-jugador-light">
                  <span className="nombre-corto-light">{perfil.nombre_corto}</span>
                  <span className="apellido-principal-light">{perfil.apellido_principal}</span>
                </div>
              </div>
            </div>

            <IonGrid className="detalles-grid-light ion-padding-start ion-padding-end">
              <IonRow>
                <IonCol size="6">
                  <div className="detalle-item-light">
                    <span className="detalle-label-light">EQUIPO</span>
                    <span className="detalle-valor-light">{perfil.equipo_actual}</span>
                  </div>
                </IonCol>
                <IonCol size="6">
                  <div className="detalle-item-light">
                    <span className="detalle-label-light">EDAD</span>
                    <span className="detalle-valor-light">{calcularEdad(perfil.fecha_nacimiento)} AÑOS</span>
                  </div>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="6">
                  <div className="detalle-item-light">
                    <span className="detalle-label-light">POSICIÓN</span>
                    <span className="detalle-valor-light">{perfil.posicion}</span>
                  </div>
                </IonCol>
                <IonCol size="6">
                  <div className="detalle-item-light">
                    <span className="detalle-label-light">ALTURA</span>
                    <span className="detalle-valor-light">{perfil.estatura} CM</span>
                  </div>
                </IonCol>
              </IonRow>
            </IonGrid>

            <div className="stats-rapidas-container-light ion-padding">
              <div className="stat-rapida-card-light">
                <div className="stat-valor-light">{perfil.estadisticas.partidos_jugados}</div>
                <div className="stat-label-rapida-light">PARTIDOS</div>
              </div>
              <div className="stat-rapida-card-light">
                <div className="stat-valor-light">{perfil.estadisticas.goles}</div>
                <div className="stat-label-rapida-light">GOLES</div>
              </div>
              <div className="stat-rapida-card-light">
                <div className="stat-valor-light">{perfil.estadisticas.asistencias}</div>
                <div className="stat-label-rapida-light">ASISTENCIAS</div>
              </div>
            </div>

            <div className="estadisticas-detalladas-container-light ion-padding">
              <h3 className="titulo-seccion-light">ESTADÍSTICAS</h3>
              <IonList lines="none" className="lista-estadisticas-light">
                <IonItem className="item-estadistica-light">
                  <IonLabel>Tarjetas amarillas</IonLabel>
                  <div slot="end" className="stat-indicador-light amarillo">{perfil.estadisticas.tarjetas_amarillas}</div>
                </IonItem>
                <IonItem className="item-estadistica-light">
                  <IonLabel>Tarjetas rojas</IonLabel>
                  <div slot="end" className="stat-indicador-light rojo">{perfil.estadisticas.tarjetas_rojas}</div>
                </IonItem>
              </IonList>
            </div>
          </div>
        )}

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          color={toastColor}
        />
      </IonContent>
    </IonPage>
  );
};

export default JugadorPerfil;