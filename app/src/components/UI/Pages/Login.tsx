import React, { useEffect, useState } from "react";
import { Container, Form, Checkbox, Header } from "semantic-ui-react";
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
import MessageError from "../Atoms/Message/MessageError";
import { Formik, FormikProps, ErrorMessage } from "formik";
import * as Yup from "yup";

/**
 * Displays the Login element in the login page
 */

interface myvalues {
  Username: string;
  Password: string;
}

export default function Login(): React.ReactElement {
  // const [credentials, setCredentials] = useState<Credentials>({
  //   Password: "",
  //   Username: "",
  // });
  const [setCredentialsMutation] = useSetCredentialsAndGetTokenMutation();
  const navigate = useNavigate();
  const error = useAppSelector((state) => state.root.error);

  const initialValues: myvalues = {
    Username: "",
    Password: "",
  };

  const validationSchema = Yup.object({
    Username: Yup.string().required("Must enter Username"),
    Password: Yup.string().required("Must enter Password"),
  });

  const onSubmit = async (values: any) => {
    await setCredentialsMutation({
      Username: values.Username,
      Password: values.Password,
    });
    // navigate("/");
  };

  return (
    <>
      <HeaderBar />
      {error ? <MessageError errorMsg={error.toString()} /> : null}

      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        enableReinitialize={true}
        validateOnChange={true}
      >
        {(formProps: FormikProps<myvalues>) => {
          const {
            dirty,
            isValid,
            handleSubmit,
            values,
            handleBlur,
            handleReset,
            errors,
            touched,
            handleChange,
          } = formProps;

          return (
            <Container className={styles.wrapper}>
              <Grid centered relaxed={"very"}>
                <Grid.Column className={styles.test}>
                  <Grid.Row centered>
                    <h1 className={styles.header}>Login</h1>
                  </Grid.Row>
                  <Grid.Row>
                    <Form onSubmit={handleSubmit} onReset={handleReset}>
                      <Form.Field className={styles.field1}>
                        <Header as={"h3"}>Username</Header>
                        <Form.Input
                          placeholder="Username"
                          width={7}
                          value={values.Username}
                          // value={credentials.Username}
                          // onChange={(_, { value }) =>
                          //   setCredentials({ ...credentials, Username: value })
                          // }
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.Username && Boolean(errors.Username)}
                          name={"Username"}
                        />
                        <ErrorMessage
                          name="Username"
                          component="span"
                          className={styles.error}
                        />
                      </Form.Field>
                      <Form.Field className={styles.field2}>
                        <Header as={"h3"}>Password</Header>
                        <Form.Input
                          placeholder="Password"
                          width={7}
                          type="password"
                          value={values.Password}
                          // value={credentials.Password}
                          // onChange={(_, { value }) =>
                          //   setCredentials({ ...credentials, Password: value })
                          // }
                          onChange={handleChange}
                          onBlur={handleBlur}
                          name={"Password"}
                          error={touched.Password && Boolean(errors.Password)}
                        />
                        <ErrorMessage
                          name="Password"
                          component="span"
                          className={styles.error}
                        />
                      </Form.Field>
                      {/* TODO this belongs in the create account form */}
                      {/*<Form.Field>*/}
                      {/*  <Checkbox label="I agree to the Terms and Conditions" />*/}
                      {/*</Form.Field>*/}
                      <Container>
                        <Buttons
                          login
                          color="green"
                          dirty={dirty}
                          valid={isValid}
                        >
                          Login
                        </Buttons>
                      </Container>
                      {/* Temporary error output */}
                      {/* <pre>{error ? error.toString() : ""}</pre> */}
                    </Form>
                  </Grid.Row>
                </Grid.Column>
              </Grid>
            </Container>
          );
        }}
      </Formik>
    </>
  );
}
