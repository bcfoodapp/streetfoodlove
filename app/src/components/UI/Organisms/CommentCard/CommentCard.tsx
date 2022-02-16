import { Container, Grid, Comment } from "semantic-ui-react";
import { ReviewLabel } from "../../Atoms/ReviewLabel/ReviewLabel";
import styles from "./commentCard.module.css";
import { useSubmitReviewMutation, useReviewsQuery } from "../../../../api";

const CommentCardContainer: React.FC<{ commentArray: Comment[] }> = ({
  commentArray,
}) => {
  // let filterParentComment = commentArray.filter(comment => comment.id !== comment.parent.id)

  return (
    <>
      {/* {filterParentComment.map((element, key) => {
        return (
          <CommentCard />
        )
      })} */}
    </>
  );
};

export default CommentCardContainer;

//Comment type is from backend

const CommentCard: React.FC<{
  comment: object;
  allComments: typeof Comment[];
}> = (comment, allComments) => {
  // const childComments = () => allComments.filter(c => c.parent_id === comment.id)

  return (
    <>
      <Grid divided celled columns={4} className={styles.row}>
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
              <pre>This is a comment</pre>
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
