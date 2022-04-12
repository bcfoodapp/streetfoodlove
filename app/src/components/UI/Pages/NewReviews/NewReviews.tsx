import React, { useState } from "react";
import { Container } from "semantic-ui-react";
import {
  getUserIDFromToken,
  useEffectAsync,
  useGetTokenMutation,
  useVendorByOwnerIDQuery,
  useNewReviewsQuery,
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

  const { data: reviews } = useNewReviewsQuery(userID!, {
    skip: !userID,
  });
  const { data: vendor } = useVendorByOwnerIDQuery(userID!, { skip: !userID });

  if (userID === null) {
    return <p>Not logged in</p>;
  }

  return (
    <Container>
      <h1>New Reviews for {vendor?.Name}</h1>
      {reviews && vendor ? (
        reviews.length > 0 ? (
          reviews.map((review) => (
            <Review review={review} reviewID={review.ID} vendorID={vendor.ID} />
          ))
        ) : (
          <p>No new reviews</p>
        )
      ) : null}
    </Container>
  );
};
