import { useContext } from "react"
import { MapContext, PlacesContext } from "../context"

export const BtnMyLocation = () => {

    const {map, isMapReady} = useContext(MapContext)
    const {userLocation} = useContext(PlacesContext)

    const onClick = () => {
        if(!isMapReady) throw new Error('Mapa no está listo');
        if(!userLocation) throw new Error('No hay ubicacion de usuario');

        map?.flyTo({
            zoom: 14,
            center: userLocation
        })
    }

  return (
    <button className="btn btn-primary"
        onClick={onClick}
        style={{
            position: 'fixed',
            bottom: '40px',
            right: '20px',
            zIndex: 999
        }}
    >
        Mi Ubicacion
    </button>
)
}
