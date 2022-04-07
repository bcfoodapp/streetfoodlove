import React, { useState } from "react";
import styles from "./popupInfo.module.css";
import {
  Review,
  usePhotosByLinkIDQuery,
  useReviewsQuery,
  Vendor,
} from "../../../../api";
import { Link } from "react-router-dom";
import { Container, Header, Image, Rating } from "semantic-ui-react";
import { s3Prefix } from "../../../../aws";
import { FinalStarRating } from "../StarRating/FinalStarRating";

interface Props {
  vendor: Vendor;
}

function selectReview(reviews: Review[] | undefined): Review | null {
  if (reviews && reviews.length > 0) {
    const found = reviews.find(
      (review) => review.StarRating && review.StarRating >= 4
    );
    if (found) {
      return found;
    } else {
      return reviews[0];
    }
  }
  return null;
}

/**
 * This component is for storing the vendor information in the popups that appear on the map
 */
export default function PopupInfo({ vendor }: Props): React.ReactElement {
  const [showReview] = useState(() => Math.random() > 0.7);

  const { data: photos } = usePhotosByLinkIDQuery(vendor.ID);
  const { data: reviews } = useReviewsQuery(vendor.ID);

  let displayedReview = null as Review | null;
  if (showReview) {
    displayedReview = selectReview(reviews);
  }

  return (
    <>
      <Container className={styles.header}>
        <Container className={styles.title}>
          <Link to={`/vendors/${vendor.ID}`}>{vendor.Name}</Link>
        </Container>
      </Container>
      {displayedReview ? (
        <>
          <FinalStarRating starRating={displayedReview.StarRating} />
          <Header as="h4">{displayedReview.Text}</Header>
        </>
      ) : photos && photos.length > 0 ? (
        <Image
          src={s3Prefix + photos[0].ID}
          alt={photos[0].Text}
          style={{ height: 200 }}
        />
      ) : null}
    </>
  );
}
