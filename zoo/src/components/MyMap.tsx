import { GoogleMap } from '@capacitor/google-maps';
import { useEffect, useRef } from 'react';
import { mapsApiKey } from '../../mapsApiKey';

interface MyMapProps {
  lat: number;
  lng: number;
  onMapClick: (e: any) => void;
  onMarkerClick: (e: any) => void;
  isEditable: boolean;
}



const MyMap: React.FC<MyMapProps> = ({ lat, lng, onMapClick, onMarkerClick, isEditable }) => {
  const mapRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let canceled = false;
    let googleMap: GoogleMap | null = null;

    const createMap = async () => {
      if (!mapRef.current) return;
      
      googleMap = await GoogleMap.create({
        id: 'my-cool-map',
        element: mapRef.current,
        apiKey: mapsApiKey,
        config: {
          center: { lat, lng },
          zoom: 8,
        },
      });

      const myLocationMarkerId = await googleMap.addMarker({
        coordinate: { lat, lng },
        title: 'My location',
      });

      // Conditionally add event listeners based on isEditable
      console.log(isEditable)
      if (isEditable) {
        await googleMap.setOnMapClickListener(({ latitude, longitude }) => {
          onMapClick({ latitude, longitude });
        });

        await googleMap.setOnMarkerClickListener(({ markerId, latitude, longitude }) => {
          onMarkerClick({ markerId, latitude, longitude });
        });
      }
    };

    createMap();

    return () => {
      canceled = true;
      googleMap?.removeAllMapListeners();
    };
  }, [lat, lng, isEditable, mapRef.current]);

  return (
    <div className="component-wrapper">
      <capacitor-google-map 
        ref={mapRef} 
        style={{
          display: 'block',
          width: 350,
          height: 200,
          position: 'absolute',
          bottom: '50px',
          right: '0px',
        }}
      ></capacitor-google-map>
    </div>
  );
};

export default MyMap;
