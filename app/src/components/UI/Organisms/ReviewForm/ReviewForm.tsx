import React, { useState } from "react";
import { Container, Form, Header, TextArea } from "semantic-ui-react";
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
}

export const ReviewForm = (props: Props) => {
  const [textAreaInput, setTextAreaInput] = useState("");
  const [starRating, setStarRating] = useState(null as StarRatingInteger);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaInput(e.target.value);
  };

  const handleSubmit = () => {
    // TODO make sure user selects a rating

    if (starRating === null) {
      throw new Error("starRating is null");
    }

    props.finishedFormHandler({
      text: textAreaInput,
      starRating,
    });
  };

  return (
    <Container>
      <Container>
        <Header as="h4">Write a review</Header>
        <Container>
          <StarRating starRating={starRating} setStarRating={setStarRating} />
        </Container>
      </Container>
      <Form onSubmit={handleSubmit}>
        <Container>
          <TextArea
            placeholder="Write your review here..."
            style={{ minHeight: 60, maxWidth: 700 }}
            value={textAreaInput}
            onChange={handleChange}
          />
        </Container>
        <Container className={styles.buttons}>
          <Buttons submit color="green">
            Submit Review
          </Buttons>
        </Container>
      </Form>
    </Container>
  );
};
