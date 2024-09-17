import {LngLatBounds, Map, Marker, Popup, SourceSpecification } from "mapbox-gl"
import { MapContext } from "./MapContext"
import { useContext, useEffect, useReducer } from "react"
import { mapReducer } from "./mapReducer"
import { PlacesContext } from "../places/PlacesContext"
import { directionsApi } from "../../apis"
import { DirectionsResponse } from "../../interfaces/directions"


export interface MapState {
    isMapReady: boolean,
    map?: Map,
    markers: Marker[],
}

const INITIAL_STATE: MapState = {
    isMapReady: false,  
    map: undefined,
    markers: []
}

interface Props {
    children: JSX.Element | JSX.Element[]
}

export const MapProvider = ({children} : Props) => {

    const [state, dispatch] = useReducer(mapReducer, INITIAL_STATE);
    const {places} = useContext(PlacesContext)

    useEffect(() => {
        state.markers.forEach(marker => marker.remove());
        const newMarkers: Marker[] = [];

        for (const place of places) {
            const [lng, lat] = place.center;
            const popupContent = `
                <div style="position: relative;">
                    <button onclick="this.closest('.mapboxgl-popup').remove()" aria-label="Close popup" style="position: absolute; top: 5px; right: 0px; background: transparent; border: none; font-size: 20px; cursor: pointer;">×</button>
                    <h6>${place.text}</h6>
                    <p>${place.place_name}</p>
                </div>
            `;
            const popup = new Popup()
                .setHTML(popupContent)

            const newMarker = new Marker()
                .setPopup(popup)
                .setLngLat([lng, lat])
                .addTo(state.map!)

            newMarkers.push(newMarker)
        }

        dispatch({type: 'setMarkers', payload: newMarkers})

    }, [places])
    

    
    const setMap = (map: Map) => {
        
        const myLocationPopup = new Popup()
            .setHTML(
                `
                <div style="position: relative;">
                    <button onclick="this.closest('.mapboxgl-popup').remove()" aria-label="Close popup" style="position: absolute; top: 5px; right: 0px; background: transparent; border: none; font-size: 20px; cursor: pointer;">×</button>
                    <h4>Aqui Estoy</h4>
                    <p>En algun lugar del mundo</p>
                </div>
                `
            )

        new Marker({
            color: "red"
        })
        .setLngLat(map.getCenter())
        .setPopup(myLocationPopup)
        .addTo(map);
        
        
        
        dispatch({type: 'setMap', payload: map})
    }
    
    
    useEffect(() => {
        const hideDefaultCloseButton = () => {
            const style = document.createElement('style');
            style.textContent = `
            .mapboxgl-popup-close-button {
                display: none;
                }
                `;
                document.head.appendChild(style);
                
                return () => {
                    document.head.removeChild(style);
                };
            };
            
            hideDefaultCloseButton();
    }, []);    
        


    const getRouteBetweenPoints = async(start: [number,number], end: [number, number]) => {
        const resp = await directionsApi.get<DirectionsResponse>(`/${start.join(',')};${end.join(',')}`)

        const {distance, geometry} = resp.data.routes[0];
        const {coordinates: coords} = geometry;

        let kms = distance / 1000;
            kms = Math.round(kms * 100);
            kms /= 100;

        // const minutes = Math.floor(duration / 60);

        const bounds = new LngLatBounds(
            start,
            start
        )

        for (const coord of coords) {
            const newCoord: [number, number] = [coord[0], coord[1]]
            bounds.extend(newCoord)
        }

        state.map?.fitBounds(bounds, {
            padding: 200,
        })

        const sourceData: SourceSpecification = {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'LineString',
                            coordinates: coords
                        }
                    }
                ]
            }
        }

        if(state.map?.getLayer('RouteString')){
            state.map.removeLayer('RouteString');
            state.map.removeSource('RouteString');
        }

        state.map?.addSource('RouteString', sourceData)

        state.map?.addLayer({
            id: 'RouteString',
            type: 'line',
            source: 'RouteString',
            layout: {
                'line-cap': 'round',
                'line-join': 'round'
            },
            paint: {
                'line-color': 'black',
                'line-width': 3
            }
        })
    }


    return (
        <MapContext.Provider value={{
            ...state,
            setMap,
            getRouteBetweenPoints,
        }}>
            {children}
        </MapContext.Provider>
    )
}
