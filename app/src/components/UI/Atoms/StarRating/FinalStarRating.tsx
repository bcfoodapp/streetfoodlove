import { Container } from "semantic-ui-react";
import styles from "./finalStarRating.module.css";

// stars will be the number of stars given that is retrieved from backend
interface Props {
  starRating: number;
}

export const FinalStarRating = ({ starRating }: Props) => {
  const stylesTest = {
    color: "#c59b08",
  };

  return (
    <Container className={styles.rate}>
      <label htmlFor="star5" title="text">
        <input
          checked={starRating !== null && starRating === 5}
          type="radio"
          id="star5"
          name="rate"
          readOnly
        />
        5 stars
      </label>
      <label htmlFor="star4" title="text">
        <input
          checked={starRating !== null && starRating === 4}
          type="radio"
          id="star4"
          name="rate"
          readOnly
        />
        4 stars
      </label>
      <label htmlFor="star3" title="text">
        <input
          checked={starRating !== null && starRating === 3}
          type="radio"
          id="star3"
          name="rate"
          readOnly
        />
        3 stars
      </label>
      <label htmlFor="star2" title="text">
        <input
          checked={starRating !== null && starRating === 2}
          type="radio"
          id="star2"
          name="rate"
          readOnly
        />
        2 stars
      </label>
      <label htmlFor="star1" title="text">
        <input
          checked={starRating !== null && starRating === 1}
          type="radio"
          id="star1"
          name="rate"
          readOnly
        />
        1 star
      </label>
    </Container>
  );
};
