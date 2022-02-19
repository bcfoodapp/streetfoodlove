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
import {
  getUserIDFromToken,
  Review as ReviewObj,
  useGuideQuery,
  User,
  useSubmitReviewMutation,
} from "../../../../api";
import { FinalStarRating } from "../../Atoms/StarRating/FinalStarRating";
import React, { useEffect, useState } from "react";
import Buttons from "../../Atoms/Button/Buttons";
import CommentCard from "../CommentCard/CommentCard";
import styleComments from "./script.js";
import CommentCardContainer from "../CommentCard/CommentCard";
import { v4 as uuid } from "uuid";
import { DateTime } from "luxon";
import { useAppSelector } from "../../../../store";

interface Props {
  review: ReviewObj;
  // user is null if it has not loaded yet.
  user: User | null;
  reviewID: string; //id of the specific root review
  vendorID: string;
}

/**
 * Displays a review card that contains the information from a completed review of a vendor
 */
export const Review: React.FC<Props> = ({
  review,
  user,
  reviewID,
  vendorID,
}) => {
  const [openCommentForm, setOpenCommentForm] = useState(false);
  const [CommentInput, setCommentInput] = useState("");
  const [submitReview] = useSubmitReviewMutation();
  const token = useAppSelector((state) => state.token.token);

  useEffect(() => {
    styleComments();
  }, []);

  const completedCommentHandler = () => {
    setOpenCommentForm(false);
    if (token === null) {
      throw new Error("token is null");
    }
    const userID = getUserIDFromToken(token);

    submitReview({
      //submitting comment, a subtype of review
      ID: uuid(),
      Text: CommentInput,
      DatePosted: DateTime.now(),
      VendorID: vendorID,
      UserID: userID,
      StarRating: null,
      ReplyTo: reviewID,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentInput(e.target.value);
  };

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
          <Form
            reply
            className={styles.replyForm}
            onSubmit={completedCommentHandler}
          >
            <Form.TextArea
              className={styles.replyFormArea}
              onChange={handleChange}
            />
            <Buttons color="green" submit>
              Comment
            </Buttons>
          </Form>
        ) : null}
      </Container>
      <Container>
        {" "}
        <CommentCardContainer review={review} vendorID={review.VendorID} />
      </Container>
    </Container>
  );
};
