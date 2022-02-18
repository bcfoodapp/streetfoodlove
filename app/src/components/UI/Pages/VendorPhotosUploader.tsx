import { Container, Header, Icon } from "semantic-ui-react";
import Dropzone from "react-dropzone";
import React, { useEffect, useState } from "react";
import styles from "./vendorphotoseditor.module.css";
import { useGetTokenMutation, useS3CredentialsMutation } from "../../../api";
import { useAppSelector } from "../../../store";

export default (): React.ReactElement => {
  const [showUploadError, setShowUploadError] = useState(false);
  const [s3Credentials] = useS3CredentialsMutation();
  const [getToken, { isSuccess: tokenIsSuccess }] = useGetTokenMutation();
  useEffect(() => {
    getToken();
  }, []);
  const token = useAppSelector((state) => state.token.token);

  if (!tokenIsSuccess || token === null) {
    return <p>Not logged in</p>;
  }

  return (
    <Container>
      <Header as="h1">Vendor photos</Header>
      <Header as="h3">Image upload</Header>
      <p>
        Upload photos that you want to add to your vendor page here. We only
        accept .jpg files.
        <br />
        <strong>
          Please resize your image to be smaller than 500x500 pixels to minimize
          our AWS bills.
        </strong>
      </p>
      <Dropzone
        accept="image/jpeg"
        onDropAccepted={async (files) => {
          console.log(files);
          setShowUploadError(false);

          await s3Credentials(token);
        }}
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
