import { useState, useEffect, useRef } from 'react';
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import tt from "@tomtom-international/web-sdk-services";
import * as ttmaps from "@tomtom-international/web-sdk-maps";

import './App.css';

function App() {
  const mapElement = useRef();
  const [map, setMap] = useState({});
  const [mapLongitude, setMapLongitude] = useState(null);
  const [mapLatitude, setMapLatitude] = useState(null);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState({});

  const fuzzySearch = (query) => {
    tt.services.fuzzySearch({
        key: "1SA0HS4ZnAr660RIy7sIa8106ejvudpK",
        query: query,
    })
      .then((res) => {
        const amendRes = res.results;
        setResult(amendRes);
        moveMapTo(res.results[0].position);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const moveMapTo = (newLoc) => {
    map.flyTo({
      center: newLoc,
      zoom: 14,
    });
  }

  const ResultBox = ({ result }) => (
    <div className="result" onClick={(e) => {
      moveMapTo(result.position);
      setMapLongitude(result.position.lng);
      setMapLatitude(result.position.lat);
    }}>
      {result.address.freeformAddress}, {result.address.country}
    </div>
  )

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
      <div className="control">
        <h2>Map Controls</h2>
        <div className="search-wrapper">
          <div className="search-control">
            <input className="input" type="text" placeholder="Search Location"
              value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => {
                if (e.key === "Enter") {
                  fuzzySearch(query);
                }
              }}
              required
            />
            <button type="submit" onClick={() => fuzzySearch(query)}>Search</button>
          </div>

          <div className="results">
            {result.length > 0 ? (
              result.map((resultItem) => (
                <ResultBox result={resultItem} key={resultItem.id} />
              ))
            ) : (
              <h4>No locations</h4>
            )}
          </div>
        </div>
      </div>
      <div ref={mapElement} id="map-area"></div>
    </div>
  )
}

export default App
