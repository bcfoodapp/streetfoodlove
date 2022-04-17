import React, { useState } from "react";
import styles from "./popupInfo.module.css";
import {
  Review,
  usePhotosByLinkIDQuery,
  useReviewsQuery,
  Vendor,
} from "../../../../api";
import { Link } from "react-router-dom";
import { Container, Header, Image } from "semantic-ui-react";
import { s3Prefix } from "../../../../aws";
import { FinalStarRating } from "../StarRating/FinalStarRating";

interface Props {
  vendor: Vendor;
}

// Chooses a highly rated review to display on popup.
function selectReview(reviews: Review[] | undefined): Review | null {
  if (reviews && reviews.length > 0) {
    const found = reviews.find(
      (review) => review.StarRating && review.StarRating >= 4
    );
    if (found) {
      return found;
    }

    return reviews[0];
  }
  return null;
}

function averageRating(reviews: Review[] | undefined): string | null {
  if (reviews && reviews.length > 0) {
    let avgRating = 0;

    for (const review of reviews) {
      if (review.StarRating) {
        avgRating += review.StarRating;
      }
    }

    return (avgRating / reviews.length).toFixed(1);
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
  let averageReviewRating = null as string | null;

  averageReviewRating = averageRating(reviews);

  if (showReview) {
    displayedReview = selectReview(reviews);
  }

  return (
    <>
      <Container>
        <Container className={styles.title}>
          <Link to={`/vendors/${vendor.ID}`}>{vendor.Name}</Link>
        </Container>
      </Container>
      {reviews && reviews?.length > 0 ? (
        <h5>{reviews?.length} Reviews</h5>
      ) : (
        <h5>No Reviews</h5>
      )}
      {averageReviewRating ? (
        <h5 className={styles.avgRating}>
          Average Rating: {averageReviewRating}
        </h5>
      ) : (
        <h5 className={styles.avgRating}>Average Rating: Not Yet Rated</h5>
      )}
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
