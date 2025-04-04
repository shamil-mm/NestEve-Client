import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useState } from "react";

const GOOGLE_MAPS_API_KEY = "AIzaSyCVrvXDuNBAsYCtPnoedLnoBt6EegqYEUQ";
const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 11.0513, // Malappuram Latitude
  lng: 76.0711, // Malappuram Longitude
};
const MapIntegration = () => {
    const [center, setCenter] = useState(defaultCenter);
  return (
    <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Event Location</label>
            <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={12}
              >
                <Marker position={center} />
              </GoogleMap>
            </LoadScript>
          </div>
  )
}

export default MapIntegration
