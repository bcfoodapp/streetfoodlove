import {
  getUserIDFromToken,
  useDiscountsByUserQuery,
  useEffectAsync,
  useGetTokenMutation,
} from "../../../../api";
import React, { useState } from "react";
import { Header } from "semantic-ui-react";
import { VendorName } from "../AccountProfileStars/AccountProfileStars";
import { Link } from "react-router-dom";

export default (): React.ReactElement => {
  const [getToken] = useGetTokenMutation();
  const [userID, setUserID] = useState(null as string | null);

  useEffectAsync(async () => {
    const response = await getToken();
    if ("data" in response && response.data) {
      setUserID(getUserIDFromToken(response.data));
    }
  }, []);

  const { data: discounts } = useDiscountsByUserQuery(userID!, {
    skip: !userID,
  });

  if (userID === null) {
    return <p>Not logged in</p>;
  }

  return (
    <>
      <Header as="h1">Discounts</Header>
      <p>Select a vendor to claim the discount.</p>
      {discounts?.map((discount, i) => (
        <Link to={`/account-profile/discount/${discount.ID}`}>
          <VendorName key={i} vendorID={discount.VendorID} />
        </Link>
      ))}
    </>
  );
};
