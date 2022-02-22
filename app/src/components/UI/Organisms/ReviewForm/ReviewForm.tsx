import React, { useState } from "react";
import { Container, Form, Header, Icon, TextArea } from "semantic-ui-react";
import { StarRating } from "../../Atoms/StarRating/StarRating";
import Buttons from "../../Atoms/Button/Buttons";
import styles from "./reviewForm.module.css";
import { StarRatingInteger } from "../../../../api";
import Dropzone from "react-dropzone";

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
  const [showUploadError, setShowUploadError] = useState(false);

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

  const onDrop = async (files: File[]) => {
    setShowUploadError(false);
    setFiles((state) => [...state, ...files]);
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
          style={{ minHeight: 60, maxWidth: 700 }}
          value={textAreaInput}
          onChange={handleChange}
        />
        <p>Attach pictures</p>
        <Dropzone
          accept="image/jpeg"
          onDropAccepted={onDrop}
          onDropRejected={() => setShowUploadError(true)}
          maxSize={1_000_000}
        >
          {({ getRootProps, getInputProps, isDragAccept }) => {
            let dragAndDropStyles = styles.dragAndDrop;
            if (isDragAccept) {
              dragAndDropStyles += " " + styles.accept;
            }
            return (
              <div className={dragAndDropStyles} {...getRootProps()}>
                <input {...getInputProps()} />
                <Container textAlign="center">
                  <p>
                    <Icon name="upload" />
                    Drag-and-drop .jpg files or click to browse
                  </p>
                </Container>
              </div>
            );
          }}
        </Dropzone>
        {showUploadError ? (
          <p className={styles.error}>
            This is not a jpg file. Only .jpg files are accepted.
          </p>
        ) : null}
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
