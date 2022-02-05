import React, { useEffect } from "react";
import { Container, Form } from "semantic-ui-react";
import Buttons from "../Atoms/Button/Buttons";
import styles from "./signup.module.css";
import { useCreateUserMutation, UserType } from "../../../api";
import { v4 as uuid } from "uuid";
import { DateTime } from "luxon";
import { ErrorMessage, Field, Formik, FormikProps } from "formik";
import * as Yup from "yup";
import { useNavigate, useSearchParams } from "react-router-dom";
import { signInWithGoogle } from "../../../googleSignIn";

interface inputValues {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  agreedConditions: boolean;
}

export default function Signup(): React.ReactElement {
  const [createUser] = useCreateUserMutation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  let userType = UserType.Customer;
  if (searchParams.get("usertype") === "vendor") {
    userType = UserType.Vendor;
  }

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
    const result = await createUser({
      ID: uuid(),
      Username: data.username,
      Photo: uuid(),
      UserType: userType,
      Email: data.email,
      FirstName: data.firstName,
      LastName: data.lastName,
      Password: data.password,
      SignUpDate: DateTime.now(),
    });

    if ((result as any).error === undefined) {
      if (userType === UserType.Customer) {
        navigate("/");
      } else {
        navigate("/vendor-signup");
      }
    }
  };

  useEffect(() => {
    // @ts-ignore
    gapi.signin2.render("googleButton", {
      scope: "profile email",
      width: 240,
      height: 50,
      longtitle: true,
      theme: "dark",
      onsuccess: signInWithGoogle,
      onfailure: () => {
        throw new Error("sign in with Google failed");
      },
    });
  }, []);

  return (
    <Container className={styles.signUpWrapper}>
      <h1>Sign Up Form (user account)</h1>

      <div className={styles.formWrapper}>
        <div className={styles.googleButtonWrapper}>
          <div id="googleButton" />
        </div>

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
              <Form onSubmit={handleSubmit} onReset={handleReset}>
                <Form.Input
                  value={values.email}
                  onChange={handleChange}
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
                  onBlur={handleBlur}
                  error={touched.username && Boolean(errors.username)}
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
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
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
      </div>
    </Container>
  );
}
