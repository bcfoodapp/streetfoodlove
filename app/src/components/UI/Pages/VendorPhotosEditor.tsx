import { Container, Header, Segment } from "semantic-ui-react";
import Dropzone from "react-dropzone";
import React from "react";

export default (): React.ReactElement => {
  return (
    <Container>
      <Header as="h1">Vendor photos</Header>
      <Segment>
        <Dropzone onDrop={(files) => console.log(files)}>
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <p>
                Drag-and-drop pictures you want to upload here, or click to
                browse
              </p>
            </div>
          )}
        </Dropzone>
      </Segment>
    </Container>
  );
};
