import { Container, Grid, Comment } from "semantic-ui-react";
import { ReviewLabel } from "../../Atoms/ReviewLabel/ReviewLabel";
import styles from "./commentCard.module.css";

const CommentCard: React.FC = () => {
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
              {/* <i>Liked by vendor!</i> */}
            </Grid.Row>
            <Grid.Row>
              {/* <pre>{review.Text}</pre> */}
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
    </>
  );
};

export default CommentCard;
