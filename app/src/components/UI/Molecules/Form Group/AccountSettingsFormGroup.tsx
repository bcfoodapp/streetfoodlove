import React, { useEffect, useState } from "react";
import { Container, Form, Header, Image } from "semantic-ui-react";
import Buttons from "../../Atoms/Button/Buttons";
import styles from "./accountformgroup.module.css";
import {
  useEffectAsync,
  getUserIDFromToken,
  useGetTokenMutation,
  useUpdateUserMutation,
  useUserProtectedQuery,
  getExtension,
  useS3CredentialsMutation,
} from "../../../../api";
import { UserType } from "../../../../api";
import DragAndDrop from "../../Organisms/DragAndDrop/DragAndDrop";
import { v4 as uuid } from "uuid";
import { uploadToS3 } from "../../../../aws";

const AccountSettingsFormGroup: React.FC<{
  disabled: boolean;
  setDisabledForm: (value: boolean) => void;
}> = ({ disabled, setDisabledForm }) => {
  const [getToken] = useGetTokenMutation();
  const [token, setToken] = useState(null as string | null);

  useEffectAsync(async () => {
    const response = await getToken();
    if ("data" in response) {
      setToken(response.data);
    }
  }, []);

  let userID = "";
  if (token) {
    userID = getUserIDFromToken(token as string);
  }
  const {
    data: user,
    isSuccess: userQueryIsSuccess,
    isLoading: userQueryIsLoading,
  } = useUserProtectedQuery(userID, { skip: userID === "" });

  const [updateUser] = useUpdateUserMutation();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [photo, setPhoto] = useState(null as File | null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (userQueryIsSuccess) {
      setEmail(user!.Email);
      setFirstName(user!.FirstName);
      setLastName(user!.LastName);
    }
  }, [userQueryIsSuccess]);

  const [getS3Credentials] = useS3CredentialsMutation();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    let photoID = user!.Photo;
    if (photo) {
      const s3Response = await getS3Credentials(user!.ID);
      if ("error" in s3Response) {
        throw new Error("could not get S3 credentials");
      }

      photoID = `${uuid()}.${getExtension(photo.name)}`;
      await uploadToS3(s3Response.data, photoID, photo);
    }

    const response = await updateUser({
      ID: user!.ID,
      Photo: photoID,
      Username: user!.Username,
      Email: email,
      FirstName: firstName,
      LastName: lastName,
      UserType: UserType.Customer,
      SignUpDate: user!.SignUpDate,
      GoogleID: user!.GoogleID,
    });
    if ("data" in response) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
    setIsSubmitting(false);
  };

  if (token === null) {
    return <p>Not logged in</p>;
  }

  return (
    <Container className={styles.wrapper}>
      <Form onSubmit={handleSubmit}>
        <Form.Group widths={2}>
          <Form.Input
            label="First Name"
            placeholder="First Name"
            disabled={disabled}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            loading={userQueryIsLoading}
          />
          <Form.Input
            label="Last Name"
            placeholder="Last Name"
            disabled={disabled}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            loading={userQueryIsLoading}
          />
          <Form.Input
            label="Email"
            placeholder="Email"
            disabled={disabled}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            loading={userQueryIsLoading}
          />
        </Form.Group>
        <Form.Group>
          <label style={{ width: "100%" }}>
            <Header as="h4">
              Profile picture (Image must be smaller than 500x500)
            </Header>
            <DragAndDrop
              onDrop={(files) => {
                setPhoto(files[0]);
              }}
              multiple={false}
            />
          </label>
        </Form.Group>
        {photo ? <p>{photo.name}</p> : null}
        {user?.Photo ? (
          <label>
            <p>Current profile picture</p>
            <Image
              src={`https://streetfoodlove.s3.us-west-2.amazonaws.com/${user.Photo}`}
              alt="logo"
              style={{ width: 40, height: 40, objectFit: "cover" }}
            />
            <br />
          </label>
        ) : null}
        <Container>
          {userQueryIsSuccess ? (
            <Buttons
              submit
              color="green"
              clicked={() => setDisabledForm(true)}
              loading={isSubmitting}
            >
              Save
            </Buttons>
          ) : null}
        </Container>
      </Form>
      <br />
      {showSuccess ? <p>Updated profile</p> : null}
    </Container>
  );
};

export default AccountSettingsFormGroup;
