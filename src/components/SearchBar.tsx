import { ChangeEvent, useContext, useRef } from "react"
import { MapContext, PlacesContext } from "../context"
import { SearchResults } from "./SearchResults"

export const SearchBar = () => {

  const {searchPlacesByTerm} = useContext(PlacesContext)
  const {map} = useContext(MapContext)

  const debounceRef = useRef<number | undefined>(undefined)

  const onQueryChanged = (event: ChangeEvent<HTMLInputElement>) => {
    if(debounceRef.current){
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      searchPlacesByTerm(event.target.value);
      if (map) {
        if (map.getLayer('RouteString')) {
          map.removeLayer('RouteString');
        }
        if (map.getSource('RouteString')) {
          map.removeSource('RouteString');
        }
      }
    }, 350);
  }

  return (
    <div className="search-container">
        <input 
            type="text" 
            className="form-control" 
            placeholder="Buscar lugar..." 
            onChange={onQueryChanged}
        />

        <SearchResults />
    </div>
  )
}
