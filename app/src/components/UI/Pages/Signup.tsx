import React, { useEffect, useState } from "react";
import { Form, Container, Button } from "semantic-ui-react";
import Buttons from "../Atoms/Button/Buttons";
import HeaderBar from "../Molecules/HeaderBar/HeaderBar";
import styles from "./signup.module.css";

export default function Signup(): React.ReactElement {
  const storeUserInfo = () => {};

  return (
    <Container className={styles.signUpWrapper}>
      <HeaderBar signUp={false} />
      <h1>Sign Up Form (user account)</h1>
      <Form className={styles.form}>
        <Form.Input
          // error={{ content: 'Please enter your first name', pointing: 'below' }}
          fluid
          label="First name"
          placeholder="First name"
          id="form-input-first-name"
          required
          width={5}
        />
        <Form.Input
          // error='Please enter your last name'
          fluid
          label="Last name"
          placeholder="Last name"
          required
          width={5}
        />
        <Form.Input
          // error='Please enter your last name'
          fluid
          label="Username"
          placeholder="Username"
          required
          width={5}
        />

        <Form.Input
          // error='Please enter your last name'
          fluid
          label="Password"
          placeholder="Password"
          required
          width={5}
        />
        <Form.Checkbox
          label="I agree to the Terms and Conditions"
          // error={{
          //   content: 'You must agree to the terms and conditions',
          //   pointing: 'left',
          // }}
          required
        />
      </Form>
      <Container className={styles.btnContainer}>
        <Buttons clicked={() => storeUserInfo} color="green" signup>
          Sign Up
        </Buttons>
      </Container>
    </Container>
  );
}
