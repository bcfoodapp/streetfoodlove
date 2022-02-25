import {
  Container,
  Form,
  Header,
  Input,
  Segment,
  Select,
  TextArea,
} from "semantic-ui-react";
import Buttons from "../Atoms/Button/Buttons";
import styles from "./createvendorpage.module.css";
import {
  useEffectAsync,
  getUserIDFromToken,
  useGetTokenMutation,
  useUpdateVendorMutation,
  useVendorByOwnerIDQuery,
  Vendor,
  useS3CredentialsMutation,
  getExtension,
} from "../../../api";
import { Formik, FormikProps, ErrorMessage } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import DragAndDrop from "../Organisms/DragAndDrop/DragAndDrop";
import { uploadToS3 } from "../../../aws";
import { v4 as uuid } from "uuid";

interface inputValues {
  name: string;
  logo: File | null;
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
  const [updateVendor] = useUpdateVendorMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [getToken, { isSuccess: tokenIsSuccess }] = useGetTokenMutation();
  const [token, setToken] = useState(null as string | null);

  useEffectAsync(async () => {
    const response = await getToken();
    if ("data" in response) {
      setToken(response.data);
    }
  }, []);

  let userID = null as string | null;
  if (tokenIsSuccess && token) {
    userID = getUserIDFromToken(token);
  }

  const {
    data: vendor,
    isSuccess: vendorQueryIsSuccess,
    isLoading: vendorQueryIsLoading,
  } = useVendorByOwnerIDQuery(userID as string, { skip: !userID });

  const [initialValues, setInitalValues] = useState({
    name: "",
    businessAddress: "",
    phoneNumber: "",
    businessHours: "",
    website: "",
  } as inputValues);

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (vendorQueryIsSuccess) {
      setInitalValues({
        logo: null,
        name: vendor!.Name,
        businessAddress: vendor!.BusinessAddress,
        phoneNumber: vendor!.Phone,
        businessHours: vendor!.BusinessHours,
        website: vendor!.Website,
      });
    }
  }, [vendorQueryIsSuccess]);

  const [getS3Credentials] = useS3CredentialsMutation();

  if (tokenIsSuccess && !token) {
    return <p>Not logged in</p>;
  }

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    businessAddress: Yup.string().required("Required"),
    phoneNumber: Yup.string().required("Required"),
    businessHours: Yup.string().required("Required"),
    website: Yup.string(),
  });

  const onSubmit = async (data: inputValues) => {
    setIsSubmitting(true);
    let photoID = null;
    if (data.logo) {
      // userID is defined at this point
      const s3Response = await getS3Credentials(userID!);
      if ("error" in s3Response) {
        throw new Error("could not get S3 credentials");
      }

      const photoID = `${uuid()}.${getExtension(data.logo.name)}`;
      await uploadToS3(s3Response.data, photoID, data.logo);
    }

    const updatedVendor: Vendor = {
      ID: vendor!.ID,
      Name: data.name,
      BusinessAddress: data.businessAddress,
      Website: data.website,
      BusinessHours: data.businessHours,
      Phone: data.phoneNumber,
      BusinessLogo: photoID,
      Latitude: 0,
      Longitude: 0,
      Owner: userID!,
    };
    const response = await updateVendor(updatedVendor);
    if ("data" in response) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
    setIsSubmitting(false);
  };

  return (
    <Container className={styles.wrapper}>
      <Container textAlign="center">
        <Header as="h2">Edit Vendor Page</Header>
      </Container>

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

              <label>
                <strong>Logo image (Image must be smaller than 500x500)</strong>
                <DragAndDrop
                  onDrop={(files) => {
                    setFieldValue("logo", files[0]);
                  }}
                  multiple={false}
                />
              </label>
              {values.logo ? <p>{values.logo.name}</p> : null}
              <br />

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
                control={TextArea}
                label="Vendor Description"
                placeholder="Vendor Description"
              />

              <Buttons
                edit
                color="green"
                dirty
                valid={isValid}
                loading={isSubmitting}
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
