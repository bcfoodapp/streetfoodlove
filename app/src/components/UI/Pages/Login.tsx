import React from "react";
import { Container, Form, Header } from "semantic-ui-react";
import Buttons from "../Atoms/Button/Buttons";
import styles from "./login.module.css";
import { Grid } from "semantic-ui-react";
import { useSetCredentialsAndGetTokenMutation } from "../../../api";
import { useNavigate } from "react-router-dom";
import { Formik, FormikProps, ErrorMessage } from "formik";
import * as Yup from "yup";

interface inputValues {
  Username: string;
  Password: string;
}

/**
 * Displays the Login element in the login page
 */
export default function Login(): React.ReactElement {
  const [setCredentialsMutation] = useSetCredentialsAndGetTokenMutation();
  const navigate = useNavigate();

  const initialValues: inputValues = {
    Username: "",
    Password: "",
  };

  const validationSchema = Yup.object({
    Username: Yup.string().required("Must enter Username"),
    Password: Yup.string().required("Must enter Password"),
  });

  const onSubmit = async (values: inputValues) => {
    const response = await setCredentialsMutation({
      Username: values.Username,
      Password: values.Password,
    });

    if ((response as any).error === undefined) {
      navigate("/");
    }
  };

  return (
    <>
      <Container className={styles.wrapper}>
        <Grid centered relaxed={"very"}>
          <Grid.Column className={styles.test}>
            <Grid.Row centered>
              <h1 className={styles.header}>Login</h1>
            </Grid.Row>
            <Grid.Row>
              <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
                enableReinitialize
                validateOnChange
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
                    </Form>
                  );
                }}
              </Formik>
            </Grid.Row>
          </Grid.Column>
        </Grid>
      </Container>
    </>
  );
}
