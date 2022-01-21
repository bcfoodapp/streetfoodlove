import { Container } from "semantic-ui-react";
import styles from "./starRating.module.css";
import React, { RefObject, useCallback, useEffect } from "react";
import { Rating } from 'semantic-ui-react'

// stars will be the number of stars given that is retrieved from backend
interface Props {
  starRating: number;
}

export const FinalStarRating = ({ starRating = 3 }: Props) => {

  return (
    <Container className={styles.rate}>
      <Rating maxRating={5} defaultRating={starRating} icon='star' size='huge' disabled/>
    </Container>
  );
};
