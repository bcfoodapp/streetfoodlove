import React, { useEffect, useState } from "react";
import { Container, Form, Header } from "semantic-ui-react";
import Buttons from "../Atoms/Button/Buttons";
import styles from "./login.module.css";
import { Grid } from "semantic-ui-react";
import {
  useGetTokenQuery,
  useSetCredentialsAndGetTokenMutation,
  useUserProtectedQuery,
  useUserQuery,
} from "../../../api";
import { useNavigate } from "react-router-dom";
import { Formik, FormikProps, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAppSelector } from "../../../store";
import jwtDecode from "jwt-decode";

/**
 * Displays the Login element in the login page
 */

interface inputValues {
  Username: string;
  Password: string;
}

const Login: React.FC<{ token: string }> = ({ token }) => {
  const [setCredentialsMutation] = useSetCredentialsAndGetTokenMutation();
  const navigate = useNavigate();
  const userID = jwtDecode<{ UserID: string }>(token).UserID;
  const userQuery = useUserProtectedQuery(userID);

  if (
    userQuery.data?.FirstName !== undefined &&
    userQuery.data?.LastName !== undefined
  ) {
    localStorage.setItem("firstName", userQuery.data?.FirstName);
    localStorage.setItem("lastName", userQuery.data?.LastName);
  }

  const initialValues: inputValues = {
    Username: "",
    Password: "",
  };

  const validationSchema = Yup.object({
    Username: Yup.string().required("Must enter Username"),
    Password: Yup.string().required("Must enter Password"),
  });

  const onSubmit = async (values: inputValues) => {
    // localStorage.setItem("firstName", firstName)
    // localStorage.setItem("lastName", lastName)
    await setCredentialsMutation({
      Username: values.Username,
      Password: values.Password,
    });
    navigate("/");
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        enableReinitialize={true}
        validateOnChange={true}
      >
        {(formProps: FormikProps<inputValues>) => {
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
};

const LoginWrapper: React.FC = () => {
  useGetTokenQuery();
  const token = useAppSelector((state) => state.token.token);

  if (token === null) {
    return <p>failed</p>;
  }

  return <Login token={token} />;
};

export default LoginWrapper;
