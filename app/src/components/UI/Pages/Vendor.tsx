import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useReviewsQuery,
  useVendorQuery,
  useCreateReviewMutation,
  StarRatingInteger,
  getUserIDFromToken,
  usePhotosByLinkIDQuery,
  useCreatePhotoMutation,
  Photo,
  useS3CredentialsMutation,
  getExtension,
} from "../../../api";
import { Container, Divider, Grid, Header, Segment } from "semantic-ui-react";
import VendorDetailCards from "../Atoms/VendorDetailCards/VendorDetailCards";
import { Review } from "../Organisms/Review/Review";
import { ReviewForm } from "../Organisms/ReviewForm/ReviewForm";
import { v4 as uuid } from "uuid";
import { useAppSelector } from "../../../store";
import { DateTime } from "luxon";
import Buttons from "../Atoms/Button/Buttons";
import Gallery from "../Organisms/VendorGallery/Gallery";
import styles from "./vendor.module.css";
import { uploadToS3 } from "../../../aws";

/**
 * Displays the vendor page of a vendor, including listed reviews and add review button
 */
export function Vendor(): React.ReactElement {
  const vendorID = useParams().ID as string;
  const { data: vendor } = useVendorQuery(vendorID);
  const reviewsQuery = useReviewsQuery(vendorID);
  const reviews = reviewsQuery.data;
  const [submitReview] = useCreateReviewMutation();
  const token = useAppSelector((state) => state.token.token);
  const { data: photos } = usePhotosByLinkIDQuery(vendorID);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createPhoto] = useCreatePhotoMutation();
  const [getS3Credentials] = useS3CredentialsMutation();

  const completedReviewHandler = async ({
    text,
    starRating,
    files,
  }: {
    text: string;
    starRating: StarRatingInteger;
    files: File[];
  }) => {
    if (token === null) {
      throw new Error("token is null");
    }

    setIsSubmitting(true);
    const userID = getUserIDFromToken(token);
    const reviewID = uuid();
    const s3Response = await getS3Credentials(userID);
    if ("error" in s3Response) {
      throw new Error("could not get S3 credentials");
    }

    for (const file of files) {
      const photoID = `${uuid()}.${getExtension(file.name)}`;
      await uploadToS3(s3Response.data, photoID, file);
      const photo: Photo = {
        ID: photoID,
        DatePosted: DateTime.now(),
        Text: "",
        LinkID: reviewID,
      };
      const createPhotoResponse = await createPhoto(photo);
      if ("error" in createPhotoResponse) {
        return;
      }
    }
    const review = {
      ID: reviewID,
      Text: text,
      DatePosted: DateTime.now(),
      VendorID: vendorID,
      UserID: userID,
      StarRating: starRating,
      ReplyTo: null,
    };
    await submitReview(review);
    setIsSubmitting(false);
  };

  return (
    <>
      <Container textAlign="center">
        <Grid centered>
          <Grid.Row>
            <h1 className={styles.name}>{vendor?.Name}</h1>
          </Grid.Row>
          <Grid.Row>
            {photos ? (
              <Segment style={{ width: "100%" }}>
                <Gallery photos={photos} photoHeight={250} />
              </Segment>
            ) : null}
          </Grid.Row>
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
            if (review.ReplyTo === null) {
              return (
                <Review
                  key={i}
                  review={review}
                  reviewID={review.ID}
                  vendorID={review.VendorID}
                />
              );
            }
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
          <div style={{ maxWidth: "700px" }}>
            <ReviewForm finishedFormHandler={completedReviewHandler} />
          </div>
        )}
        {isSubmitting ? <p>Submitting review...</p> : null}
        <Divider hidden />
      </Container>
    </>
  );
}
