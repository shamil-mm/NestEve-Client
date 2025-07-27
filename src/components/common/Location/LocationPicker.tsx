import L from 'leaflet';
import "leaflet/dist/leaflet.css"
import { useEffect, useRef, useState } from 'react';
import {MapContainer,TileLayer,Marker,useMap} from 'react-leaflet'
import {  getGeoAddress, searchLocation } from '../../../utils/geocode';
import { fetchUserData, saveLocation } from '../../../services/authServices';
import { useAppSelector } from '../../../hooks/AuthHook';
import { toast } from 'react-fox-toast';

const DefaultIcon = L.icon({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon=DefaultIcon


const LocationPicker = () => {
    const [query,setQuery]=useState("")
    const [suggestions,setSuggestions]=useState<any[]>([])
    const [location,setLocation]=useState<{lat:number,lng:number}>({
        lat:10.8505,
        lng:76.2711,
    })
    const isManualSelection=useRef(false)
    const queryFromServer =useRef(false)
    
    
    const id = useAppSelector((state) => state.authUser?.user?.id)

     useEffect(()=>{
        const fetchSuggestions = async()=>{
           const res=await searchLocation(query)
            setSuggestions(res)
        }
        if(queryFromServer.current){
          queryFromServer.current=false;
          return;
        }
      
        if(isManualSelection.current){
          console.log('manual selection is working')
            isManualSelection.current=false
            return
        }
        const delayDebouce=setTimeout(fetchSuggestions,600);
        return ()=>clearTimeout(delayDebouce)
    },[query])


    useEffect(() => {
        const fetchUser = async () => {
    
          const user = await fetchUserData(id as string)
          if (user) {
               setLocation({
            lat:parseFloat(user.location.coordinates[1]),
            lng:parseFloat(user.location.coordinates[0])
        })

       const georesp= await getGeoAddress(user.location.coordinates[1],user.location.coordinates[0])
       queryFromServer.current=true
       setQuery(georesp)
       
          }
        }
        fetchUser()
      }, [id])


    const RecenterMap=({lat,lng}:{lat:number;lng:number})=>{

        const map=useMap()
        useEffect(()=>{
            map.setView([lat,lng],map.getZoom())
        },[lat,lng,map])
        return null
    }


   

     const handleSelectSuggestions=(suggestion:any)=>{
        if (!suggestion.lat || !suggestion.lon) return;
        isManualSelection.current=true
        setLocation({
            lat:parseFloat(suggestion.lat),
            lng:parseFloat(suggestion.lon)
        })
        setSuggestions([])
        setQuery(suggestion.display_name)
     }


     const handleSaveLocation=async()=>{
        // const res=await getGeoAddress(location.lat,location.lng);
        const res=await saveLocation(location,id as string)
        toast.success(res.data)
        
     }
    
  return (
    <div className='w-full max-w-3xl mx-auto'>
       <div className="relative w-full mb-4">
  <input
    type="text"
    className="w-full px-3 py-2 border border-gray-300 rounded"
    placeholder="Enter a location..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
  />

  {suggestions.length > 0 && (
    <ul className="absolute z-20 w-full left-0 top-full bg-black  rounded mt-1 max-h-60 overflow-y-auto">
      {suggestions.map((sug, idx) => (
        <li
          key={idx}
          className="p-2 cursor-pointer text-white"
          onClick={() => handleSelectSuggestions(sug)}
        >
          {sug.display_name}
        </li>
      ))}
    </ul>
  )}
</div>

<div className="relative z-10">
  <MapContainer
    center={[location.lat, location.lng]}
    zoom={13}
    scrollWheelZoom={false}
    style={{ height: "300px", width: "100%", borderRadius:'5px'}}
  >
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <Marker position={[location.lat, location.lng]} />
    <RecenterMap lat={location.lat} lng={location.lng} />
  </MapContainer>
</div>
        <div className='mt-4 text-white'>
            <button 
             className='mt-2 bg-blue-600 px-4 py-2 rounded text-white'
             onClick={handleSaveLocation}
             > Save location
            </button>
        </div>
    </div>
  )
}

export default LocationPicker
