import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useReviewsQuery,
  useVendorQuery,
  useSubmitReviewMutation,
  StarRatingInteger,
} from "../../../api";
import { Container, Grid } from "semantic-ui-react";
import Buttons from "../Atoms/Button/Buttons";
import styles from "./vendor.module.css";
import VendorDetailCards from "../Atoms/VendorDetailCards/VendorDetailCards";
import HeaderBar from "../Molecules/HeaderBar/HeaderBar";
import { Review } from "../Organisms/Review/Review";
import { ReviewForm } from "../Organisms/ReviewForm/ReviewForm";
import { v4 as uuid } from "uuid";
import { useSelector } from "react-redux";
import { RootState, useAppSelector } from "../../../store";
import { DateTime } from "luxon";
import jwtDecode from "jwt-decode";

/**
 * Displays the vendor page of a vendor, including listed reviews and add review button
 */
export function Vendor(): React.ReactElement {
  // const [completedFormData, setCompletedFormData] = useState({});
  const vendorID = useParams().ID as string;
  const vendorQuery = useVendorQuery(vendorID);
  const reviewsQuery = useReviewsQuery(vendorID);
  const [submitReview] = useSubmitReviewMutation();
  const [openReviewForm, setOpenReviewForm] = useState(false);
  const error = useSelector<RootState, RootState["root"]["error"]>(
    (state) => state.root.error
  );
  const token = useAppSelector((state) => state.token.token);

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

    submitReview({
      ID: uuid(),
      Text: text,
      DatePosted: DateTime.now(),
      VendorID: vendorID,
      UserID: jwtDecode<{ UserID: string }>(token).UserID,
      StarRating: starRating,
    });
  };

  console.log(reviewsQuery.data);

  return (
    <>
      <HeaderBar />
      <Container className={styles.wrapper}>
        <Grid>
          <Grid.Row>
            <Grid.Column width={6}>
              <VendorDetailCards heading="about-us">
                Name: {vendorQuery.data?.Name}
              </VendorDetailCards>
            </Grid.Column>
            <Grid.Column width={6}>
              <VendorDetailCards heading="contact">
                {vendorQuery.data?.Phone}
              </VendorDetailCards>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={6}>
              <VendorDetailCards heading="address">
                {vendorQuery.data?.BusinessAddress}
              </VendorDetailCards>
            </Grid.Column>
            <Grid.Column width={6}>
              <VendorDetailCards heading="map">Map Image</VendorDetailCards>
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
        {reviewsQuery.data?.map((review, i) => (
          <Review review={review} key={i} />
        ))}
      </Container>
    </>
  );
}
