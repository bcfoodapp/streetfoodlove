import React, { useEffect, useState } from "react";
import { Container, Form } from "semantic-ui-react";
import Buttons from "../../Atoms/Button/Buttons";
import styles from "./accountformgroup.module.css";
import {
  useGetTokenQuery,
  useUpdateUserMutation,
  useUserProtectedQuery,
} from "../../../../api";
import { UserType } from "../../../../api";
import { useAppSelector, useAppDispatch, setName } from "../../../../store";
import jwtDecode from "jwt-decode";

const AccountSettings: React.FC<{
  token: string;
  disabled: boolean;
  setDisabledForm: (value: boolean) => void;
}> = ({ token, disabled, setDisabledForm }) => {
  const userID = jwtDecode<{ UserID: string }>(token).UserID;
  const userQuery = useUserProtectedQuery(userID);
  const user = userQuery.data;
  const dispatch = useAppDispatch()

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (userQuery.isSuccess) {
      setEmail(user!.Email);
      setFirstName(user!.FirstName);
      setLastName(user!.LastName);
      setUsername(user!.Username);
    }
  }, [userQuery.isSuccess]);

  const [updateSetting] = useUpdateUserMutation();

  const handleSubmit = async () => {
    dispatch(setName({firstName: firstName, lastName: lastName}))
    // user is defined when handleSubmit is called
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
          {userQuery.isSuccess ? (
            <Buttons submit color="green" clicked={() => setDisabledForm(true)}>
              Save
            </Buttons>
          ) : null}
        </Container>
      </Form>
    </Container>
  );
};

const AccountSettingsFormGroup: React.FC<{
  disabled: boolean;
  setDisabledForm: (value: boolean) => void;
}> = ({ disabled, setDisabledForm }) => {
  useGetTokenQuery();
  const token = useAppSelector((state) => state.token.token);
  if (token === null) {
    return <p>Not logged in</p>;
  }

  return (
    <AccountSettings
      token={token}
      disabled={disabled}
      setDisabledForm={setDisabledForm}
    />
  );
};

export default AccountSettingsFormGroup;
