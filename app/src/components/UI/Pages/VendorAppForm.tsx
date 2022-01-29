import React from "react";
import { Form, Container, Button } from "semantic-ui-react";
import Buttons from "../Atoms/Button/Buttons";
import HeaderBar from "../Molecules/HeaderBar/HeaderBar";
import { Dropdown } from "semantic-ui-react";
import styles from "./vendorappform.module.css";
import { Formik, FormikProps, ErrorMessage } from "formik";
import * as Yup from "yup";

interface inputValues {
  name: string;
  businessAddress: string;
  phoneNumber: string;
  fromHour: string;
  toHour: string;
  website: string;
}

export default function VendorAppForm(): React.ReactElement {
  const storeUserInfo = () => {};

  const timeOptionsFromValues = [
    //options for business hours starting from...
    "8:30 AM",
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 AM",
  ];

  const timeOptionsToValues = [
    //options for business hours starting to..
    "8:30 PM",
    "9:00 PM",
    "9:30 PM",
    "10:00 PM",
    "10:30 PM",
    "11:00 PM",
    "11:30 PM",
    "12:00 PM",
  ];

  const startTimeOptions = timeOptionsFromValues.map((element, key) => {
    return {
      key: timeOptionsFromValues[key],
      text: element,
      value: element,
    };
  });

  const endTimeOptions = timeOptionsToValues.map((element, key) => {
    return {
      key: timeOptionsToValues[key],
      text: element,
      value: element,
    };
  });

  const initialValues: inputValues = {
    name: "",
    businessAddress: "",
    website: "",
    fromHour: "",
    toHour: "",
    phoneNumber: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    businessAddress: Yup.string().required("Required"),
    website: Yup.string().required("Required"),
    fromHour: Yup.string().required("Required"),
    toHour: Yup.string().required("Required"),
    phoneNumber: Yup.string().required("Required"),
  });

  return (
    <Container className={styles.signUpWrapper}>
      <HeaderBar login />
      <h1>Sign Up Form (Vendor account)</h1>

      <Formik
        enableReinitialize
        onSubmit={storeUserInfo}
        validateOnChange={true}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {(formProps: FormikProps<inputValues>) => {
          const {
            dirty,
            isValid,
            handleChange,
            handleBlur,
            handleSubmit,
            touched,
            errors,
            values,
            handleReset,
            setFieldValue,
          } = formProps;

          return (
            <Form
              className={styles.form}
              onSubmit={handleSubmit}
              onReset={handleReset}
            >
              <Form.Input
                // error={{ content: 'Please enter your first name', pointing: 'below' }}
                fluid
                label="Name"
                placeholder="Name"
                name={"name"}
                required
                width={5}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                error={touched.name && Boolean(errors.name)}
              />
              <Form.Input
                // error='Please enter your last name'
                fluid
                label="Business Address"
                placeholder="Business Address"
                required
                width={5}
                name={"businessAddress"}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.businessAddress}
                error={
                  touched.businessAddress && Boolean(errors.businessAddress)
                }
              />
              <Form.Input
                // error='Please enter your last name'
                fluid
                label="Website URL"
                placeholder="Website URL"
                required
                width={5}
                name={"website"}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.website}
                error={touched.website && Boolean(errors.website)}
              />
              <h5>Business Hours: </h5>
              <Dropdown
                placeholder="From"
                selection
                options={startTimeOptions}
                name={"fromHour"}
                onBlur={handleBlur}
                error={touched.fromHour && Boolean(errors.fromHour)}
                value={values.fromHour}
                required
                onChange={(_, fromHour) => {
                  setFieldValue("fromHour", fromHour.value);
                }}
              />
              <Dropdown
                placeholder="To"
                search
                selection
                options={endTimeOptions}
                className={styles.dropdown}
                name={"toHour"}
                onBlur={handleBlur}
                error={touched.toHour && Boolean(errors.toHour)}
                value={values.toHour}
                required
                onChange={(_, toHour) => {
                  setFieldValue("toHour", toHour.value);
                }}
              />
              <Form.Input
                // error='Please enter your last name'
                fluid
                label="Phone"
                placeholder="Phone"
                name={"phoneNumber"}
                required
                width={5}
                className={styles.phoneInput}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.phoneNumber}
                error={touched.phoneNumber && Boolean(errors.phoneNumber)}
              />
              <h5>Logo Upload</h5>
              <input type="file" className={styles.fileInput} name="myfile" />
              <Form.Checkbox
                label="I agree to the Terms and Conditions"
                required
                className={styles.checkBox}
              />
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
