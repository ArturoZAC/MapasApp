import axios from "axios";


const directionsApi = axios.create({
    baseURL: 'https://api.mapbox.com/directions/v5/mapbox/driving',
    params: {
        alternatives: false,
        geometries: 'geojson',
        overview: 'simplified',
        steps: false,
        access_token: 'pk.eyJ1IjoiYXJ0dXJvemFjIiwiYSI6ImNtMHZ0b2x5cjBhd28ybHBwbTl2OWQydjIifQ.otrzyEv74jWf6JsZTtr96g',
    }
})

export default directionsApi;