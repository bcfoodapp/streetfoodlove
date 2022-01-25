import React, { useState } from "react";
import { Form, Container, Header } from "semantic-ui-react";
import Buttons from "../Atoms/Button/Buttons";
import HeaderBar from "../Molecules/HeaderBar/HeaderBar";
import styles from "./signup.module.css";
import { useCreateUserMutation, UserType } from "../../../api";
import { v4 as uuid } from "uuid";
import { DateTime } from "luxon";

export default function Signup(): React.ReactElement {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [createUser] = useCreateUserMutation();

  return (
    <Container className={styles.signUpWrapper}>
      <HeaderBar login/>
      <h1>Sign Up Form (user account)</h1>
      <Form
        className={styles.form}
        onSubmit={async () => {
          await createUser({
            ID: uuid(),
            Username: username,
            Photo: uuid(),
            UserType: UserType.Customer,
            Email: email,
            FirstName: firstName,
            LastName: lastName,
            Password: password,
            SignUpDate: DateTime.now(),
          });
          // TODO need better feedback, and show any errors if they occurred
          alert("created account");
        }}
      >
        <Form.Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fluid
          label="Email address"
          placeholder="Email address"
          required
          width={15}
        />
        <Form.Input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          // error={{ content: 'Please enter your first name', pointing: 'below' }}
          fluid
          label="First name"
          placeholder="First name"
          id="form-input-first-name"
          required
          width={15}
        />
        <Form.Input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          // error='Please enter your last name'
          fluid
          label="Last name"
          placeholder="Last name"
          required
          width={15}
        />
        <Form.Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          // error='Please enter your last name'
          fluid
          label="Username"
          placeholder="Username"
          required
          width={15}
        />

        <Form.Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          // error='Please enter your last name'
          fluid
          label="Password"
          placeholder="Password"
          required
          width={15}
          type="password"
        />
        <Form.Checkbox
          label="I agree to the Terms and Conditions"
          // error={{
          //   content: 'You must agree to the terms and conditions',
          //   pointing: 'left',
          // }}
          required
        />
        <Container className={styles.btnContainer}>
          <Buttons color="green" signup>
            Sign Up
          </Buttons>
        </Container>
      </Form>
    </Container>
  );
}
