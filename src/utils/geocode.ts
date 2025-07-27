import axios from "axios";
import { getLocationSuggestions } from "../services/EventServices";
const GEO_BASE_URL=import.meta.env.VITE_GEOCODE_API_URL


const locationCache= new Map<string,any>()
export const searchLocation =async(query:string)=>{
    if(!query)return [];
    if(locationCache.has(query)){
        return locationCache.get(query)
    }
    try {
   
       const res=await getLocationSuggestions(query)
            const data= res?.data
            locationCache.set(query,data)
            return data
  
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
        // return ""
        
    } catch (error) {
          console.error('Error getting address:', error);
    return '';
    }
}