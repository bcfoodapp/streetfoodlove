import React, { useEffect, useState } from "react";
import { Container, Form, Checkbox } from "semantic-ui-react";
import Buttons from "../Atoms/Button/Buttons";
import HeaderBar from "../Molecules/HeaderBar/HeaderBar";
import styles from "./login.module.css";
import { Grid } from "semantic-ui-react";
import {
  Credentials,
  useSetCredentialsAndGetTokenMutation,
} from "../../../api";
import { useAppSelector } from "../../../store";
import { useNavigate } from "react-router-dom";

/**
 * Displays the Login element in the login page
 */

export default function Login(): React.ReactElement {
  const [credentials, setCredentials] = useState<Credentials>({
    Password: "",
    Username: "",
  });
  const [setCredentialsMutation] = useSetCredentialsAndGetTokenMutation();
  const navigate = useNavigate();
  const error = useAppSelector((state) => state.root.error);

  const onSubmit = async () => {
    await setCredentialsMutation(credentials);
    navigate("/");
  };

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
              <Form onSubmit={onSubmit}>
                <Form.Field>
                  <Form.Input
                    placeholder="Username"
                    width={7}
                    value={credentials.Username}
                    onChange={(_, { value }) =>
                      setCredentials({ ...credentials, Username: value })
                    }
                  />
                </Form.Field>
                <Form.Field>
                  <Form.Input
                    placeholder="Password"
                    width={7}
                    type="password"
                    value={credentials.Password}
                    onChange={(_, { value }) =>
                      setCredentials({ ...credentials, Password: value })
                    }
                  />
                </Form.Field>
                {/* TODO this belongs in the create account form */}
                {/*<Form.Field>*/}
                {/*  <Checkbox label="I agree to the Terms and Conditions" />*/}
                {/*</Form.Field>*/}
                <Container>
                  <Buttons login color="green" clicked={onSubmit}>
                    Login
                  </Buttons>
                </Container>
                {/* Temporary error output */}
                <pre>{error ? error.toString() : ""}</pre>
              </Form>
            </Grid.Row>
          </Grid.Column>
        </Grid>
      </Container>
    </>
  );
}
