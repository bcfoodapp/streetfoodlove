import React from "react";
import { Container, Form, Checkbox } from "semantic-ui-react";
import Buttons from "../Atoms/Button/Buttons";
import HeaderBar from "../Molecules/HeaderBar/HeaderBar";
import styles from "./login.module.css";
import { Grid } from "semantic-ui-react";

/**
 * Displays the Login element in the login page
 */

export default function Login(): React.ReactElement {
  return (
    <>
      <HeaderBar />
      <Container className={styles.wrapper}>
        <Grid centered relaxed={"very"}>
          <Grid.Column className={styles.test}>
            <Grid.Row centered>
              <h1 className={styles.header}>Login</h1>
            </Grid.Row>
            <Grid.Row>
              <Form>
                <Form.Field>
                  <label>First Name</label>
                  <Form.Input placeholder="First Name" width={7} />
                </Form.Field>
                <Form.Field>
                  <label>Last Name</label>
                  <Form.Input placeholder="Last Name" width={7} />
                </Form.Field>
                <Form.Field>
                  <Checkbox label="I agree to the Terms and Conditions" />
                </Form.Field>
                <Container>
                  <Buttons login color="green">
                    Login
                  </Buttons>
                </Container>
              </Form>
            </Grid.Row>
          </Grid.Column>
        </Grid>
      </Container>
    </>
  );
}
