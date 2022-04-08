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
  useCreateReviewMutation,
  usePhotosByLinkIDQuery,
  useUserQuery,
  useVendorByOwnerIDQuery,
  useUpdateReviewMutation,
} from "../../../../api";
import { FinalStarRating } from "../../Atoms/StarRating/FinalStarRating";
import React, { useEffect, useState } from "react";
import Buttons from "../../Atoms/Button/Buttons";
import styleComments from "./script.js";
import CommentCardContainer from "../CommentCard/CommentCard";
import { v4 as uuid } from "uuid";
import { DateTime } from "luxon";
import { useAppSelector } from "../../../../store/root";
import Gallery from "../VendorGallery/Gallery";

interface Props {
  review: ReviewObj;
  reviewID: string; //id of the specific root review
  vendorID: string;
}

/**
 * Displays a review card that contains the information from a completed review of a vendor
 */
export const Review: React.FC<Props> = ({ review, reviewID, vendorID }) => {
  const [openCommentForm, setOpenCommentForm] = useState(false);
  const [CommentInput, setCommentInput] = useState("");
  // const [vendorLiked, setVendorLiked] = useState(false);
  const [submitReview] = useCreateReviewMutation();
  const [submitUpdatedReview] = useUpdateReviewMutation();
  const token = useAppSelector((state) => state.token.token);
  const { data: user } = useUserQuery(review.UserID);
  const { data: photos } = usePhotosByLinkIDQuery(review.ID);

  console.log(review);

  useEffect(() => {
    styleComments();
  }, []);

  let userID = null as string | null;
  if (token) {
    userID = getUserIDFromToken(token);
  }

  const { data: vendor } = useVendorByOwnerIDQuery(userID as string);

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
      VendorFavorite: false,
    });
  };

  const updateFavoriteReviewHandler = () => {
    if (token === null) {
      throw new Error("token is null");
    }
    const userID = getUserIDFromToken(token);

    submitUpdatedReview({
      ID: review.ID,
      Text: review.Text,
      DatePosted: review.DatePosted,
      VendorID: vendorID,
      UserID: userID,
      StarRating: review.StarRating,
      ReplyTo: null,
      VendorFavorite: !review.VendorFavorite,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentInput(e.target.value);
  };

  return (
    <Container className={styles.wrap}>
      <Grid divided celled columns={4} className={styles.row}>
        <Grid.Row>
          <Grid.Column width={1} style={{ padding: 0 }}>
            {user ? <ReviewLabel imageName={user.Photo} /> : null}
          </Grid.Column>
          <Grid.Column width={8}>
            <Grid.Row>
              {user ? (
                <b>
                  {user.FirstName} {user.LastName}
                </b>
              ) : null}

              {vendor ? (
                <Rating
                  icon="heart"
                  defaultRating={+review.VendorFavorite}
                  onRate={() => updateFavoriteReviewHandler()}
                  className={styles.heart}
                />
              ) : (
                <Rating
                  icon="heart"
                  defaultRating={+review.VendorFavorite}
                  className={styles.heart}
                  disabled
                />
              )}
              {review.VendorFavorite ? <i>Liked by vendor!</i> : null}
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
              {photos ? (
                <>
                  <Gallery photos={photos} photoHeight={100} />
                  <br />
                </>
              ) : null}
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
            <Buttons
              color="orange"
              cancel
              clicked={() => setOpenCommentForm(false)}
            >
              Cancel
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
