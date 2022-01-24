import { Container, Grid } from "semantic-ui-react";
import { ReviewLabel } from "../../Atoms/ReviewLabel/ReviewLabel";
import styles from "./review.module.css";
import { Review as ReviewObj, User } from "../../../../api";
import { FinalStarRating } from "../../Atoms/StarRating/FinalStarRating";
import React from "react";

interface Props {
  review: ReviewObj;
  // user is null if it has not loaded yet.
  user: User | null;
}

/**
 * Displays a review card that contains the information from a completed review of a vendor
 */
export const Review: React.FC<Props> = ({ review, user }) => {
  return (
    <Container className={styles.wrap}>
      <Grid divided celled columns={4}>
        <Grid.Row>
          <Grid.Column width={1}>
            <ReviewLabel />
          </Grid.Column>
          <Grid.Column width={10}>
            <Grid.Row>
              {user ? `${user.FirstName} ${user.LastName}` : null}
            </Grid.Row>
            <Grid.Row>
              <Container className={styles.stars}>
                <FinalStarRating starRating={review.StarRating} />
              </Container>
            </Grid.Row>
            <Grid.Row>
              <pre>{review.Text}</pre>
            </Grid.Row>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};
