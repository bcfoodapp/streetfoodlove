import { Container } from "semantic-ui-react";
import styles from "./starRating.module.css";
import { MouseEvent, useState } from "react";

/**
 * This element represents the star rating that appears in the review form
 */

export const StarRating = () => {
  const [starRating, setStarRating] = useState(null)

  //defaultvalue is string, eg "3"
  const trackStarCount = (e: MouseEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (target.value === "5") {
      // setStarRating(5)
    } else if (target.value === "4") {
    } else if (target.value === "3") {
    } else if (target.value === "2") {
    } else {
    }
  };

  return (
    <Container className={styles.rate}>
      <input
        type="radio"
        id="star5"
        name="rate"
        value="5"
        onClick={trackStarCount}
      />
      <label htmlFor="star5" title="text">
        5 stars
      </label>
      <input
        type="radio"
        id="star4"
        name="rate"
        value="4"
        onClick={trackStarCount}
      />
      <label htmlFor="star4" title="text">
        4 stars
      </label>
      <input
        type="radio"
        id="star3"
        name="rate"
        value="3"
        onClick={trackStarCount}
      />
      <label htmlFor="star3" title="text">
        3 stars
      </label>
      <input
        type="radio"
        id="star2"
        name="rate"
        value="2"
        onClick={trackStarCount}
      />
      <label htmlFor="star2" title="text">
        2 stars
      </label>
      <input
        type="radio"
        id="star1"
        name="rate"
        value="1"
        onClick={trackStarCount}
      />
      <label htmlFor="star1" title="text">
        1 star
      </label>
    </Container>
  );
};
