import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import PopupInfo from "./PopupInfo/PopupInfo";

export default function Map(): React.ReactElement {
  const position: LatLngExpression = [51.505, -0.09];

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "400px", width: "600px" }}
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        detectRetina={true}
      />
      <Marker position={position}>
        <Popup>
          <PopupInfo />
        </Popup>
      </Marker>
    </MapContainer>
  );
}
