import { Container, RatingProps } from "semantic-ui-react";
import styles from "./starRating.module.css";
import { ChangeEvent } from "react";
import { StarRatingInteger } from "../../../../api";
import { Rating } from "semantic-ui-react";

interface Props {
  starRating: StarRatingInteger | null;
  setStarRating: (rating: RatingProps) => void;
}

/**
 * This element represents the star rating that appears in the review form
 */
export const StarRating = ({ starRating, setStarRating }: Props) => {
  const trackStarCount = (e: any, rating: RatingProps) => {
    setStarRating(rating);
  };

  return (
    <Container className={styles.starRatingCtn}>
      <Rating
        maxRating={5}
        defaultRating={0}
        icon="star"
        size="huge"
        onRate={trackStarCount}
      />
    </Container>
  );
};
