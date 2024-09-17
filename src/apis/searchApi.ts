import axios from "axios";


const searchApi = axios.create({
    baseURL: 'https://api.mapbox.com/geocoding/v5/mapbox.places',
    params: {
        limit: 4,
        language: 'es',
        access_token: 'pk.eyJ1IjoiYXJ0dXJvemFjIiwiYSI6ImNtMHZ0b2x5cjBhd28ybHBwbTl2OWQydjIifQ.otrzyEv74jWf6JsZTtr96g',
    }
})

export default searchApi;