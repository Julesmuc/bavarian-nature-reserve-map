import React, { useState, useEffect, useCallback } from "react";
import './App.css';
import DeckGL from '@deck.gl/react';
import { StaticMap } from 'react-map-gl';
import { GeoJsonLayer } from '@deck.gl/layers';
import { FlyToInterpolator } from '@deck.gl/core';
import { apitoken } from './apitoken'

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
const DATA_URL = 'https://opendata.arcgis.com/datasets/49ede80e43f846f8a50f065df00d6c34_0.geojson';
const INITIAL_VIEW_STATE = {
  latitude: 49.254,
  longitude: 11.49,
  zoom: 9,
  maxZoom: 16,
  pitch: 45,
  bearing: 0
};

function App() {
  const [getLayer, setLayer] = useState(null);
  const [viewport, setViewport] = useState(INITIAL_VIEW_STATE);
  const [infoText, setInfoText] = useState("");
  const [showText, setShowText] = useState(false);

const LayerList = () => {

  const flyToReserve = (layer) => {
    setViewport({
      longitude: layer.geometry.coordinates[0][0][0][0],
      latitude: layer.geometry.coordinates[0][0][0][1],
      zoom: 14,
      pitch: 0,
      bearing: 0,
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator()
    })
    setShowText(true);
    setInfoText(
      <React.Fragment>
<div>{layer.properties.name}</div>
<div>{layer.properties.area_ha} ha</div>
      </React.Fragment>
    );
  }

  const getNatureReserveList = () => {
    if (getLayer) {
      return getLayer.features.map((layer, id) => {
        return (
          <div onClick={_ => flyToReserve(layer)} key={"layer" + id} className="listingText">{layer.properties.name} </div>
        );
      });
    } else {
      return (
        <div></div>
      )
    }
  }
  return (
    <div id="sidebar" className='sidebar'>
      <div className='heading'>
        <h1>Naturschutzgebiete in Bayern</h1>
      </div>
      <div id='listings' className='listings'>
        {getNatureReserveList()}
      </div>
    </div>
  )
}

  const goToMunich = useCallback(() => {
    setViewport({
      longitude: 11.5820,
      latitude: 48.1351,
      zoom: 14,
      pitch: 0,
      bearing: 0,
      transitionDuration: 8000,
      transitionInterpolator: new FlyToInterpolator()
    })
  }, []);

  const goToLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setViewport({
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
        zoom: 14,
        pitch: 0,
        bearing: 0,
        transitionDuration: 2000,
        transitionInterpolator: new FlyToInterpolator()
      })

  });
}

  async function getNatureLayer() {
    const response = await fetch(DATA_URL);
    const json = await response.json();
    setLayer(json);
  }
  useEffect(() => {
    getNatureLayer();
  }, []);
  const layers = [
    new GeoJsonLayer({
      id: 'nature-layer',
      data: getLayer,
      getFillColor: [115, 200, 70, 200],
      getLineColor: [255, 255, 255],
      filled: true,
      extruded: true,
      pickable: true
    })
  ];
  return (
    <React.Fragment>
      <div className="map">
        <DeckGL
          initialViewState={viewport}
          controller={true}
          layers={layers}
        >

          <StaticMap
            apitoken={apitoken} onClick={()=> setShowText(false)} reuseMap preventStyleDiffing={true} mapStyle={MAP_STYLE}>
          </StaticMap>
        </DeckGL>
        <button className="floatButton" onClick={goToLocation}>Dein Standort</button>
        <button className="floatButton left" onClick={goToMunich}>München</button>
      </div>
      <LayerList layers={getLayer} viewport={setViewport} setInfoText={setInfoText} setShowText={setShowText}  ></LayerList>
      {showText &&
        <div id="nature-reserve-information" className="nature-reserve-information">
          {infoText}
      </div>}
    </React.Fragment>
  );
}

export default App;
