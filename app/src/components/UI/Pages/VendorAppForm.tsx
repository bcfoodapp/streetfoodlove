import React, { useEffect, useState } from "react";
import { Form, Container, Button } from "semantic-ui-react";
import Buttons from "../Atoms/Button/Buttons";
import HeaderBar from "../Molecules/HeaderBar/HeaderBar";
import styles from "./signup.module.css";

export default function VendorAppForm(): React.ReactElement {
  const storeUserInfo = () => {};

  return (
    <Container className={styles.signUpWrapper}>
      <HeaderBar signUp={false} />
      <h1>Sign Up Form (user account)</h1>
      <Form className={styles.form}>
        <Form.Input
          // error={{ content: 'Please enter your first name', pointing: 'below' }}
          fluid
          label="Address"
          placeholder="Address"
          id="form-input-first-name"
          required
          width={5}
        />
        <Form.Input
          // error='Please enter your last name'
          fluid
          label=""
          placeholder=""
          required
          width={5}
        />
        <Form.Input
          // error='Please enter your last name'
          fluid
          label="Phone"
          placeholder="Phone"
          required
          width={5}
        />

        <Form.Input
          // error='Please enter your last name'
          fluid
          label="Email Address"
          placeholder="Email Address"
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
