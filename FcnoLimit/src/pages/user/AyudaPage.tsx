import React from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonAccordion,
  IonAccordionGroup,
  IonButton
} from '@ionic/react';

const AyudaPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ayuda</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Centro de ayuda FCnoLimit</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>
              Bienvenido al centro de ayuda de FCnoLimit. Aquí encontrarás respuestas a las preguntas más frecuentes.
            </p>
          </IonCardContent>
        </IonCard>

        <IonAccordionGroup>
          <IonAccordion value="first">
            <IonItem slot="header">
              <IonLabel>¿Cómo puedo actualizar mi perfil?</IonLabel>
            </IonItem>
            <div slot="content" className="ion-padding">
              <p>Para actualizar tu perfil, ve a la sección "Perfil" en el menú principal y haz clic en "Editar perfil". Allí podrás modificar tu información personal.</p>
            </div>
          </IonAccordion>

          <IonAccordion value="second">
            <IonItem slot="header">
              <IonLabel>¿Cómo funcionan las estadísticas?</IonLabel>
            </IonItem>
            <div slot="content" className="ion-padding">
              <p>Las estadísticas se actualizan automáticamente después de cada partido o entrenamiento. Los entrenadores pueden registrar información adicional que se verá reflejada en tu perfil.</p>
            </div>
          </IonAccordion>

          <IonAccordion value="third">
            <IonItem slot="header">
              <IonLabel>¿Olvidé mi contraseña, qué hago?</IonLabel>
            </IonItem>
            <div slot="content" className="ion-padding">
              <p>En la página de inicio de sesión, haz clic en "¿Olvidaste tu contraseña?" y sigue las instrucciones para restablecerla a través de tu correo electrónico.</p>
            </div>
          </IonAccordion>
        </IonAccordionGroup>

        <div className="ion-padding">
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Soporte técnico</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>¿No encuentras lo que buscas? Contacta con nuestro equipo de soporte.</p>
              <IonButton expand="block">Contactar soporte</IonButton>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AyudaPage;
