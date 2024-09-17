import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MapsApp } from './MapsApp'

import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"

mapboxgl.accessToken = 'pk.eyJ1IjoiYXJ0dXJvemFjIiwiYSI6ImNtMHZ0b2x5cjBhd28ybHBwbTl2OWQydjIifQ.otrzyEv74jWf6JsZTtr96g';


if(!navigator.geolocation){
  alert('Tu navegador no tiene geolocation');
  throw new Error('Tu navegador no tiene geolocation');
}


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MapsApp />
  </StrictMode>,
)
