import { Container, RatingProps } from "semantic-ui-react";
import styles from "./starRating.module.css";
import { StarRatingInteger } from "../../../../api";
import { Rating } from "semantic-ui-react";

interface Props {
  // starRating is null if not set
  starRating: StarRatingInteger | null;
  setStarRating: (rating: StarRatingInteger) => void;
}

/**
 * This element represents the star rating that appears in the review form
 */
export const StarRating = ({ starRating, setStarRating }: Props) => {
  const trackStarCount = (_: any, rating: RatingProps) => {
    if (
      !(
        rating.rating &&
        Number.isInteger(rating.rating) &&
        1 <= rating.rating &&
        rating.rating <= 5
      )
    ) {
      throw new Error(`unexpected rating value: ${rating.rating}`);
    }
    setStarRating(rating.rating as StarRatingInteger);
  };

  let value = 0;
  if (starRating !== null) {
    value = starRating;
  }

  return (
    <Container className={styles.starRatingCtn}>
      <Rating
        maxRating={5}
        icon="star"
        size="huge"
        rating={value}
        onRate={trackStarCount}
      />
    </Container>
  );
};
