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
import { useMapViewVendorsQuery, useVendorsMultipleQuery } from "../../../api";
import styles from "./map.module.css";

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
  const vendorIDsQuery = useMapViewVendorsQuery(bounds);
  let vendorIDs = [] as string[];
  if (vendorIDsQuery.data) {
    vendorIDs = vendorIDsQuery.data;
  }

  const vendors = useVendorsMultipleQuery(vendorIDs);

  return (
    <>
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        detectRetina={true}
      />
      {vendors.data
        ? vendors.data.map((vendor) => (
            <Marker
              position={[vendor.Latitude, vendor.Longitude]}
              key={vendor.ID}
            >
              <Popup>
                <PopupInfo vendor={vendor} />
              </Popup>
            </Marker>
          ))
        : null}
    </>
  );
}

export default function Map(): React.ReactElement {
  return (
    <MapContainer
      center={[47.584401, -122.14819]}
      zoom={14}
      style={{
        height: "92.5vh",
        width: "100vw",
        marginLeft: -434,
        marginTop: -2,
        zIndex: 0,
      }}
    >
      <MapContent />
    </MapContainer>
  );
}
