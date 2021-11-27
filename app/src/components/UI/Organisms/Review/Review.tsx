import { Container, Grid } from "semantic-ui-react";
import { ReviewLabel } from "../../Atoms/ReviewLabel/ReviewLabel";
import { StarRating } from "../../Atoms/StarRating/StarRating";
import styles from "./review.module.css";

/**
 * Displays a review card that contains the information from a completed review of a vendor
 */

export const Review = () => {
  return (
    <Container className={styles.wrap}>
      <Grid divided celled columns={4}>
        <Grid.Row>
          <Grid.Column width={1}>
            <ReviewLabel />
          </Grid.Column>
          <Grid.Column width={10}>
            <Grid.Row>
              <h2 className={styles.h2}>hello</h2>
            </Grid.Row>
            <Grid.Row>
              <Container className={styles.stars}>
                <StarRating />
              </Container>
            </Grid.Row>
            <Grid.Row>
              <pre>This is the best place that I've ever eaten!</pre>
            </Grid.Row>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};
