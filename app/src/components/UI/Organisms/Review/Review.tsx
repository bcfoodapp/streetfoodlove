import { useState } from "react";
import { Container, Grid } from "semantic-ui-react";
import { ReviewLabel } from "../../Atoms/ReviewLabel/ReviewLabel";
import { StarRating } from "../../Atoms/StarRating/StarRating";
import styles from "./review.module.css";
import {Review as ReviewObj} from '../../../../api';

/**
 * Displays a review card that contains the information from a completed review of a vendor
 */

export const Review = (props: {review: ReviewObj}) => {

  const [starRating, setStarRating] = useState(null)

  return (
    <Container className={styles.wrap}>
      <Grid divided celled columns={4}>
        <Grid.Row>
          <Grid.Column width={1}>
            <ReviewLabel />
          </Grid.Column>
          <Grid.Column width={10}>
            <Grid.Row>
              {/* TODO there is no subject on reviews */}
              <h2 className={styles.h2}>hello</h2>
            </Grid.Row>
            <Grid.Row>
              <Container className={styles.stars}>
                <StarRating />
              </Container>
            </Grid.Row>
            <Grid.Row>
              <pre>{props.review.Text}</pre>
            </Grid.Row>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};
