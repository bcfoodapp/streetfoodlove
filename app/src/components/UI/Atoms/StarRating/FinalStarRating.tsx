import { Container } from "semantic-ui-react";
import styles from "./starRating.module.css";
import React from "react";
import { Rating } from "semantic-ui-react";
import { StarRatingInteger } from "../../../../api";

// stars will be the number of stars given that is retrieved from backend
interface Props {
  starRating: StarRatingInteger;
}

export const FinalStarRating = ({ starRating }: Props) => {
  let rating = 0;
  if (starRating !== null) {
    rating = starRating;
  }
  return (
    <Container className={styles.rate}>
      <Rating maxRating={5} rating={rating} icon="star" size="huge" disabled />
    </Container>
  );
};
