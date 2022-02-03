import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useReviewsQuery,
  useVendorQuery,
  useSubmitReviewMutation,
  StarRatingInteger,
  useLazyUsersMultipleQuery,
  User,
  getUserIDFromToken,
} from "../../../api";
import { Container, Grid } from "semantic-ui-react";
import Buttons from "../Atoms/Button/Buttons";
import styles from "./vendor.module.css";
import VendorDetailCards from "../Atoms/VendorDetailCards/VendorDetailCards";
import { Review } from "../Organisms/Review/Review";
import { ReviewForm } from "../Organisms/ReviewForm/ReviewForm";
import { v4 as uuid } from "uuid";
import { useAppSelector } from "../../../store";
import { DateTime } from "luxon";
import jwtDecode from "jwt-decode";

/**
 * Displays the vendor page of a vendor, including listed reviews and add review button
 */
export function Vendor(): React.ReactElement {
  const vendorID = useParams().ID as string;
  const { data: vendor } = useVendorQuery(vendorID);
  const reviewsQuery = useReviewsQuery(vendorID);
  const reviews = reviewsQuery.data;
  const [submitReview] = useSubmitReviewMutation();
  const [openReviewForm, setOpenReviewForm] = useState(false);
  const error = useAppSelector((state) => state.root.error);
  const token = useAppSelector((state) => state.token.token);
  const [usersMultipleTrigger, { data: users }] = useLazyUsersMultipleQuery();

  useEffect(() => {
    if (reviewsQuery.isSuccess) {
      usersMultipleTrigger(reviewsQuery.data!.map((r) => r.UserID));
    }
  }, [reviewsQuery.isSuccess]);

  const openReviewHandler = () => {
    setOpenReviewForm(true);
  };

  const cancelReviewHandler = () => {
    setOpenReviewForm(false);
  };

  const completedReviewHandler = ({
    text,
    starRating,
  }: {
    text: string;
    starRating: StarRatingInteger;
  }) => {
    if (token === null) {
      throw new Error("not logged in");
    }

    const userID = getUserIDFromToken(token);
    submitReview({
      ID: uuid(),
      Text: text,
      DatePosted: DateTime.now(),
      VendorID: vendorID,
      UserID: userID,
      StarRating: starRating,
    });
    // Add current user to users list
    usersMultipleTrigger([...reviewsQuery.data!.map((r) => r.UserID), userID]);
  };

  return (
    <>
      <Container className={styles.wrapper}>
        <Grid>
          <Grid.Row>
            <Grid.Column width={6}>
              <VendorDetailCards heading="about-us">
                Name: {vendor?.Name}
              </VendorDetailCards>
            </Grid.Column>
            <Grid.Column width={6}>
              <VendorDetailCards heading="contact">
                {vendor?.Phone}
              </VendorDetailCards>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={6}>
              <VendorDetailCards heading="address">
                {vendor?.BusinessAddress}
              </VendorDetailCards>
            </Grid.Column>
            <Grid.Column width={6}>
              <VendorDetailCards heading="map">
                {vendor ? (
                  <iframe
                    frameBorder="0"
                    style={{ border: 0, width: "100%", height: "100%" }}
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAYGdHFH-OPCSqQkGrQygGw--zgcQWAv3Y&q=${vendor.Latitude},${vendor.Longitude}`}
                    allowFullScreen
                  />
                ) : null}
              </VendorDetailCards>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
      {openReviewForm ? (
        <ReviewForm
          cancelFormHandler={cancelReviewHandler}
          finishedFormHandler={completedReviewHandler}
        />
      ) : (
        <Container className={styles.textArea}>
          <Buttons color="orange" writeReview clicked={openReviewHandler}>
            Write Review
          </Buttons>
        </Container>
      )}
      {/* Temporary error output */}
      <pre>{error ? error.toString() : ""}</pre>
      <Container className={styles.reviews}>
        {reviews?.map((review, i) => {
          let user = null as User | null;
          if (users && review.UserID in users) {
            user = users[review.UserID];
          }
          return <Review key={i} review={review} user={user} />;
        })}
      </Container>
    </>
  );
}
