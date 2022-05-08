import React, { useState } from "react";
import { Form, Container, Select } from "semantic-ui-react";
import Buttons from "../Atoms/Button/Buttons";
import { Dropdown } from "semantic-ui-react";
import styles from "./vendorappform.module.css";
import { Formik, FormikProps, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import {
  useEffectAsync,
  getUserIDFromToken,
  useCreateVendorMutation,
  useGetTokenMutation,
  Vendor,
} from "../../../api";
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";

const vendorOperatingAreas = [
  { key: "Bothell", text: "Bothell", value: "Bothell" },
  { key: "Seattle", text: "Seattle", value: "Seattle" },
  { key: "Bellevue", text: "Bellevue", value: "Bellevue" },
  { key: "Issaquah", text: "Issaquah", value: "Issaquah" },
  { key: "Redmond", text: "Redmond", value: "Redmond" },
  { key: "Lynnwood", text: "Lynwood", value: "Lynwood" },
];

const cuisineTypes = [
  { key: "Chinese", text: "Chinese", value: "Chinese" },
  { key: "Indian", text: "Indian", value: "Indian" },
  { key: "Mexican", text: "Mexican", value: "Mexican" },
  { key: "Italian", text: "Italian", value: "Italian" },
  { key: "French", text: "French", value: "French" },
  { key: "Spanish", text: "Spanish", value: "Spanish" },
  { key: "Thai", text: "Thai", value: "Thai" },
  { key: "Korean", text: "Korean", value: "Korean" },
  { key: "Japanese", text: "Japanese", value: "Japanese" },
];

interface inputValues {
  name: string;
  businessAddress: string;
  phoneNumber: string;
  fromHour: string;
  toHour: string;
  website: string;
  agreedConditions: boolean;
}

export default function VendorAppForm(): React.ReactElement {
  const navigate = useNavigate();
  const [createVendor] = useCreateVendorMutation();
  const [getToken, { isSuccess: tokenIsSuccess }] = useGetTokenMutation();
  const [token, setToken] = useState(null as string | null);

  useEffectAsync(async () => {
    const response = await getToken();
    if ("data" in response) {
      setToken(response.data);
    }
  }, []);

  if (!tokenIsSuccess || token === null) {
    return <p>Not logged in</p>;
  }

  const onSubmit = async (data: inputValues) => {
    const userID = getUserIDFromToken(token);
    const vendor: Vendor = {
      ID: uuid(),
      Name: data.name,
      BusinessAddress: data.businessAddress,
      Website: data.website,
      BusinessHours: `${data.fromHour}-${data.toHour}`,
      Phone: data.phoneNumber,
      BusinessLogo: "",
      Latitude: 0,
      Longitude: 0,
      Description: "",
      SocialMediaLink: "",
      Owner: userID,
      DiscountEnabled: false,
    };
    const response = await createVendor(vendor);
    if ("data" in response) {
      navigate("/vendor-dashboard");
    }
  };

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
    agreedConditions: false,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    businessAddress: Yup.string().required("Required"),
    website: Yup.string(),
    fromHour: Yup.string().required("Required"),
    toHour: Yup.string().required("Required"),
    phoneNumber: Yup.string().required("Required"),
    agreedConditions: Yup.bool().oneOf([true], "Required"),
  });

  return (
    <Container className={styles.wrapper}>
      <Container className={styles.signUpWrapper}>
        <h1>Sign Up Form (Vendor account)</h1>
        <Formik
          enableReinitialize
          onSubmit={onSubmit}
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
                  fluid
                  label="Vendor Name"
                  placeholder="Vendor Name"
                  name="name"
                  required
                  width={10}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  error={touched.name && Boolean(errors.name)}
                />
                <Form.Input
                  fluid
                  label="Business Address"
                  placeholder="Business Address"
                  required
                  width={10}
                  name="businessAddress"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.businessAddress}
                  error={
                    touched.businessAddress && Boolean(errors.businessAddress)
                  }
                />
                <Form.Field
                  id="vendorArea"
                  fluid
                  width={10}
                  control={Select}
                  multiple
                  options={vendorOperatingAreas}
                  placeholder="Operation Areas"
                  searched
                  required
                  onBlur={handleBlur}
                  label="Vendor Operating Areas"
                  // onChange={(_, area) => {
                  //   setFieldValue("")
                  // }}
                />
                <Form.Field
                  id="cuisineTypes"
                  fluid
                  width={10}
                  control={Select}
                  multiple
                  options={cuisineTypes}
                  placeholder="Cuisine Types"
                  searched
                  required
                  onBlur={handleBlur}
                  label="Cuisine Types"
                  // onChange={(_, area) => {
                  //   setFieldValue("")
                  // }}
                />
                <Form.Input
                  fluid
                  label="Website URL"
                  placeholder="Website URL"
                  width={10}
                  name="website"
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
                  name="fromHour"
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
                  name="toHour"
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
                  name="phoneNumber"
                  required
                  width={5}
                  className={styles.phoneInput}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.phoneNumber}
                  error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                />
                <h5>Logo Upload</h5>
                <input
                  type="file"
                  className={styles.fileInput}
                  name="myfile"
                  width={15}
                />

                <label htmlFor="agreedConditions">
                  <Field
                    type="checkbox"
                    name="agreedConditions"
                    label="I agree to the terms and conditions"
                    error={touched.agreedConditions && errors.agreedConditions}
                    required
                    onChange={(e: { target: { checked: any } }) =>
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
    </Container>
  );
}
