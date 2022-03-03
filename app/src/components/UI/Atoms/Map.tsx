import React, { useEffect, useState } from "react";
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
import { MapOptions } from "leaflet";

function MapContent(): React.ReactElement {
  const [bounds, setBounds] = useState({
    northWestLat: 0,
    northWestLng: 0,
    southEastLat: 0,
    southEastLng: 0,
  });
  const map = useMap();
  const handler = () => {
    const bounds = map.getBounds();
    setBounds({
      northWestLat: bounds.getNorthWest().lat,
      northWestLng: bounds.getNorthWest().lng,
      southEastLat: bounds.getSouthEast().lat,
      southEastLng: bounds.getSouthEast().lng,
    });
  };

  // Gets initial vendors
  useEffect(handler, []);
  // Gets vendors when map moves
  useMapEvents({
    moveend: handler,
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
        detectRetina
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
  const [center, setCenter] = useState([
    47.584401, -122.14819,
  ] as MapOptions["center"]);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        setCenter([position.coords.latitude, position.coords.longitude]),
      (error) => console.error(error)
    );
  }, []);

  return (
    <MapContainer
      key={center?.toString()}
      center={center}
      zoom={12}
      style={{
        height: "90.3vh",
        width: "100%",
        marginTop: 2.9,
        zIndex: 0,
      }}
    >
      <MapContent />
    </MapContainer>
  );
}
