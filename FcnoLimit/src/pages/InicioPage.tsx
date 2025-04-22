import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { Link } from 'react-router-dom';
import './InicioPage.css';
import NavBar from '../components/NavBar';
import Carousel from '../components/Carousel';
import CardList from '../components/CardList';
import 'bootstrap/dist/css/bootstrap.min.css';

const InicioPage: React.FC = () => {
  return (
    <IonPage>
      <div className="tab1-background" />
      <NavBar />
      <IonContent fullscreen>
        <div style={{ width: '100%', marginTop: 24, marginBottom: 8 }}>
          <h2 style={{ textAlign: 'center', color: '#ff7e5f', fontWeight: 600, letterSpacing: 1 }}>Noticias</h2>
        </div>
        <Carousel />
        <CardList />
      </IonContent>
    </IonPage>
  );
};

export default InicioPage;
