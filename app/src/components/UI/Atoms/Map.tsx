import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import PopupInfo from "./PopupInfo/PopupInfo";
import { useMapViewVendorsQuery } from "../../../api";

function MapContent(): React.ReactElement {
  const [bounds, setBounds] = useState({
    northWestLat: 0,
    northWestLng: 0,
    southEastLat: 0,
    southEastLng: 0,
  });
  const map = useMap();
  useMapEvents({
    moveend: () => {
      const bounds = map.getBounds();
      setBounds({
        northWestLat: bounds.getNorthWest().lat,
        northWestLng: bounds.getNorthWest().lng,
        southEastLat: bounds.getSouthEast().lat,
        southEastLng: bounds.getSouthEast().lng,
      });
    },
  });
  const vendorIDs = useMapViewVendorsQuery(bounds);

  return (
    <>
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        detectRetina={true}
      />
      {/*{vendors.map((vendor) => (*/}
      {/*  <Marker position={[vendor.Latitude, vendor.Longitude]}>*/}
      {/*    <Popup>*/}
      {/*      <PopupInfo vendor={vendor} />*/}
      {/*    </Popup>*/}
      {/*  </Marker>*/}
      {/*))}*/}
    </>
  );
}

export default function Map(): React.ReactElement {
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
      <MapContent />
    </MapContainer>
  );
}
