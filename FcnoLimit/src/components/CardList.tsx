import React from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle } from '@ionic/react';
import './CardList.css';

interface CardData {
  id: number;
  title: string;
  subtitle: string;
  content: string;
}

const mockData: CardData[] = [
  { id: 1, title: 'Partido 1', subtitle: 'Equipo A vs Equipo B', content: 'Fecha: 2025-04-20' },
  { id: 2, title: 'Partido 2', subtitle: 'Equipo C vs Equipo D', content: 'Fecha: 2025-04-21' },
  { id: 3, title: 'Partido 3', subtitle: 'Equipo E vs Equipo F', content: 'Fecha: 2025-04-22' },
];

const CardList: React.FC = () => (
  <div style={{ padding: 16 }}>
    {mockData.map(card => (
      <IonCard key={card.id}>
        <IonCardHeader>
          <IonCardTitle>{card.title}</IonCardTitle>
          <IonCardSubtitle>{card.subtitle}</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          {card.content}
        </IonCardContent>
      </IonCard>
    ))}
  </div>
);

export default CardList;