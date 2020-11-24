import React, { useState, useEffect } from "react";
import './App.css';
import DeckGL from '@deck.gl/react';
import { InteractiveMap } from 'react-map-gl';
import { GeoJsonLayer } from '@deck.gl/layers';
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

const [getLayer,setLayer] = useState(null);

async function getNatureLayer() {
  const response =  await fetch(DATA_URL);
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
    <div className="App">
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}>
        <InteractiveMap apitoken={apitoken} reuseMap preventStyleDiffing={true} mapStyle={MAP_STYLE}>
        </InteractiveMap>
      </DeckGL>
    </div>
  );
}

export default App;
