import {
  Button,
  Container,
  Form,
  Header,
  Image,
  Select,
  TextArea,
} from "semantic-ui-react";
import Buttons from "../Atoms/Button/Buttons";
import styles from "./editvendorpage.module.css";
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
import { s3Prefix, uploadToS3 } from "../../../aws";
import { v4 as uuid } from "uuid";

interface inputValues {
  name: string;
  businessLogo: string | null;
  businessAddress: string;
  latitude: number;
  longitude: number;
  phoneNumber: string;
  businessHours: string;
  website: string;
  description: string;
  socialmedialink: string;
  // vendorOperationAreas: []
}

const businessHours = [
  { key: "8AM ", text: "8AM-5PM", value: "8AM-5PM" },
  { key: "9AM", text: "9AM-6PM", value: "9AM-6PM" },
  { key: "10AM", text: "10AM-7PM", value: "10AM-7PM" },
];

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

const EditVendorPage: React.FC = () => {
  const [updateVendor] = useUpdateVendorMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [getToken, { isSuccess: tokenIsSuccess }] = useGetTokenMutation();
  const [userID, setUserID] = useState(null as string | null);
  const [logoFile, setLogoFile] = useState(null as File | null);
  const [coordinatesChanged, setCoordinatesChanged] = useState(false);

  useEffectAsync(async () => {
    const response = await getToken();
    if ("data" in response && response.data) {
      setUserID(getUserIDFromToken(response.data));
    }
  }, []);

  const {
    data: vendor,
    isSuccess: vendorQueryIsSuccess,
    isLoading: vendorQueryIsLoading,
  } = useVendorByOwnerIDQuery(userID!, { skip: !userID });

  const [initialValues, setInitalValues] = useState({
    name: "",
    businessAddress: "",
    latitude: 0,
    longitude: 0,
    phoneNumber: "",
    businessHours: "",
    website: "",
    description: "",
    socialmedialink: "",
    // vendorOperationAreas: []
  } as inputValues);

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (vendorQueryIsSuccess) {
      setInitalValues({
        businessLogo: vendor!.BusinessLogo,
        name: vendor!.Name,
        businessAddress: vendor!.BusinessAddress,
        latitude: vendor!.Latitude,
        longitude: vendor!.Longitude,
        phoneNumber: vendor!.Phone,
        businessHours: vendor!.BusinessHours,
        website: vendor!.Website,
        description: vendor!.Description,
        socialmedialink: vendor!.SocialMediaLink
      });
    }
  }, [vendorQueryIsSuccess]);

  const [getS3Credentials] = useS3CredentialsMutation();

  if (userID === null) {
    return <p>Not logged in</p>;
  }

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    businessAddress: Yup.string().required("Required"),
    latitude: Yup.number().required("Required"),
    longitude: Yup.number().required("Required"),
    phoneNumber: Yup.string().required("Required"),
    businessHours: Yup.string().required("Required"),
    website: Yup.string(),
    description: Yup.string(),
    socialmedialink: Yup.string()
  });

  const onSubmit = async (data: inputValues) => {
    setIsSubmitting(true);
    let photoID = data.businessLogo;
    if (logoFile) {
      // userID is defined at this point
      const s3Response = await getS3Credentials(userID!);
      if ("error" in s3Response) {
        throw new Error("could not get S3 credentials");
      }

      photoID = `${uuid()}.${getExtension(logoFile.name)}`;
      await uploadToS3(s3Response.data, photoID, logoFile);
    }

    const updatedVendor: Vendor = {
      ID: vendor!.ID,
      Name: data.name,
      BusinessAddress: data.businessAddress,
      Website: data.website,
      BusinessHours: data.businessHours,
      Phone: data.phoneNumber,
      BusinessLogo: photoID,
      Latitude: data.latitude,
      Longitude: data.longitude,
      Description: data.description,
      SocialMediaLink: data.socialmedialink,
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
        validateOnChange
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

          const onGetCoordinates = () =>
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setFieldValue("latitude", position.coords.latitude);
                setFieldValue("longitude", position.coords.longitude);
                setCoordinatesChanged(true);
              },
              (e) => {
                throw new Error(e.message);
              }
            );

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
                    setLogoFile(files[0]);
                  }}
                  multiple={false}
                />
              </label>
              {logoFile ? <p>{logoFile.name}</p> : null}
              <br />
              {values.businessLogo ? (
                <>
                  <Image
                    src={s3Prefix + values.businessLogo}
                    alt="logo"
                    style={{ width: 60, height: 60, objectFit: "cover" }}
                  />
                  <br />
                </>
              ) : null}
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
              <strong>Coordinates</strong>
              <br />
              <Buttons getLocation clicked={onGetCoordinates} type="button">
                Get current location
              </Buttons>
              {coordinatesChanged ? (
                <>
                  <br />
                  {values.latitude}, {values.longitude}
                </>
              ) : null}
              <br />
              <br />
              <Form.Field
                id="vendorArea"
                control={Select}
                multiple
                options={vendorOperatingAreas}
                placeholder="Operation Areas"
                searched
                required
                onBlur={handleBlur}
                label="Vendor Operating Areas"
                loading={vendorQueryIsLoading}
                // onChange={(_, area) => {
                //   setFieldValue("")
                // }}
              />
              <Form.Field
                id="cuisineTypes"
                control={Select}
                multiple
                options={cuisineTypes}
                placeholder="Cuisine Types"
                searched
                required
                onBlur={handleBlur}
                label="Cuisine Types"
                loading={vendorQueryIsLoading}
                // onChange={(_, area) => {
                //   setFieldValue("")
                // }}
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
