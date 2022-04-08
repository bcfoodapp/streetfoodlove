import React, { useState } from "react";
import { Container, Form, Header, Icon, TextArea } from "semantic-ui-react";
import { StarRating } from "../../Atoms/StarRating/StarRating";
import Buttons from "../../Atoms/Button/Buttons";
import styles from "./reviewForm.module.css";
import { StarRatingInteger } from "../../../../api";
import DragAndDrop from "../DragAndDrop/DragAndDrop";

/**
 * Renders a review form template that includes fields to be filled out
 */

interface Props {
  finishedFormHandler: (review: {
    text: string;
    starRating: StarRatingInteger;
    files: File[];
  }) => void;
}

export const ReviewForm = (props: Props) => {
  const [textAreaInput, setTextAreaInput] = useState("");
  const [starRating, setStarRating] = useState(null as StarRatingInteger);
  const [files, setFiles] = useState([] as File[]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaInput(e.target.value);
  };

  const handleSubmit = () => {
    if (starRating === null) {
      throw new Error("starRating is null");
    }

    props.finishedFormHandler({
      text: textAreaInput,
      starRating,
      files,
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
        <TextArea
          placeholder="Write your review here..."
          value={textAreaInput}
          onChange={handleChange}
        />
        <p>
          <strong>Attach pictures</strong>
        </p>
        <DragAndDrop
          onDrop={(files: File[]) => {
            setFiles((state) => [...state, ...files]);
          }}
          multiple
        />
        {files.map((file, i) => (
          <p key={i}>{file.name}</p>
        ))}
        <Container className={styles.buttons}>
          <Buttons submit color="green" valid={starRating !== null}>
            Submit Review
          </Buttons>
        </Container>
      </Form>
    </Container>
  );
};
