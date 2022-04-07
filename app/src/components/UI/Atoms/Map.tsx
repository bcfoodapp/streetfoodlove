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
import {
  useMapViewVendorsQuery,
  useSearchQuery,
  useVendorsMultipleQuery,
} from "../../../api";
import { useAppSelector } from "../../../store/root";
import { icon, latLng, latLngBounds } from "leaflet";

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

  useEffect(() => {
    // Get initial vendors
    handler();
    // Get current coordinates
    map.locate({ setView: true, maxZoom: 12, maximumAge: 10_000 });
  }, []);

  // Get vendors when map moves
  useMapEvents({
    moveend: handler,
  });

  const vendorIDsQuery = useMapViewVendorsQuery(bounds);
  let vendorIDs = [] as string[];
  if (vendorIDsQuery.data) {
    vendorIDs = vendorIDsQuery.data;
  }

  const { data: vendors } = useVendorsMultipleQuery(vendorIDs);

  const searchQuery = useAppSelector(({ search }) => search.searchQuery);
  const { data: resultVendors } = useSearchQuery(searchQuery!, {
    skip: !searchQuery,
  });

  useEffect(() => {
    if (resultVendors && resultVendors.length > 0) {
      const bounds = latLngBounds(
        resultVendors.map((vendor) => latLng(vendor.Latitude, vendor.Longitude))
      );
      map.fitBounds(bounds, { maxZoom: 14, padding: [25, 25] });
    }
  }, [resultVendors]);

  return (
    <>
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        detectRetina
      />
      {vendors
        ? vendors.map((vendor) => {
            let iconUrl = "/streetfoodlove/marker-icon-blue.png";
            let opacity = 1.0;
            if (resultVendors) {
              if (resultVendors.some(({ ID }) => ID === vendor.ID)) {
                iconUrl = "/streetfoodlove/marker-icon-red.png";
              } else {
                opacity = 0.7;
              }
            }

            const defaultIcon = icon({
              iconUrl,
              iconRetinaUrl: iconUrl,
              shadowUrl: "/streetfoodlove/marker-shadow.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              tooltipAnchor: [16, -28],
              shadowSize: [41, 41],
            });

            return (
              <Marker
                key={vendor.ID}
                position={[vendor.Latitude, vendor.Longitude]}
                riseOnHover
                icon={defaultIcon}
                opacity={opacity}
              >
                <Popup>
                  <PopupInfo vendor={vendor} />
                </Popup>
              </Marker>
            );
          })
        : null}
    </>
  );
}

export default function Map(): React.ReactElement {
  return (
    <MapContainer
      center={[47.584401, -122.14819]}
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
