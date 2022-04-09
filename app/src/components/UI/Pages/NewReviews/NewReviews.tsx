import React, { useState } from "react";
import { Container } from "semantic-ui-react";
import {
  getUserIDFromToken,
  useEffectAsync,
  useGetTokenMutation,
  useVendorByOwnerIDQuery,
  Review as ReviewObj,
} from "../../../../api";
import { Review } from "../../Organisms/Review/Review";

export default (): React.ReactElement => {
  const [getToken] = useGetTokenMutation();
  const [userID, setUserID] = useState(null as string | null);

  useEffectAsync(async () => {
    const response = await getToken();
    if ("data" in response && response.data) {
      setUserID(getUserIDFromToken(response.data));
    }
  }, []);

  const { data: vendor } = useVendorByOwnerIDQuery(userID!, {
    skip: !userID,
  });

  const review = {
    Text: "Text",
    StarRating: 5,
    VendorID: vendor?.ID,
  } as ReviewObj;

  if (userID === null) {
    return <p>Not logged in</p>;
  }

  return (
    <Container>
      <h1>New Reviews for {vendor?.Name}</h1>
      {vendor ? (
        <Review review={review} reviewID={""} vendorID={vendor.ID} />
      ) : null}
    </Container>
  );
};
