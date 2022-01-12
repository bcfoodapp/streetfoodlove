import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import PopupInfo from "./PopupInfo/PopupInfo";
import { Vendor } from "../../../api";

export default function Map(): React.ReactElement {
  // Test data
  const vendors: Vendor[] = [
    {
      ID: "1",
      Name: "1",
      BusinessAddress: "",
      Website: "",
      BusinessHours: "",
      Phone: "",
      BusinessLogo: "",
      Latitude: 47.585423,
      Longitude: -122.142773,
    },
    {
      ID: "2",
      Name: "2",
      BusinessAddress: "",
      Website: "",
      BusinessHours: "",
      Phone: "",
      BusinessLogo: "",
      Latitude: 47.57591,
      Longitude: -122.139772,
    },
  ];

  return (
    <MapContainer
      center={[47.584401, -122.14819]}
      zoom={14}
      style={{
        height: "100vh",
        width: "140vw",
        marginLeft: -310,
        marginTop: -11,
      }}
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        detectRetina={true}
      />
      {vendors.map((vendor) => (
        <Marker position={[vendor.Latitude, vendor.Longitude]}>
          <Popup>
            <PopupInfo vendor={vendor} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
