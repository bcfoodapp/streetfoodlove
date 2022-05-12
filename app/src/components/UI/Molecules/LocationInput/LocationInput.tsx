import React, { useState } from "react";
import { Dropdown, Form, Input } from "semantic-ui-react";
import {
  AWSCredentials,
  useLazyAddressToCoordinatesQuery,
  useLocationRoleMutation,
} from "../../../../api";
import Buttons from "../../Atoms/Button/Buttons";
import { LatLngTuple } from "leaflet";

export type LocationInputDropdownValue = "address" | "coordinates";

interface Props {
  userID: string;
  onBlur: (event: React.FocusEvent<Input>) => void;
  dropdownOption: LocationInputDropdownValue;
  onDropdownOptionChange: (value: LocationInputDropdownValue) => void;
  businessAddress: string;
  onBusinessAddressChange: (address: string) => void;
  coordinates: LatLngTuple;
  onCoordinateChange: (coordinate: LatLngTuple) => void;
  error: boolean;
  loading: boolean;
}

// For inputting location data. Has a dropdown menu and either an address input or get coordinates
// button.
export default ({
  userID,
  onBlur,
  dropdownOption,
  onDropdownOptionChange,
  businessAddress,
  onBusinessAddressChange,
  coordinates,
  onCoordinateChange,
  error,
  loading,
}: Props): React.ReactElement => {
  // Credentials to use for addressToCoordinates(). It is null when uninitialized.
  const [locationRole, setLocationRole] = useState(
    null as AWSCredentials | null
  );

  const [getLocationRole] = useLocationRoleMutation();
  const [
    addressToCoordinates,
    {
      data: addressToCoordinatesResult,
      isLoading: addressToCoordinatesIsLoading,
    },
  ] = useLazyAddressToCoordinatesQuery();

  const onAddressBlur = async (e) => {
    onBlur(e);

    let credentials = locationRole;
    if (!credentials) {
      const locationRoleResponse = await getLocationRole(userID);
      if ("error" in locationRoleResponse) {
        return;
      }
      credentials = locationRoleResponse.data;
      setLocationRole(credentials);
    }

    await addressToCoordinates({
      credentials,
      text: e.target.value,
    });
  };

  const onGetCoordinates = async () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onCoordinateChange([
          position.coords.latitude,
          position.coords.longitude,
        ]);
      },
      (e) => {
        throw new Error(e.message);
      }
    );
  };

  let input = <></>;

  switch (dropdownOption) {
    case "address":
      input = (
        <Form.Input
          name="businessAddress"
          onChange={(_, { value }) => onBusinessAddressChange(value)}
          placeholder="Business Address"
          onBlur={onAddressBlur}
          error={error}
          value={businessAddress}
          loading={loading || addressToCoordinatesIsLoading}
          required
        />
      );
      break;
    case "coordinates":
      input = (
        <Buttons getLocation clicked={onGetCoordinates} type="button" fluid>
          Get my coordinates
        </Buttons>
      );
      break;
  }

  let displayedCoordinates = coordinates;
  if (addressToCoordinatesResult) {
    displayedCoordinates = addressToCoordinatesResult;
  }

  return (
    <>
      <Dropdown
        options={[
          { value: "address", text: "Use address" },
          { value: "coordinates", text: "Use my coordinates" },
        ]}
        onChange={(_, { value }) => {
          onDropdownOptionChange(value as LocationInputDropdownValue);
        }}
        value={dropdownOption}
        placeholder="Location input options"
        fluid
        selection
      />
      {input}
      <p>
        Current coordinate: {displayedCoordinates[0].toFixed(6)},&nbsp;
        {displayedCoordinates[1].toFixed(6)}
      </p>
    </>
  );
};
