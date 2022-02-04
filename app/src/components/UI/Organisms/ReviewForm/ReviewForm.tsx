import React, { useState } from "react";
import { Container, Form, TextArea } from "semantic-ui-react";
import { StarRating } from "../../Atoms/StarRating/StarRating";
import Buttons from "../../Atoms/Button/Buttons";
import styles from "./reviewForm.module.css";
import { StarRatingInteger } from "../../../../api";

/**
 * Renders a review form template that includes fields to be filled out
 */

interface Props {
  finishedFormHandler: (review: {
    text: string;
    starRating: StarRatingInteger;
  }) => void;
  // cancelFormHandler: () => void;
  closeReviewHandler: () => void;
}

export const ReviewForm = (props: Props) => {
  const [textAreaInput, setTextAreaInput] = useState("");
  const [starRating, setStarRating] = useState(
    null as StarRatingInteger | null
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaInput(e.target.value);
  };

  const handleSubmit = () => {
    // TODO make sure user selects a rating

    props.closeReviewHandler();
    if (starRating === null) {
      throw new Error("starRating is null");
    }

    props.finishedFormHandler({
      text: textAreaInput,
      starRating,
    });
  };

  return (
    <Container className={styles.wrapper}>
      <Container>
        <h4>Select a Rating</h4>
        <Container className={styles.starrating}>
          <StarRating starRating={starRating} setStarRating={setStarRating} />
        </Container>
      </Container>
      <Form onSubmit={handleSubmit}>
        <Container>
          <TextArea
            placeholder="Write Review here..."
            style={{ minHeight: 60, maxWidth: 700 }}
            value={textAreaInput}
            onChange={handleChange}
          />
        </Container>
        <Container className={styles.buttons}>
          <Buttons cancel clicked={props.closeReviewHandler}>
            Cancel
          </Buttons>
          <Buttons submit color="green">
            Submit Review
          </Buttons>
        </Container>
      </Form>
    </Container>
  );
};
