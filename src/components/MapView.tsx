import { useContext, useLayoutEffect, useRef } from "react"
import { MapContext, PlacesContext } from "../context"
import { Loading } from "./"
import {Map} from "mapbox-gl"

export const MapView = () => {

  const {isLoading, userLocation} = useContext(PlacesContext)
  const mapDiv = useRef<HTMLDivElement>(null);

  const {setMap} = useContext(MapContext)
  
  // console.log(userLocation)

  useLayoutEffect(() => {
    if(!isLoading && userLocation){
      const map = new Map({
        container: mapDiv.current!, // container ID
        style: 'mapbox://styles/mapbox/streets-v12', // style URL
        center: userLocation, // starting position [lng, lat]
        zoom: 14, // starting zoom
      });
      setMap(map)
    }

  }, [isLoading, userLocation])



  if(isLoading){
    return (<Loading/>)
  }

  return (
    <div ref={mapDiv}
      style={{
        height: '100vh',
        left: 0,
        position: 'fixed',
        top: 0,
        width: '100vw'
      }}
    >
    </div>
  )
}
