import React, { useState } from "react";
import { Form, Container } from "semantic-ui-react";
import Buttons from "../Atoms/Button/Buttons";
import HeaderBar from "../Molecules/HeaderBar/HeaderBar";
import styles from "./signup.module.css";
import { useCreateUserMutation, UserType } from "../../../api";
import { v4 as uuid } from "uuid";
import { DateTime } from "luxon";
import { Formik, FormikProps, ErrorMessage, Field } from "formik";
import * as Yup from "yup";

interface inputValues {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  agreedConditions: boolean;
}

export default function Signup(): React.ReactElement {
  // const [email, setEmail] = useState("");
  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");

  const [createUser] = useCreateUserMutation();

  const initialValues: inputValues = {
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    email: "",
    agreedConditions: false,
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name Required"),
    lastName: Yup.string().required("Last Name Required"),
    username: Yup.string().required("Username Required"),
    password: Yup.string().required("Password Required"),
    email: Yup.string().required("Email Required"),
    agreedConditions: Yup.bool().oneOf([true], "Required"),
  });

  const onSubmit = async (data: inputValues) => {
    await createUser({
      ID: uuid(),
      Username: data.username,
      Photo: uuid(),
      UserType: UserType.Customer,
      Email: data.email,
      FirstName: data.firstName,
      LastName: data.lastName,
      Password: data.password,
      SignUpDate: DateTime.now(),
    });
    // TODO need better feedback, and show any errors if they occurred
    alert("created account");
  };

  return (
    <Container className={styles.signUpWrapper}>
      <HeaderBar login />
      <h1>Sign Up Form (user account)</h1>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        validateOnChange={true}
      >
        {(formProps: FormikProps<inputValues>) => {
          const {
            dirty,
            isValid,
            handleSubmit,
            handleBlur,
            handleReset,
            touched,
            errors,
            handleChange,
            values,
            setFieldValue,
          } = formProps;

          return (
            <Form
              className={styles.form}
              onSubmit={handleSubmit}
              onReset={handleReset}
            >
              <Form.Input
                value={values.email}
                onChange={handleChange}
                // onChange={(e) => setEmail(e.target.value)}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                fluid
                label="Email address"
                placeholder="Email address"
                required
                width={15}
                name={"email"}
              />
              <ErrorMessage
                name="email"
                component="span"
                className={styles.error}
              />
              <Form.Input
                value={values.firstName}
                onChange={handleChange}
                // onChange={(e) => setFirstName(e.target.value)}
                // error={{ content: 'Please enter your first name', pointing: 'below' }}
                onBlur={handleBlur}
                error={touched.firstName && Boolean(errors.firstName)}
                fluid
                label="First name"
                placeholder="First name"
                id="form-input-first-name"
                required
                width={15}
                name={"firstName"}
              />
              <ErrorMessage
                name="firstName"
                component="span"
                className={styles.error}
              />
              <Form.Input
                value={values.lastName}
                onChange={handleChange}
                // onChange={(e) => setLastName(e.target.value)}
                // error='Please enter your last name'
                onBlur={handleBlur}
                error={touched.lastName && Boolean(errors.lastName)}
                fluid
                label="Last name"
                placeholder="Last name"
                required
                width={15}
                name={"lastName"}
              />
              <ErrorMessage
                name="lastName"
                component="span"
                className={styles.error}
              />

              <Form.Input
                value={values.username}
                onChange={handleChange}
                // onChange={(e) => setUsername(e.target.value)}
                onBlur={handleBlur}
                error={touched.username && Boolean(errors.username)}
                // error='Please enter your last name'
                fluid
                label="Username"
                placeholder="Username"
                required
                width={15}
                name={"username"}
              />
              <ErrorMessage
                name="username"
                component="span"
                className={styles.error}
              />

              <Form.Input
                value={values.password}
                onChange={handleChange}
                // onChange={(e) => setPassword(e.target.value)}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                // error='Please enter your last name'
                fluid
                label="Password"
                placeholder="Password"
                required
                width={15}
                type="password"
                name={"password"}
              />
              <ErrorMessage
                name="password"
                component="span"
                className={styles.error}
              />
              <label htmlFor="agreedConditions">
                <Field
                  label="I agree to the Terms and Conditions"
                  required
                  type="checkbox"
                  name="agreedConditions"
                  error={touched.agreedConditions && errors.agreedConditions}
                  onChange={(e) =>
                    setFieldValue("agreedConditions", e.target.checked)
                  }
                  checked={values.agreedConditions}
                  className={styles.field}
                />
                I agree to the terms and conditions
              </label>
              <Container className={styles.errContainer}>
                <ErrorMessage
                  name="agreedConditions"
                  component="span"
                  className={styles.error}
                />
              </Container>
              <Container className={styles.btnContainer}>
                <Buttons color="green" signup dirty={dirty} valid={isValid}>
                  Sign Up
                </Buttons>
              </Container>
            </Form>
          );
        }}
      </Formik>
    </Container>
  );
}
