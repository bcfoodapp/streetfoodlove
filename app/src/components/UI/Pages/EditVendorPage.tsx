import {
  Container,
  Form,
  Header,
  Input,
  Select,
  TextArea,
} from "semantic-ui-react";
import Buttons from "../Atoms/Button/Buttons";
import styles from "./createvendorpage.module.css";
import {
  getUserIDFromToken,
  useGetTokenMutation,
  useUpdateVendorMutation,
  useVendorByOwnerIDQuery,
  Vendor,
} from "../../../api";
import { Formik, FormikProps, ErrorMessage } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../store";

const fileInput = () => {
  return <Input type="file" className={styles.input} size="small" fluid />;
};

interface inputValues {
  ID: string;
  name: string;
  businessAddress: string;
  phoneNumber: string;
  businessHours: string;
  website: string;
}

const businessHours = [
  { key: "8AM ", text: "8AM-5PM", value: "8AM-5PM" },
  { key: "9AM", text: "9AM-6PM", value: "9AM-6PM" },
  { key: "10AM", text: "10AM-7PM", value: "10AM-7PM" },
];

const EditVendorPage: React.FC = () => {
  const [updateVendor, { isLoading: updateVendorIsLoading }] =
    useUpdateVendorMutation();
  const [getToken, { isSuccess: tokenIsSuccess }] = useGetTokenMutation();
  useEffect(() => {
    getToken();
  }, []);
  const token = useAppSelector((state) => state.token.token);

  let userID = "";
  if (tokenIsSuccess && token !== null) {
    userID = getUserIDFromToken(token as string);
  }

  const {
    data: vendors,
    isSuccess: vendorQueryIsSuccess,
    isLoading: vendorQueryIsLoading,
  } = useVendorByOwnerIDQuery(userID, {
    skip: userID === "",
  });

  const [initialValues, setInitalValues] = useState({
    name: "",
    businessAddress: "",
    phoneNumber: "",
    businessHours: "",
    website: "",
  } as inputValues);

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (vendorQueryIsSuccess && vendors!.length > 0) {
      const vendor = vendors![0];
      setInitalValues({
        ID: vendor.ID,
        name: vendor.Name,
        businessAddress: vendor.BusinessAddress,
        phoneNumber: vendor.Phone,
        businessHours: vendor.BusinessHours,
        website: vendor.Website,
      });
    }
  }, [vendorQueryIsSuccess]);

  if (tokenIsSuccess && token === null) {
    return <p>Not logged in</p>;
  }

  if (vendorQueryIsSuccess && vendors!.length === 0) {
    return <p>No vendor found with matching owner ID</p>;
  }

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    businessAddress: Yup.string().required("Required"),
    phoneNumber: Yup.string().required("Required"),
    businessHours: Yup.string().required("Required"),
    website: Yup.string(),
  });

  const onSubmit = async (data: inputValues) => {
    const vendor: Vendor = {
      ID: data.ID,
      Name: data.name,
      BusinessAddress: data.businessAddress,
      Website: data.website,
      BusinessHours: data.businessHours,
      Phone: data.phoneNumber,
      BusinessLogo: "",
      Latitude: 0,
      Longitude: 0,
      Owner: userID,
    };
    const response = await updateVendor(vendor);
    if ((response as any).error === undefined) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <Container className={styles.wrapper}>
      <Header as={"h2"} className={styles.header}>
        Edit Vendor Page
      </Header>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        validateOnChange={true}
      >
        {(formProps: FormikProps<inputValues>) => {
          const {
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
              onSubmit={handleSubmit}
              className={styles.form}
              onReset={handleReset}
            >
              <Form.Input
                name="name"
                onChange={handleChange}
                label="Name"
                placeholder="Name"
                onBlur={handleBlur}
                error={touched.name && Boolean(errors.name)}
                value={values.name}
                loading={vendorQueryIsLoading}
                required
              />
              <ErrorMessage
                name="name"
                component="span"
                className={styles.error}
              />
              <Form.Input
                name="businessAddress"
                onChange={handleChange}
                label="Business Address"
                placeholder="Business Address"
                onBlur={handleBlur}
                error={
                  touched.businessAddress && Boolean(errors.businessAddress)
                }
                value={values.businessAddress}
                loading={vendorQueryIsLoading}
                required
              />
              <ErrorMessage
                name="businessAddress"
                component="span"
                className={styles.error}
              />
              <Form.Input
                name="phoneNumber"
                onChange={handleChange}
                label="Phone Number"
                placeholder="Phone Number"
                onBlur={handleBlur}
                error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                value={values.phoneNumber}
                loading={vendorQueryIsLoading}
                required
              />
              <ErrorMessage
                name="phoneNumber"
                component="span"
                className={styles.error}
              />
              <Form.Field
                id="businessHours"
                control={Select}
                options={businessHours}
                onChange={(_, hour) =>
                  setFieldValue("businessHours", hour.value)
                }
                label="Business Hours"
                placeholder="Business Hours"
                searched
                onBlur={handleBlur}
                error={touched.businessHours && Boolean(errors.businessHours)}
                value={values.businessHours}
                loading={vendorQueryIsLoading}
                required
              />
              <ErrorMessage
                name="businessHours"
                component="span"
                className={styles.error}
              />
              <Form.Input
                name="website"
                onChange={handleChange}
                label="Website URL"
                placeholder="Website URL"
                width={8}
                onBlur={handleBlur}
                error={touched.website && Boolean(errors.website)}
                value={values.website}
                loading={vendorQueryIsLoading}
                required
              />
              <ErrorMessage
                name="website"
                component="span"
                className={styles.error}
              />

              <Form.Field
                control={fileInput}
                label="Upload Business Logo"
                width={8}
              />

              <Form.Field
                control={TextArea}
                label="Vendor Description"
                placeholder="Vendor Description"
              />

              <Buttons
                edit
                color="green"
                dirty
                valid={isValid}
                loading={updateVendorIsLoading}
              >
                Edit
              </Buttons>
              {showSuccess ? <p>Updated vendor page</p> : null}
            </Form>
          );
        }}
      </Formik>
    </Container>
  );
};

export default EditVendorPage;
