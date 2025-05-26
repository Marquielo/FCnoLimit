import React from 'react';
import GoogleMapReact from 'google-map-react';
import { IonIcon } from '@ionic/react';
import { locationOutline } from 'ionicons/icons';
import './LocationMap.css';

interface MarkerProps {
  lat: number;
  lng: number;
  text: string;
}

interface Location {
  lat: number;
  lng: number;
  zoom: number;
}

export type LocationType = 
  | 'Campo principal'
  | 'Campo auxiliar'
  | 'Gimnasio'
  | 'Sala de tácticas'
  | 'Pista de atletismo'
  | '';

const Marker: React.FC<MarkerProps> = ({ text }) => (
  <div className="marker">
    <IonIcon icon={locationOutline} className="marker-icon" />
    <div className="marker-text">{text}</div>
  </div>
);

const locations: Record<LocationType, Location> = {
  'Campo principal': { lat: -33.4569, lng: -70.6483, zoom: 18 },
  'Campo auxiliar': { lat: -33.4589, lng: -70.6493, zoom: 18 },
  'Gimnasio': { lat: -33.4579, lng: -70.6473, zoom: 19 },
  'Sala de tácticas': { lat: -33.4559, lng: -70.6463, zoom: 19 },
  'Pista de atletismo': { lat: -33.4549, lng: -70.6453, zoom: 18 },
  '': { lat: -33.4569, lng: -70.6483, zoom: 16 } // Ubicación por defecto
};

interface LocationMapProps {
  selectedLocation: LocationType;
}

const LocationMap: React.FC<LocationMapProps> = ({ selectedLocation }) => {
  const location = locations[selectedLocation] || locations[''];

  return (
    <div style={{ height: '250px', width: '100%', position: 'relative' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY }}
        defaultCenter={{
          lat: location.lat,
          lng: location.lng
        }}
        defaultZoom={location.zoom}
        options={{
          fullscreenControl: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false
        }}
      >
        {selectedLocation && (
          <Marker
            lat={location.lat}
            lng={location.lng}
            text={selectedLocation}
          />
        )}
      </GoogleMapReact>
    </div>
  );
};

export default LocationMap;