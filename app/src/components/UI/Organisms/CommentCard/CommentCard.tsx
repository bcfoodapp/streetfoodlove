import { Container, Grid, Comment } from "semantic-ui-react";
import { ReviewLabel } from "../../Atoms/ReviewLabel/ReviewLabel";
import styles from "./commentCard.module.css";
// import { useSubmitReviewMutation, useReviewsQuery, Review } from "../../../../api";
import { getUserIDFromToken, Review as ReviewObj, useGuideQuery, User, useReviewsQuery, useSubmitReviewMutation } from "../../../../api";

const CommentCardContainer: React.FC<{ review: ReviewObj, vendorID: string }> = ({
  review,
  vendorID
}) => {
  const reviewsQuery = useReviewsQuery(vendorID);
  const reviews = reviewsQuery.data;

  return (
    <Container className={styles.wrapper}>
      {reviews?.map((element, key) => {
        if (element.ReplyTo === review.ID) {
          return (
            <CommentCard comment={element.Text} key={key}/>
          )
        }
      })}
    </Container>
  );
};

export default CommentCardContainer;

//Comment type is from backend

const CommentCard: React.FC<{
  comment: string;
  // allComments: typeof Comment[];
}> = ({comment}) => {
  // const childComments = () => allComments.filter(c => c.parent_id === comment.id)

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
                <Comment.Action className={styles.reply}>Reply</Comment.Action>
              </Comment.Actions>
            </Grid.Row>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      {/* {childComments.map((element, key) => {
        return (
          <CommentCard />
        )
      })} */}
    </>
  );
};
