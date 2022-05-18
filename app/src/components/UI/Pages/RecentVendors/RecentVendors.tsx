import { useEffect, useState } from "react";
import {
  GeoRectangle,
  useMapViewVendorsQuery,
  useVendorsMultipleQuery,
  Vendor,
} from "../../../../api";
import { Container, Header, Table } from "semantic-ui-react";
import { DateTime } from "luxon";

function VendorList({ vendors }: { vendors: Vendor[] }): React.ReactElement {
  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Location</Table.HeaderCell>
          <Table.HeaderCell></Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {vendors.map((vendor, i) => (
          <Table.Row key={i}>
            <Table.Cell>{vendor.Name}</Table.Cell>
            <Table.Cell>{vendor.BusinessAddress}</Table.Cell>
            <Table.Cell>
              {vendor.LastLocationUpdate > DateTime.now().minus({ week: 1 })
                ? "New to the area!"
                : null}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

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
  const { data: vendorsIDs } = useMapViewVendorsQuery(square!, {
    skip: !square,
  });
  const { data: vendors } = useVendorsMultipleQuery(vendorsIDs!, {
    skip: !vendorsIDs,
  });

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

  return (
    <Container>
      <Header as="h1">Vendors Near You</Header>
      {vendors ? (
        <VendorList
          vendors={[...vendors].sort(
            (a, b) =>
              b.LastLocationUpdate.toSeconds() -
              a.LastLocationUpdate.toSeconds()
          )}
        />
      ) : null}
    </Container>
  );
};
