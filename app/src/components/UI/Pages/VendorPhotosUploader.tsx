import { Container, Header, Segment } from "semantic-ui-react";
import React, { useState } from "react";
import {
  AWSCredentials,
  getUserIDFromToken,
  Photo,
  useCreatePhotoMutation,
  useGetTokenMutation,
  usePhotosByLinkIDQuery,
  useS3CredentialsMutation,
  useVendorByOwnerIDQuery,
  useEffectAsync,
  getExtension,
  useUploadToS3Mutation,
} from "../../../api";
import Gallery from "../Organisms/VendorGallery/Gallery";
import { v4 as uuid } from "uuid";
import { DateTime } from "luxon";
import DragAndDrop from "../Organisms/DragAndDrop/DragAndDrop";

export default (): React.ReactElement => {
  const [uploading, setUploading] = useState(false);
  const [getToken, { isSuccess: tokenIsSuccess }] = useGetTokenMutation();
  const [userID, setUserID] = useState(null as string | null);

  useEffectAsync(async () => {
    const response = await getToken();
    if ("data" in response && response.data) {
      setUserID(getUserIDFromToken(response.data));
    }
  }, []);

  const { data: vendor, isLoading: vendorQueryIsLoading } =
    useVendorByOwnerIDQuery(userID!, { skip: !userID });

  const { data: photos, isLoading: photosIsLoading } = usePhotosByLinkIDQuery(
    vendor ? vendor.ID : "",
    { skip: !vendor }
  );

  const [getS3Credentials, { isLoading: s3CredentialsIsLoading }] =
    useS3CredentialsMutation();
  const [s3Credentials, setS3Credentials] = useState(
    null as AWSCredentials | null
  );
  const [uploadToS3] = useUploadToS3Mutation();

  useEffectAsync(async () => {
    if (userID) {
      const response = await getS3Credentials(userID);
      if ("data" in response) {
        setS3Credentials(response.data);
      }
    }
  }, [userID]);

  const [createPhoto] = useCreatePhotoMutation();

  const onDrop = async (files: File[]) => {
    for (const file of files) {
      setUploading(true);
      const photoID = `${uuid()}.${getExtension(file.name)}`;

      if (s3Credentials === null) {
        throw new Error("s3Credentials is null");
      }

      await uploadToS3({
        credentials: s3Credentials,
        objectKey: photoID,
        file,
      });
      const photo: Photo = {
        ID: photoID,
        Text: "",
        DatePosted: DateTime.now(),
        // Dropzone can only be used if vendor is defined
        LinkID: vendor!.ID,
      };
      await createPhoto(photo);
      setUploading(false);
    }
  };

  if (userID === null) {
    return <p>Not logged in</p>;
  }

  return (
    <Container>
      <Header as="h1">Vendor photos</Header>
      {vendorQueryIsLoading || photosIsLoading ? (
        <p>Loading</p>
      ) : photos ? (
        <Segment style={{ width: "100%" }}>
          <Gallery photos={photos} photoHeight={150} />
        </Segment>
      ) : null}
      <Header as="h3">Image upload</Header>
      <p>
        Upload photos that you want to add to your vendor page here.
        <br />
        <strong>
          Please resize your image to be smaller than 500x500 pixels to minimize
          our AWS bills.
        </strong>
      </p>
      {s3CredentialsIsLoading ? (
        <p>Getting AWS credentials</p>
      ) : vendor ? (
        <DragAndDrop onDrop={onDrop} multiple />
      ) : (
        <p>Vendor loading</p>
      )}
      {uploading ? <p>Uploading</p> : null}
    </Container>
  );
};
