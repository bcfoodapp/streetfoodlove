import React, { ChangeEvent, useState } from "react";
import { Container, Form, Icon } from "semantic-ui-react";
import Buttons from "../../Atoms/Button/Buttons";
import styles from "./accountformgroup.module.css";
import { UserProtected, useUpdateUserMutation } from "../../../../api";
import { v4 as uuid } from "uuid";
import { UserType } from "../../../../api";
import { DateTime } from "luxon";

const AccountSettingsFormGroup: React.FC<{
  disabled: boolean;
  setDisabledForm: (value: boolean) => void;
}> = ({ disabled, setDisabledForm }) => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [updateSetting] = useUpdateUserMutation();

  const handleSubmit = async () => {
    await updateSetting({
      ID: uuid(),
      Photo: uuid(),
      Username: username,
      Email: email,
      FirstName: firstName,
      LastName: lastName,
      UserType: UserType.Customer,
      SignUpDate: DateTime.now(),
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
          <Buttons submit color="green" clicked={() => setDisabledForm(true)}>
            Save
          </Buttons>
        </Container>
      </Form>
    </Container>
  );
};

export default AccountSettingsFormGroup;
