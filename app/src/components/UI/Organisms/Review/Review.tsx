import {
  Container,
  Grid,
  Rating,
  Comment,
  Form,
  Label,
} from "semantic-ui-react";
import { ReviewLabel } from "../../Atoms/ReviewLabel/ReviewLabel";
import styles from "./review.module.css";
import { Review as ReviewObj, User } from "../../../../api";
import { FinalStarRating } from "../../Atoms/StarRating/FinalStarRating";
import React, { useEffect, useState } from "react";
import Buttons from "../../Atoms/Button/Buttons";
import CommentCard from "../CommentCard/CommentCard";
import styleComments from "./script.js";
import CommentCardContainer from "../CommentCard/CommentCard";

interface Props {
  review: ReviewObj;
  // user is null if it has not loaded yet.
  user: User | null;
}

/**
 * Displays a review card that contains the information from a completed review of a vendor
 */
export const Review: React.FC<Props> = ({ review, user }) => {
  const [openCommentForm, setOpenCommentForm] = useState(false);

  useEffect(() => {
    styleComments();
  }, []);

  return (
    <Container className={styles.wrap}>
      <Grid divided celled columns={4} className={styles.row}>
        <Grid.Row>
          <Grid.Column width={1}>
            <ReviewLabel />
          </Grid.Column>
          <Grid.Column width={8}>
            <Grid.Row>
              {user ? (
                <b>
                  {user.FirstName} {user.LastName}
                </b>
              ) : null}
              <Rating
                icon="heart"
                defaultRating={1}
                disabled
                className={styles.heart}
              />
              <i>Liked by vendor!</i>
            </Grid.Row>
            <Grid.Row>
              <Container className={styles.stars}>
                <FinalStarRating starRating={review.StarRating} />
              </Container>
            </Grid.Row>
            <Grid.Row>
              <pre>{review.Text}</pre>
            </Grid.Row>
            <Grid.Row>
              <Comment.Actions>
                <Label id="test" onClick={() => setOpenCommentForm(true)}>
                  <Comment.Action className={styles.reply} active>
                    Reply
                  </Comment.Action>
                </Label>
              </Comment.Actions>
            </Grid.Row>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Container>
        {openCommentForm ? (
          <Form reply className={styles.replyForm}>
            <Form.TextArea className={styles.replyFormArea} />
            <Buttons
              color="green"
              submit
              clicked={() => setOpenCommentForm(false)}
            >
              Comment
            </Buttons>
          </Form>
        ) : null}
      </Container>
      <Container>{/* <CommentCardContainer /> */}</Container>
    </Container>
  );
};
