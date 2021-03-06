import {
  getUserIDFromToken,
  useEffectAsync,
  useGetTokenMutation,
  useStarsByUserIDQuery,
  useVendorQuery,
} from "../../../../api";
import React, { useState } from "react";
import { Header } from "semantic-ui-react";

export function VendorName({
  vendorID,
}: {
  vendorID: string;
}): React.ReactElement {
  const { data: vendor } = useVendorQuery(vendorID);
  return <p>{vendor?.Name}</p>;
}

export default (): React.ReactElement => {
  const [getToken] = useGetTokenMutation();
  const [userID, setUserID] = useState(null as string | null);

  useEffectAsync(async () => {
    const response = await getToken();
    if ("data" in response && response.data) {
      setUserID(getUserIDFromToken(response.data));
    }
  }, []);

  const { data: stars } = useStarsByUserIDQuery(userID!, {
    skip: !userID,
  });

  if (userID === null) {
    return <p>Not logged in</p>;
  }

  return (
    <>
      <Header as="h1">Stars</Header>
      {stars?.map((star, index) => (
        <VendorName key={index} vendorID={star.VendorID} />
      ))}
    </>
  );
};
