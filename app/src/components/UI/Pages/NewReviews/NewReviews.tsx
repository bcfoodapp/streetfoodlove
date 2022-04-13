import React, { useState } from "react";
import { Container } from "semantic-ui-react";
import {
  getUserIDFromToken,
  useEffectAsync,
  useGetTokenMutation,
  useVendorByOwnerIDQuery,
  useNewReviewsQuery,
  useUserProtectedQuery,
  useUpdateUserMutation,
} from "../../../../api";
import { Review } from "../../Organisms/Review/Review";
import Buttons from "../../Atoms/Button/Buttons";

export default (): React.ReactElement => {
  const [getToken] = useGetTokenMutation();
  const [userID, setUserID] = useState(null as string | null);

  useEffectAsync(async () => {
    const response = await getToken();
    if ("data" in response && response.data) {
      setUserID(getUserIDFromToken(response.data));
    }
  }, []);

  const { data: reviews } = useNewReviewsQuery(userID!, { skip: !userID });
  const { data: vendor } = useVendorByOwnerIDQuery(userID!, { skip: !userID });
  const { data: user } = useUserProtectedQuery(userID!, { skip: !userID });
  const [updateUser] = useUpdateUserMutation();

  if (userID === null) {
    return <p>Not logged in</p>;
  }

  return (
    <Container>
      <h1>New Reviews for {vendor?.Name}</h1>
      {reviews && vendor ? (
        reviews.length > 0 ? (
          <>
            {reviews.map((review, i) => (
              <Review
                key={i}
                review={review}
                reviewID={review.ID}
                vendorID={vendor.ID}
              />
            ))}
            {user ? (
              <Buttons
                login
                clicked={() => {
                  // Update LastReviewSeen to latest review
                  updateUser({
                    ...user,
                    LastReviewSeen: reviews[0].ID,
                  });
                }}
              >
                Mark all as read
              </Buttons>
            ) : null}
          </>
        ) : (
          <p>No new reviews</p>
        )
      ) : null}
    </Container>
  );
};
