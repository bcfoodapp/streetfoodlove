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
  AWSCredentials,
  Review,
  useUploadToS3Mutation,
} from "../../../api";
import {
  Container,
  Divider,
  Grid,
  Header,
  Image,
  Segment,
} from "semantic-ui-react";
import VendorDetailCards from "../Atoms/VendorDetailCards/VendorDetailCards";
import { Reviews } from "../Organisms/Review/Reviews";
import { ReviewForm } from "../Organisms/ReviewForm/ReviewForm";
import { v4 as uuid } from "uuid";
import { useAppSelector } from "../../../store/root";
import { DateTime } from "luxon";
import Buttons from "../Atoms/Button/Buttons";
import Gallery from "../Organisms/VendorGallery/Gallery";
import styles from "./vendor.module.css";
import { s3Prefix } from "../../../aws";
import { TwitterShareButton, TwitterIcon } from "react-share";
import VendorStar from "../Molecules/VendorStar/VendorStar";

function averageRating(reviews: Review[]): string {
  const ratings = reviews
    .map((review) => review.StarRating)
    .filter((rating) => rating !== null);

  const sum = ratings.reduce((prev, rating) => (rating ? prev + rating : 0), 0);
  return (sum / ratings.length).toFixed(1);
}

/**
 * Displays the vendor page of a vendor, including listed reviews and add review button
 */
export function Vendor(): React.ReactElement {
  const vendorID = useParams().ID as string;
  const { data: vendor } = useVendorQuery(vendorID);
  const { data: reviews } = useReviewsQuery(vendorID);
  const [submitReview] = useCreateReviewMutation();
  const token = useAppSelector((state) => state.token.token);
  const { data: photos } = usePhotosByLinkIDQuery(vendorID);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createPhoto] = useCreatePhotoMutation();
  const [getS3Credentials] = useS3CredentialsMutation();
  const [discountRewarded, setDiscountRewarded] = useState(false);
  const [uploadToS3] = useUploadToS3Mutation();

  const completedReviewHandler = async ({
    text,
    starRating,
    files,
  }: {
    text: string;
    starRating: StarRatingInteger;
    files: File[];
  }) => {
    setIsSubmitting(true);
    const userID = getUserIDFromToken(token!);

    const review = {
      ID: uuid(),
      Text: text,
      DatePosted: DateTime.now(),
      VendorID: vendorID,
      UserID: userID,
      StarRating: starRating,
      ReplyTo: null,
      VendorFavorite: false,
      ReceivedDiscount: false,
    };
    const reviewResponse = await submitReview(review);
    if ("error" in reviewResponse) {
      return;
    }

    setDiscountRewarded(reviewResponse.data.DiscountCreated);

    let s3Credentials = {} as AWSCredentials;

    if (files.length > 0) {
      const s3Response = await getS3Credentials(userID);
      if ("error" in s3Response) {
        throw new Error("could not get S3 credentials");
      }
      s3Credentials = s3Response.data;
    }

    for (const file of files) {
      const photoID = `${uuid()}.${getExtension(file.name)}`;
      await uploadToS3({
        credentials: s3Credentials,
        objectKey: photoID,
        file,
      });
      const photo: Photo = {
        ID: photoID,
        DatePosted: DateTime.now(),
        Text: "",
        LinkID: review.ID,
      };
      const createPhotoResponse = await createPhoto(photo);
      if ("error" in createPhotoResponse) {
        return;
      }
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <Container textAlign="center">
        <br />
        <Grid centered>
          <Grid.Row style={{ display: "flex", alignItems: "center" }}>
            {vendor && vendor.BusinessLogo ? (
              <Image
                src={s3Prefix + vendor.BusinessLogo}
                alt="logo"
                style={{
                  width: 60,
                  height: 60,
                  marginRight: 20,
                  objectFit: "cover",
                }}
              />
            ) : null}
            <Header as="h1" className={styles.name}>
              {vendor?.Name}
            </Header>
            <VendorStar vendorID={vendorID} />
          </Grid.Row>
          <Grid.Row textAlign="center">
            <Container className={styles.shareContainer}>
              <strong className={styles.shareLabel}>Share</strong>
              <TwitterShareButton
                url="https://bcfoodapp.github.io/streetfoodlove/vendors/e72ac985-3d7e-47eb-9f0c-f8e52621a708"
                title="Check out this Vendor!"
              >
                <TwitterIcon size={32} round={true} />
              </TwitterShareButton>
            </Container>
          </Grid.Row>
          <Grid.Row>
            {photos && photos.length > 0 ? (
              <Segment style={{ width: "100%" }}>
                <Gallery photos={photos} photoHeight={250} />
              </Segment>
            ) : null}
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={6}>
              <VendorDetailCards heading="about-us">
                <Container>{vendor?.Description}</Container>
              </VendorDetailCards>
            </Grid.Column>
            <Grid.Column width={6}>
              <VendorDetailCards heading="contact">
                {vendor?.Phone}
                <Container>{vendor?.BusinessHours}</Container>
                <Container>
                  <p>{vendor?.BusinessAddress}</p>
                </Container>
              </VendorDetailCards>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={6}>
              <VendorDetailCards heading="map">
                <p>(Last updated {vendor?.LastLocationUpdate.toRelative()})</p>
                {vendor ? (
                  <iframe
                    style={{ border: 0, width: "100%", height: "118px" }}
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAYGdHFH-OPCSqQkGrQygGw--zgcQWAv3Y&q=${vendor.Latitude},${vendor.Longitude}`}
                    allowFullScreen
                  />
                ) : null}
              </VendorDetailCards>
            </Grid.Column>
            <Grid.Column width={6}>
              <VendorDetailCards heading="website/social media">
                Website: {vendor?.Website}
                <Container>Social Media: {vendor?.SocialMediaLink}</Container>
              </VendorDetailCards>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
      <Divider hidden />
      <Container>
        <Header as="h1">Reviews for {vendor?.Name}</Header>

        {reviews && reviews.length > 0 ? (
          <Header as="h3">
            {averageRating(reviews)} stars (
            {reviews.filter((review) => review.StarRating !== null).length}
            &nbsp;reviews)
          </Header>
        ) : null}

        {reviews?.length === 0 ? (
          <p>No one has posted a review for this vendor. Yet...</p>
        ) : (
          reviews?.map((review, i) => {
            if (review.ReplyTo === null) {
              return (
                <Reviews
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
            <ReviewForm
              finishedFormHandler={completedReviewHandler}
              discountEnabled={vendor ? vendor.DiscountEnabled : false}
            />
          </div>
        )}
        {isSubmitting ? <p>Submitting review...</p> : null}
        {discountRewarded ? (
          <p>
            Discount rewarded. Check your profile settings to view your
            discount.
          </p>
        ) : null}
        <Divider hidden />
        <Divider hidden />
        <Divider hidden />
      </Container>
    </>
  );
}
