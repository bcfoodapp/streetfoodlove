import React, { useState } from "react";
import { Container, Form, TextArea } from "semantic-ui-react";
import { StarRating } from "../../Atoms/StarRating/StarRating";
import Buttons from "../../Atoms/Button/Buttons";
import styles from "./reviewForm.module.css";

/**
 * Renders a review form template that includes fields to be filled out
 */

interface Props {
  finishedFormHandler: (review: { Text: string }) => void;
  cancelFormHandler: () => void;
}

export const ReviewForm = (props: Props) => {
  const [textAreaInput, setTextAreaInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaInput(e.target.value);
  };

  const handleSubmit = () => {
    const review = {
      Text: textAreaInput,
    };
    props.finishedFormHandler(review);
  };

  return (
    <Container className={styles.wrapper}>
      <Container>
        <h4>Select a Rating</h4>
        <Container className={styles.starrating}>
          <StarRating />
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
          <Buttons cancel clicked={props.cancelFormHandler}>
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
