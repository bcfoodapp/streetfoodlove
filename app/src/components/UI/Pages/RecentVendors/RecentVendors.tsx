import { useEffect, useState } from "react";
import { GeoRectangle, useMapViewVendorsQuery } from "../../../../api";

// Returns a square centered at given center and is roughly 10 miles in width.
function getSquare(center: GeolocationCoordinates): GeoRectangle {
  return {
    northWestLat: center.latitude + 0.07246377,
    northWestLng: center.longitude - 0.094339625,
    southEastLat: center.latitude - 0.07246377,
    southEastLng: center.longitude + 0.094339625,
  };
}

/**
 * Displays a list of nearby vendors, sorted by location update, most recent first.
 */
export default (): React.ReactElement => {
  const [square, setSquare] = useState(null as GeoRectangle | null);
  const { data: vendors } = useMapViewVendorsQuery(square!, { skip: !square });
  console.log(vendors);

  useEffect(
    () =>
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSquare(getSquare(position.coords));
        },
        (e) => {
          throw new Error(e.message);
        }
      ),
    []
  );

  return <></>;
};
