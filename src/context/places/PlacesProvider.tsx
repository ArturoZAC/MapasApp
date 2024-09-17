import { useEffect, useReducer, useState } from "react"
import { PlacesContext } from "./PlacesContext"
import { placesReducer } from "./placesReducer"
import { getUserLocation, getCountryFromCoordinates } from "../../helpers"
import { searchApi } from "../../apis"
import { Feature, PlacesResponse } from "../../interfaces/places"

export interface PlacesState {
    isLoading: boolean,
    userLocation?: [number, number],
    isLoadingPlaces: boolean,
    places: Feature[],
    country: undefined,
}

const INITIAL_STATE: PlacesState = {
    isLoading: true,
    userLocation: undefined,
    isLoadingPlaces: false,
    places: [],
    country: undefined,
}

interface Props {
    children: JSX.Element | JSX.Element[]
}


export const PlacesProvider = ({children} : Props) => {

    const [state, dispatch] = useReducer(placesReducer, INITIAL_STATE);
    const [countrys, setCountrys] = useState<string | null>('')

    useEffect(() => {
        (async() => {
            try {
                const lgnLat = await getUserLocation();
                // console.log(lgnLat)
                dispatch({type: 'setUserLocation', payload: lgnLat})
                const offCountry= await getCountryFromCoordinates(lgnLat);
                setCountrys(offCountry)
            } catch (error) {
                console.log('Error al obtener informacion de la ubicacion del usuario ', error)
            }
        })()
    }, [dispatch])
    
    const searchPlacesByTerm = async (query: string): Promise<Feature[]> => {
        if(query.length === 0) {
            dispatch({type: 'setPlaces', payload: []})
            return [];
        }

        if(!state.userLocation) throw new Error('No hay ubicacion del usurio')

        dispatch({type: 'setLoadingPlaces'});
        
        const resp = await searchApi.get<PlacesResponse>(`/${query}.json`, {
            params: {
                country: countrys,
                proximity: state.userLocation.join(','),
            }
        })
        
        dispatch({type: 'setPlaces', payload: resp.data.features});

        console.log(resp.data.features)
        return resp.data.features
    }

  return (
    <PlacesContext.Provider value={{
        ...state,
        searchPlacesByTerm
    }}>
        {children}
    </PlacesContext.Provider>
)
}
