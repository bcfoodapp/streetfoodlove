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
          value="5"
          disabled
        />
        5 stars
      </label>
      <label htmlFor="star4" title="text">
        <input
          checked={starRating !== null && starRating === 4}
          type="radio"
          id="star4"
          name="rate"
          value="4"
          disabled
        />
        4 stars
      </label>
      <label htmlFor="star3" title="text" style={stylesTest}>
        <input
          checked={starRating !== null && starRating === 3}
          type="radio"
          id="star3"
          name="rate"
          value="3"
        />
        3 stars
      </label>
      <label htmlFor="star2" title="text" style={stylesTest}>
        <input
          checked={starRating !== null && starRating === 2}
          type="radio"
          id="star2"
          name="rate"
          value="2"
        />
        2 stars
      </label>
      <label htmlFor="star1" title="text" style={stylesTest}>
        <input
          checked={starRating !== null && starRating === 1}
          type="radio"
          id="star1"
          name="rate"
          value="1"
        />
        1 star
      </label>
    </Container>
  );
};
