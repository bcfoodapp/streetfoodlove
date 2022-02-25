import { Container, Icon } from "semantic-ui-react";
import Dropzone, { DropzoneProps } from "react-dropzone";
import React, { useState } from "react";
import styles from "./draganddrop.module.css";

interface Props {
  onDrop: Exclude<DropzoneProps["onDropAccepted"], undefined>;
  // true to allow multiple file selections. true is default.
  multiple?: boolean;
}

export default ({ onDrop, multiple }: Props): React.ReactElement => {
  const [showUploadError, setShowUploadError] = useState(false);
  return (
    <>
      <Dropzone
        accept={["image/jpeg", "image/png"]}
        onDropAccepted={(files, event) => {
          setShowUploadError(false);
          onDrop(files, event);
        }}
        onDropRejected={() => setShowUploadError(true)}
        maxSize={1_000_000}
        multiple={multiple}
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
                  Drag-and-drop .jpg/.png files or click to browse
                </p>
              </Container>
            </div>
          );
        }}
      </Dropzone>
      {showUploadError ? (
        <p className={styles.error}>
          File was not accepted. File must be a jpg or png file and under 1 MB.
        </p>
      ) : null}
    </>
  );
};
