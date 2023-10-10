import React, { useEffect, useState, useRef } from 'react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

const App: React.FC = () => {
  const [map, setMap] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<[number, number]>([0, 0]);
  const [locationLoaded, setLocationLoaded] = useState(false);

  useEffect(() => {
    findUser();
  }, []);

  const findUser = async () => {
    if (navigator.geolocation) {
      await navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        if (userLocation) {
          setLocationLoaded(true);
        }
      });
    }
  };

  const onApiAvailable = (ymaps: any) => {
    ymaps.route(
      [
        'Королев',
        { type: 'viaPoint', point: 'Мытищи' },
        'Химки',
        { type: 'wayPoint', point: [55.811511, 67.312518] }
      ],
      {
        mapStateAutoApply: true
      }
    ).then((route: any) => {
      route.getPaths().options.set({
        balloonContentBodyLayout: ymaps.templateLayoutFactory.createClass('$[properties.humanJamsTime]'),
        strokeColor: '0000ffff',
        opacity: 0.9
      });

      map.geoObjects.add(route);
    });
  };

  return (
    <div>
      {locationLoaded && (
        <YMaps query={{ apikey: 'f0275d0b-9d21-401d-a529-688c348d8327' }} >
          <Map
            onLoad={(ymaps: any) => setMap(ymaps)}
            defaultState={{ center: userLocation, zoom: 15 }}
            width="1000px"
            height="700px"
            onApiAvailable={onApiAvailable}
          >
            <Placemark geometry={[userLocation[0], userLocation[1]]} />
          </Map>
        </YMaps>
      )}
      <p>{userLocation[0]}|{userLocation[1]}</p>
    </div>
  );
};

export default App;
