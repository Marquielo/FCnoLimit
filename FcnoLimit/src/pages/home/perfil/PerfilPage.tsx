import React, { useState, useEffect } from 'react';
import { 
  IonContent, 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonButtons, 
  IonBackButton, 
  IonIcon, 
  IonText, 
  IonImg, 
  IonButton, 
  IonCard,
  IonCardContent,
  IonRow,
  IonCol,
  IonGrid,
  IonBadge,
  IonItem,
  IonList,
  IonFooter,
  useIonRouter
} from '@ionic/react';
import { heart, heartOutline, shareSocial, home, shield, people, football, trophy, statsChart, wifi } from 'ionicons/icons';
import './PerfilPage.css';

interface JugadorData {
  id: number;
  nombre: string;
  apellido: string;
  numero: number;
  nacionalidad: string;
  equipo: string;
  edad: number;
  posicion: string;
  altura: string;
  foto: string;
  fichado: boolean;
  estadisticas: {
    partidos: number;
    goles: number;
    asistencias: number;
    tarjetasAmarillas: number;
    tarjetasRojas: number;
  };
}

const PerfilPage: React.FC = () => {
  const navigation = useIonRouter();
  const [esFavorito, setEsFavorito] = useState(false);
  const [jugador, setJugador] = useState<JugadorData | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Cargar datos del jugador
    const jugadorEjemplo: JugadorData = {
      id: 1,
      nombre: "Jefferson Alexis",
      apellido: "Castillo Marín",
      numero: 22,
      nacionalidad: "cl", // Código ISO de Chile
      equipo: "GUILLERMO RIVERA",
      edad: 34,
      posicion: "MEDIOCAMPO",
      altura: "183 CM",
      // Actualiza esta línea en tu useEffect en PerfilPage.tsx
      foto: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000&auto=format&fit=crop", // Jugador de fútbol profesional
      fichado: true,
      estadisticas: {
        partidos: 10,
        goles: 4,
        asistencias: 6,
        tarjetasAmarillas: 4,
        tarjetasRojas: 0
      }
    };
    
    setJugador(jugadorEjemplo);
    setCargando(false);
  }, []);

  const toggleFavorito = () => {
    setEsFavorito(!esFavorito);
  };

  if (cargando) {
    return (
      <IonPage>
        <IonContent className="ion-padding ion-text-center">
          <div className="loading-container">
            <IonText>Cargando...</IonText>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (!jugador) {
    return (
      <IonPage>
        <IonContent className="ion-padding ion-text-center">
          <div className="loading-container">
            <IonText>No se encontró información del jugador</IonText>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage className="perfil-page">
      {/* Header con botones de retroceso y compartir */}
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonButtons slot="end">
            <IonButton>
              <IonIcon icon={shareSocial} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {/* Foto del jugador */}
        <div className="profile-section">
          <IonImg 
            src={jugador.foto} 
            className="profile-image"
          />
          
          {/* Insignia de "FICHADO" */}
          {jugador.fichado && (
            <div className="fichado-badge">
              <IonText>FICHADO</IonText>
            </div>
          )}

          {/* Botón de favorito (corazón) */}
          <IonButton 
            className="favorite-button"
            fill="clear"
            onClick={toggleFavorito}
          >
            <IonIcon 
              icon={esFavorito ? heart : heartOutline} 
              color={esFavorito ? "danger" : "light"} 
              size="large"
            />
          </IonButton>
        </div>

        {/* Información principal del jugador */}
        <div className="player-info-container">
          <IonText className="player-number">{jugador.numero}</IonText>
          <div className="player-name-container">
            <IonText className="player-name">
              {jugador.nombre}
              <span className="flag-container">
                {jugador.nacionalidad === 'cl' ? ' 🇨🇱' : ''}
              </span>
            </IonText>
            <IonText className="player-last-name">{jugador.apellido}</IonText>
          </div>
        </div>

        {/* Detalles del jugador */}
        <IonGrid className="details-section">
          <IonRow>
            <IonCol size="6">
              <div className="detail-item">
                <IonText className="detail-label">EQUIPO</IonText>
                <IonText className="detail-value">{jugador.equipo}</IonText>
              </div>
            </IonCol>
            <IonCol size="6">
              <div className="detail-item">
                <IonText className="detail-label">EDAD</IonText>
                <IonText className="detail-value">{jugador.edad} AÑOS</IonText>
              </div>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="6">
              <div className="detail-item">
                <IonText className="detail-label">POSICIÓN</IonText>
                <IonText className="detail-value">{jugador.posicion}</IonText>
              </div>
            </IonCol>
            <IonCol size="6">
              <div className="detail-item">
                <IonText className="detail-label">ALTURA</IonText>
                <IonText className="detail-value">{jugador.altura}</IonText>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Botón de fichar/like */}
        <IonButton 
          expand="block" 
          className="fichar-button"
          color="danger"
        >
          <IonIcon icon={heart} slot="start" />
          <IonText>1.5K</IonText>
        </IonButton>

        {/* Estadísticas principales */}
        <IonGrid className="stats-container">
          <IonRow>
            <IonCol>
              <div className="stat-box">
                <IonText className="stat-value">{jugador.estadisticas.partidos}</IonText>
                <IonText className="stat-label">PARTIDOS</IonText>
              </div>
            </IonCol>
            <IonCol>
              <div className="stat-box">
                <IonText className="stat-value">{jugador.estadisticas.goles}</IonText>
                <IonText className="stat-label">GOLES</IonText>
              </div>
            </IonCol>
            <IonCol>
              <div className="stat-box">
                <IonText className="stat-value">{jugador.estadisticas.asistencias}</IonText>
                <IonText className="stat-label">ASISTENCIAS</IonText>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Sección de estadísticas adicionales */}
        <IonText className="section-title">ESTADÍSTICAS</IonText>

        <IonCard className="additional-stats">
          <IonCardContent>
            <IonList lines="full">
              <IonItem>
                <IonText>Tarjetas amarillas</IonText>
                <IonBadge slot="end" color="warning">
                  {jugador.estadisticas.tarjetasAmarillas}
                </IonBadge>
              </IonItem>
              <IonItem>
                <IonText>Tarjetas rojas</IonText>
                <IonBadge slot="end" color="danger">
                  {jugador.estadisticas.tarjetasRojas}
                </IonBadge>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default PerfilPage;