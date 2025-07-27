import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';

type Props = {
  latitude: number;
  longitude: number;
};

export const StaticMap = ({ latitude, longitude }: Props) => {
  const position: LatLngExpression = [latitude, longitude];

  return (
    <MapContainer
      center={position}
      zoom={15}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%", borderRadius: "12px" }}
      dragging={false}
      doubleClickZoom={false}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://osm.org">OpenStreetMap</a> contributors'
      />
      <Marker position={position}>
        <Popup>Event Location</Popup>
      </Marker>
    </MapContainer>
  );
};
