import React, { useEffect, useState } from "react";
import { Container, Form } from "semantic-ui-react";
import Buttons from "../../Atoms/Button/Buttons";
import styles from "./accountformgroup.module.css";
import {
  useEffectAsync,
  getUserIDFromToken,
  useGetTokenMutation,
  useUpdateUserMutation,
  useUserProtectedQuery,
} from "../../../../api";
import { UserType } from "../../../../api";
import DragAndDrop from "../../Organisms/DragAndDrop/DragAndDrop";

const AccountSettingsFormGroup: React.FC<{
  disabled: boolean;
  setDisabledForm: (value: boolean) => void;
}> = ({ disabled, setDisabledForm }) => {
  const [getToken, { isSuccess: tokenIsSuccess }] = useGetTokenMutation();
  const [token, setToken] = useState(null as string | null);
  const [logoFile, setLogoFile] = useState(null as File | null);

  useEffectAsync(async () => {
    const response = await getToken();
    if ("data" in response) {
      setToken(response.data);
    }
  }, []);

  let userID = "";
  if (tokenIsSuccess && token !== null) {
    userID = getUserIDFromToken(token as string);
  }
  const {
    data: user,
    isSuccess: userQueryIsSuccess,
    isLoading: userQueryIsLoading,
  } = useUserProtectedQuery(userID, { skip: userID === "" });

  const [updateUser, { isLoading: updateUserIsLoading }] =
    useUpdateUserMutation();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (userQueryIsSuccess) {
      setEmail(user!.Email);
      setFirstName(user!.FirstName);
      setLastName(user!.LastName);
    }
  }, [userQueryIsSuccess]);

  const handleSubmit = async () => {
    const response = await updateUser({
      ID: userID,
      Photo: user!.Photo,
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
  };

  if (tokenIsSuccess && token === null) {
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
            <strong>Logo image (Image must be smaller than 500x500)</strong>
            <DragAndDrop
              onDrop={(files) => {
                setLogoFile(files[0]);
              }}
              multiple={false}
            />
          </label>
        </Form.Group>
        {logoFile ? <p>{logoFile.name}</p> : null}
        <Container className={styles.saveBtn}>
          {userQueryIsSuccess ? (
            <Buttons
              submit
              color="green"
              clicked={() => setDisabledForm(true)}
              loading={updateUserIsLoading}
            >
              Save
            </Buttons>
          ) : null}
        </Container>
      </Form>
      <br />
      <br />
      {showSuccess ? <p>Updated profile</p> : null}
    </Container>
  );
};

export default AccountSettingsFormGroup;
