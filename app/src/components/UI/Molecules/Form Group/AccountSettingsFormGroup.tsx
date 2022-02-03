import React, { useEffect, useState } from "react";
import { Container, Form } from "semantic-ui-react";
import Buttons from "../../Atoms/Button/Buttons";
import styles from "./accountformgroup.module.css";
import {
  getUserIDFromToken,
  useGetTokenQuery,
  useUpdateUserMutation,
  useUserProtectedQuery,
} from "../../../../api";
import { UserType } from "../../../../api";

const AccountSettingsFormGroup: React.FC<{
  disabled: boolean;
  setDisabledForm: (value: boolean) => void;
}> = ({ disabled, setDisabledForm }) => {
  const { data: token, isSuccess } = useGetTokenQuery();

  let userID = "";
  if (isSuccess && token !== null) {
    userID = getUserIDFromToken(token as string);
  }
  const { data: user, isSuccess: userQueryIsSuccess } = useUserProtectedQuery(
    userID,
    { skip: userID === "" }
  );

  const [updateSetting] = useUpdateUserMutation();

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (userQueryIsSuccess) {
      setEmail(user!.Email);
      setFirstName(user!.FirstName);
      setLastName(user!.LastName);
      setUsername(user!.Username);
    }
  }, [userQueryIsSuccess]);

  const handleSubmit = async () => {
    await updateSetting({
      ID: userID,
      Photo: user!.Photo,
      Username: username,
      Email: email,
      FirstName: firstName,
      LastName: lastName,
      UserType: UserType.Customer,
      SignUpDate: user!.SignUpDate,
    });
    alert("Updated User Settings!");
  };

  if (isSuccess && token === null) {
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
          />
          <Form.Input
            label="Last Name"
            placeholder="Last Name"
            disabled={disabled}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <Form.Input
            label="Email"
            placeholder="Email"
            disabled={disabled}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Input
            label="Username"
            placeholder="Username"
            disabled={disabled}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Container className={styles.saveBtn}>
          {userQueryIsSuccess ? (
            <Buttons submit color="green" clicked={() => setDisabledForm(true)}>
              Save
            </Buttons>
          ) : null}
        </Container>
      </Form>
    </Container>
  );
};

export default AccountSettingsFormGroup;
