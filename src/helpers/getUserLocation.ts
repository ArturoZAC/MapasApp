
export const getUserLocation = async (): Promise<[number, number]> => {
    return new Promise ((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            ({coords}) => {
                resolve([coords.longitude, coords.latitude])
            },
            (err) => {
                alert('No se pudo obtener la geolocalizacion');
                console.log(err)
                reject()    
            }
        )
    })
}

export const getCountryFromCoordinates = async ([longitude, latitude]: [number,number]): Promise<string | null> => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.address && data.address.country) {
            return data.address.country_code;
        } else {
            console.log('No se pudo determinar el país.');
            return null;
        }
    } catch (error) {
        console.error('Error al obtener el país:', error);
        return null;
    }
};


