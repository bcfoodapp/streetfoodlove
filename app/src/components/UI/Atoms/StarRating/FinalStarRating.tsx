import { Container } from "semantic-ui-react";
import styles from "./finalStarRating.module.css";

// stars will be the number of stars given that is retrieved from backend
interface Props {
  stars: number;
}

export const FinalStarRating = (props: Props) => {
  const stylesTest = {
    color: "#c59b08",
  };

  return (
    <Container className={styles.rate}>
      <input type="radio" id="star5" name="rate" value="5" disabled />
      <label htmlFor="star5" title="text">
        5 stars
      </label>
      <input type="radio" id="star4" name="rate" value="4" disabled />
      <label htmlFor="star4" title="text">
        4 stars
      </label>
      <input type="radio" id="star3" name="rate" value="3" checked />
      <label htmlFor="star3" title="text" style={stylesTest}>
        3 stars
      </label>
      <input type="radio" id="star2" name="rate" value="2" checked />
      <label htmlFor="star2" title="text" style={stylesTest}>
        2 stars
      </label>
      <input type="radio" id="star1" name="rate" value="1" checked />
      <label htmlFor="star1" title="text" style={stylesTest}>
        1 star
      </label>
    </Container>
  );
};
