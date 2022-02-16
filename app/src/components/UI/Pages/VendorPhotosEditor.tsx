import { Container, Header, Icon } from "semantic-ui-react";
import Dropzone from "react-dropzone";
import React, { useState } from "react";
import styles from "./vendorphotoseditor.module.css";

export default (): React.ReactElement => {
  const [showUploadError, setShowUploadError] = useState(false);

  return (
    <Container>
      <Header as="h1">Vendor photos</Header>
      <Header as="h3">Image upload</Header>
      <p>
        Upload photos you want to add to your vendor page here.
        <br />
        We only accept .jpg files. Please resize your image to be smaller than
        500x500 pixels to minimize our AWS bills.
      </p>
      <Dropzone
        accept="image/jpeg"
        onDropAccepted={(files) => {
          console.log(files);
          setShowUploadError(false);
        }}
        onDropRejected={() => setShowUploadError(true)}
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
                  Drag-and-drop image files or click to browse
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
    </Container>
  );
};
