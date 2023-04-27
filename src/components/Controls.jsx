import React, { useState } from 'react';
import tt from "@tomtom-international/web-sdk-services";

const Controls = ({ map, setMapLongitude, setMapLatitude }) => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState({});
  const [streets, setStreets] = useState([]);

  const fuzzySearch = (query) => {
    let city;

    tt.services.fuzzySearch({
      key: "1SA0HS4ZnAr660RIy7sIa8106ejvudpK",
      query: query,
      idxSet: "Geo,Str",
      limit: 5,
    })
      .then((res) => {
        const amendRes = res.results;
        setResult(amendRes);
        moveMapTo(res.results[0].position);
        city = res.results[0].address.municipality;
      })
      .catch((err) => {
        console.log(err);
      })
      
      tt.services.poiSearch({
        key: "1SA0HS4ZnAr660RIy7sIa8106ejvudpK",
        query: query,
        limit: 50,
      })
      .then((res) => {
        let streetList = [];
        res.results.map((item, i) => {
          if (item.address.streetName 
          && streetList.some(street => street.streetName === item.address.streetName) === false
          && item.address.municipality === city) {
            streetList.push({ streetName: item.address.streetName, position: item.position });
          }
        })
        setStreets(streetList);
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

  const StreetBox = ({ street }) => (
    <div className="result" onClick={(e) => {
      moveMapTo(street.position);
      setMapLongitude(street.position.lng);
      setMapLatitude(street.position.lat);
    }}>
      {street.streetName}
    </div>
  )

  return (
    <div className="control">
        <h2>Location Controls</h2>
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
        {streets.length > 0 && (
          <>
            <h2>Main streets</h2>
            <div className="streets">
              {streets.length > 0 ? (
                streets.map((streetItem, i) => (
                  <StreetBox street={streetItem} key={i} />
                ))
              ) : (
                <h4>No streets</h4>
              )}
            </div>
          </>
        )}
      </div>
  )
}

export default Controls