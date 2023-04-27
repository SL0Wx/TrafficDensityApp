import { useState, useEffect, useRef } from 'react';
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import * as ttmaps from "@tomtom-international/web-sdk-maps";

import Controls from './components/Controls';
import './App.css';

function App() {
  const mapElement = useRef();
  const [map, setMap] = useState({});
  const [mapLongitude, setMapLongitude] = useState(null);
  const [mapLatitude, setMapLatitude] = useState(null);

  useEffect(() => {
    let map = ttmaps.map({
      key: "1SA0HS4ZnAr660RIy7sIa8106ejvudpK",
      container: "map-area",
      center: [mapLongitude, mapLatitude],
      zoom: 15,
      pitch: 50,
      style: {
        map: "basic_main",
        poi: "poi_main",
        trafficFlow: "flow_relative",
        trafficIncidents: "incidents_day",
      },
      stylesVisibility: {
        trafficFlow: true,
        trafficIncidents: true,
      },
    });

    setMap(map);
    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setMapLongitude(position.coords.longitude);
      setMapLatitude(position.coords.latitude);
    },
    (error) => {
      alert(error.message);
    });
  }, []);

  useEffect(() => {
    if (mapLongitude && mapLatitude) {
      map.setCenter([mapLongitude, mapLatitude]);
    }
  }, [mapLongitude, mapLatitude]);

  return (
    <div className="App">
      <Controls map={map} setMapLongitude={setMapLongitude} setMapLatitude={setMapLatitude} />
      <div ref={mapElement} id="map-area"></div>
    </div>
  )
}

export default App
