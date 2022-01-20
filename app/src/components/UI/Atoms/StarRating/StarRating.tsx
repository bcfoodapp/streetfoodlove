import { Container } from "semantic-ui-react";
import styles from "./starRating.module.css";
import {ChangeEvent} from 'react';
import {StarRatingInteger} from "../../../../api";

/**
 * This element represents the star rating that appears in the review form
 */

interface Props {
  starRating: StarRatingInteger | null,
  setStarRating: (rating: StarRatingInteger) => void,
}

export const StarRating = ({starRating, setStarRating}: Props) => {
  const trackStarCount = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (target.value === "5") {
      setStarRating(5);
    } else if (target.value === "4") {
      setStarRating(4);
    } else if (target.value === "3") {
      setStarRating(3);
    } else if (target.value === "2") {
      setStarRating(2);
    } else if (target.value === "1") {
      setStarRating(1);
    } else {
      throw new Error("unexpected value");
    }
  };

  return (
    <Container className={styles.rate}>
      <input
        type="radio"
        id="star5"
        name="rate"
        value="5"
        onChange={trackStarCount}
        checked={starRating !== null && starRating >= 5}
      />
      <label htmlFor="star5" title="text">
        5 stars
      </label>
      <input
        type="radio"
        id="star4"
        name="rate"
        value="4"
        onChange={trackStarCount}
        checked={starRating !== null && starRating >= 4}
      />
      <label htmlFor="star4" title="text">
        4 stars
      </label>
      <input
        type="radio"
        id="star3"
        name="rate"
        value="3"
        onChange={trackStarCount}
        checked={starRating !== null && starRating >= 3}
      />
      <label htmlFor="star3" title="text">
        3 stars
      </label>
      <input
        type="radio"
        id="star2"
        name="rate"
        value="2"
        onChange={trackStarCount}
        checked={starRating !== null && starRating >= 2}
      />
      <label htmlFor="star2" title="text">
        2 stars
      </label>
      <input
        type="radio"
        id="star1"
        name="rate"
        value="1"
        onChange={trackStarCount}
        checked={starRating !== null && starRating >= 1}
      />
      <label htmlFor="star1" title="text">
        1 star
      </label>
    </Container>
  );
};
