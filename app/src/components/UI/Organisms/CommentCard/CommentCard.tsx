import { Container, Grid, Comment, Label, Form } from "semantic-ui-react";
import { ReviewLabel } from "../../Atoms/ReviewLabel/ReviewLabel";
import styles from "./commentCard.module.css";
import { useState } from "react";
import { useAppSelector } from "../../../../store";
import {
  getUserIDFromToken,
  Review as ReviewObj,
  useReviewsQuery,
  useSubmitReviewMutation,
} from "../../../../api";
import { v4 as uuid } from "uuid";
import { DateTime } from "luxon";
import Buttons from "../../Atoms/Button/Buttons";

const CommentCardContainer: React.FC<{
  review?: ReviewObj;
  vendorID: string;
  commentID?: string;
}> = ({ review, vendorID, commentID }) => {
  const reviewsQuery = useReviewsQuery(vendorID);
  const reviews = reviewsQuery.data;

  console.log("reviews: " + JSON.stringify(reviews, null, 2));

  return (
    <Container className={styles.wrapper}>
      {reviews
        ? reviews?.map((element, key) => {
            if (
              element.ReplyTo === review?.ID ||
              element.ReplyTo === commentID
            ) {
              return (
                <CommentCard
                  comment={element.Text}
                  key={key}
                  commentID={element.ID}
                  vendorID={vendorID}
                />
              );
            } else {
              return null;
            }
          })
        : null}
    </Container>
  );
};

export default CommentCardContainer;

//Comment type is from backend

const CommentCard: React.FC<{
  comment: string;
  commentID: string; // id of current comment
  vendorID: string;
  // review: ReviewObj;
}> = ({ comment, commentID, vendorID }) => {
  const [openCommentForm, setOpenCommentForm] = useState(false);
  const [CommentInput, setCommentInput] = useState("");
  const [submitReview] = useSubmitReviewMutation();
  const token = useAppSelector((state) => state.token.token);

  const completedCommentHandler = () => {
    setOpenCommentForm(false);
    if (token === null) {
      throw new Error("token is null");
    }
    const userID = getUserIDFromToken(token);

    submitReview({
      //submitting a new comment, a subtype of review
      ID: uuid(),
      Text: CommentInput,
      DatePosted: DateTime.now(),
      VendorID: vendorID,
      UserID: userID,
      StarRating: null,
      ReplyTo: commentID,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentInput(e.target.value);
  };

  return (
    <>
      <Grid divided celled columns={8} className={styles.row}>
        <Grid.Row>
          <Grid.Column width={1}>
            <ReviewLabel />
          </Grid.Column>
          <Grid.Column width={8}>
            <Grid.Row>
              {/* {user ? <b>{user.FirstName} {user.LastName}</b> : null} */}
              {<b>Colin Zhou</b>}
            </Grid.Row>
            <Grid.Row>
              <pre>{comment}</pre>
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
        <CommentCardContainer commentID={commentID} vendorID={vendorID} />
      </Container>
    </>
  );
};
