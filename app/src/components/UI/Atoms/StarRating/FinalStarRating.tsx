import { Container } from "semantic-ui-react";
import styles from "./finalStarRating.module.css";
import React, { RefObject, useCallback, useEffect } from "react";

// stars will be the number of stars given that is retrieved from backend
interface Props {
  starRating: number;
}

export const FinalStarRating = ({ starRating = 1 }: Props) => {
  const stylesTest = {
    color: "#c59b08",
  };

  //use effect will color in the proper number of stars according to the starRating passed in as a prop.
  useEffect(() => {
    let labels = Array.prototype.slice
      .call(document.querySelectorAll(".starLabel"))
      .reverse();

    for (let i = 0; i < starRating; i++) {
      labels[i].style.color = "#c59b08";
    }
  }, []);

  return (
    <Container className={styles.rate}>
      <label htmlFor="star5" title="text" className="starLabel">
        <input
          checked={starRating !== null && starRating === 5}
          type="radio"
          id="star5"
          name="rate"
          disabled
        />
        5 stars
      </label>
      <label htmlFor="star4" title="text" className="starLabel">
        <input
          checked={starRating !== null && starRating === 4}
          type="radio"
          id="star4"
          name="rate"
          disabled
        />
        4 stars
      </label>
      <label htmlFor="star3" title="text" className="starLabel">
        <input
          checked={starRating !== null && starRating === 3}
          type="radio"
          id="star3"
          name="rate"
          disabled
        />
        3 stars
      </label>
      <label htmlFor="star2" title="text" className="starLabel">
        <input
          checked={starRating !== null && starRating === 2}
          type="radio"
          id="star2"
          name="rate"
          disabled
        />
        2 stars
      </label>
      <label
        htmlFor="star1"
        title="text"
        style={stylesTest}
        className="starLabel"
      >
        <input
          checked={starRating !== null && starRating === 1}
          type="radio"
          id="star1"
          name="rate"
          value={"1"}
          disabled
        />
        1 star
      </label>
    </Container>
  );
};
