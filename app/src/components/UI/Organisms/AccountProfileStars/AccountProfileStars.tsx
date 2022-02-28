import {
  getUserIDFromToken,
  useEffectAsync,
  useGetTokenMutation,
  useStarsByUserIDQuery,
  useVendorQuery,
} from "../../../../api";
import React, { useState } from "react";

interface VendorNameProps {
  vendorID: string;
}

function VendorName({ vendorID }: VendorNameProps): React.ReactElement {
  const { data: vendor } = useVendorQuery(vendorID);
  return <p>{vendor?.Name}</p>;
}

export default (): React.ReactElement => {
  const [getToken] = useGetTokenMutation();
  const [token, setToken] = useState(null as string | null);

  useEffectAsync(async () => {
    const response = await getToken();
    if ("data" in response) {
      setToken(response.data);
    }
  }, []);

  let userID = "";
  if (token) {
    userID = getUserIDFromToken(token as string);
  }

  const { data: stars } = useStarsByUserIDQuery(userID, {
    skip: userID === "",
  });

  if (!token) {
    return <p>Not logged in</p>;
  }

  return (
    <>
      {stars?.map((star, index) => (
        <VendorName key={index} vendorID={star.VendorID} />
      ))}
    </>
  );
};
