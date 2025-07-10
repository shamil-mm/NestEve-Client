import axios from "axios";
import { getLocationSuggestions } from "../services/EventServices";
const GEO_BASE_URL=import.meta.env.VITE_GEOCODE_API_URL


export const searchLocation =async(query:string)=>{
    if(!query)return [];
    try {
       await getLocationSuggestions()
        //  const res=await axios.get(
        //         `${GEO_BASE_URL}/search?q=${query}&format=json&limit=5` 
        //     );
        //     return res.data 
    } catch (error) {
    console.error('Error fetching location:', error);
    return [];
    }
}

export const getGeoAddress=async(lat:number,lon:number)=>{
    const url=`${GEO_BASE_URL}/reverse?lat=${lat}&lon=${lon}&format=json`;
    try {
        const res=await axios.get(url)
        return res.data.display_name
        
    } catch (error) {
          console.error('Error getting address:', error);
    return '';
    }
}