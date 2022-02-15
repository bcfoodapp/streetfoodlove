import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useReviewsQuery,
  useVendorQuery,
  useSubmitReviewMutation,
  StarRatingInteger,
  useLazyUsersMultipleQuery,
  User,
  getUserIDFromToken,
  usePhotosByLinkIDQuery,
} from "../../../api";
import { Container, Divider, Grid, Header, Image } from "semantic-ui-react";
import VendorDetailCards from "../Atoms/VendorDetailCards/VendorDetailCards";
import { Review } from "../Organisms/Review/Review";
import { ReviewForm } from "../Organisms/ReviewForm/ReviewForm";
import { v4 as uuid } from "uuid";
import { useAppSelector } from "../../../store";
import { DateTime } from "luxon";
import Buttons from "../Atoms/Button/Buttons";

/**
 * Displays the vendor page of a vendor, including listed reviews and add review button
 */
export function Vendor(): React.ReactElement {
  const vendorID = useParams().ID as string;
  const { data: vendor } = useVendorQuery(vendorID);
  const reviewsQuery = useReviewsQuery(vendorID);
  const reviews = reviewsQuery.data;
  const [submitReview] = useSubmitReviewMutation();
  const token = useAppSelector((state) => state.token.token);
  const [usersMultipleTrigger, { data: users }] = useLazyUsersMultipleQuery();
  const { data: photos } = usePhotosByLinkIDQuery(vendorID);
  const navigate = useNavigate();

  useEffect(() => {
    if (reviewsQuery.isSuccess) {
      usersMultipleTrigger(reviewsQuery.data!.map((r) => r.UserID));
    }
  }, [reviewsQuery.isSuccess]);

  const completedReviewHandler = ({
    text,
    starRating,
  }: {
    text: string;
    starRating: StarRatingInteger;
  }) => {
    if (token === null) {
      throw new Error("token is null");
    }

    const userID = getUserIDFromToken(token);
    submitReview({
      ID: uuid(),
      Text: text,
      DatePosted: DateTime.now(),
      VendorID: vendorID,
      UserID: userID,
      StarRating: starRating,
      ReplyTo: null,
    });
    // Add current user to users list
    usersMultipleTrigger([...reviewsQuery.data!.map((r) => r.UserID), userID]);
  };

  return (
    <>
      <Container textAlign="center">
        <Image.Group size="small">
          {photos?.map((photo, i) => (
            <Image
              key={i}
              src={`https://streetfoodlove.s3.us-west-2.amazonaws.com/${photo.ID}.jpg`}
            />
          ))}
        </Image.Group>
        <Divider hidden />
        <Grid centered>
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
      <Divider hidden />
      <Container>
        <Header as="h1">Reviews for {vendor?.Name}</Header>
        {reviews?.length === 0 ? (
          <p>No one has posted a review for this vendor. Yet...</p>
        ) : (
          reviews?.map((review, i) => {
            let user = null as User | null;
            if (users && review.UserID in users) {
              user = users[review.UserID];
            }
            return <Review key={i} review={review} user={user} />;
          })
        )}
        {token === null ? (
          <Buttons
            color="orange"
            writeReview
            clicked={() => {
              navigate("/signup");
            }}
          >
            Sign up to write a review
          </Buttons>
        ) : (
          <ReviewForm finishedFormHandler={completedReviewHandler} />
        )}
      </Container>
    </>
  );
}
