// EventLocationPicker.tsx
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { searchLocation } from '../../../utils/geocode';

const DefaultIcon = L.icon({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface Props {
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
}

const EventLocationPicker: React.FC<Props> = ({ onLocationSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [location, setLocation] = useState({ lat: 10.8505, lng: 76.2711 });
  const isManualSelection = useRef(false);
  const queryFromServer = useRef(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim() === '') return;
      const res = await searchLocation(query);
      setSuggestions(res);
    };

    if (queryFromServer.current) {
      queryFromServer.current = false;
      return;
    }

    if (isManualSelection.current) {
      isManualSelection.current = false;
      return;
    }

    const debounce = setTimeout(fetchSuggestions, 600);
    return () => clearTimeout(debounce);
  }, [query]);

  const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
    const map = useMap();
    useEffect(() => {
      map.setView([lat, lng], map.getZoom());
    }, [lat, lng, map]);
    return null;
  };

  const handleSelectSuggestion = async (suggestion: any) => {
    if (!suggestion.lat || !suggestion.lon) return;
    isManualSelection.current = true;
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    const address = suggestion.display_name;

    setLocation({ lat, lng });
    setQuery(address);
    setSuggestions([]);
    onLocationSelect?.({ lat, lng, address });
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative w-full mb-4">
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded"
          placeholder="Enter a location..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {suggestions && suggestions.length > 0 && (
          <ul className="absolute z-20 w-full left-0 top-full bg-black rounded mt-1 max-h-60 overflow-y-auto">
            {suggestions.map((sug, idx) => (
              <li
                key={idx}
                className="p-2 cursor-pointer text-white hover:bg-gray-700"
                onClick={() => handleSelectSuggestion(sug)}
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
          style={{ height: '300px', width: '100%', borderRadius: '5px' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[location.lat, location.lng]} />
          <RecenterMap lat={location.lat} lng={location.lng} />
        </MapContainer>
      </div>
    </div>
  );
};

export default EventLocationPicker;
