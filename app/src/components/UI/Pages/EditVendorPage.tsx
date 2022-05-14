import {
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
  useUploadToS3Mutation,
  useCuisineTypesByVendorIDQuery,
  CuisineTypes,
  Areas,
  useAreasByVendorIDQuery,
  useCreateCuisineTypeMutation,
  useCreateAreaMutation,
  useLocationRoleMutation,
  useDeleteAreaMutation,
  useDeleteCuisineTypeMutation,
} from "../../../api";
import { Formik, FormikProps, ErrorMessage } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import DragAndDrop from "../Organisms/DragAndDrop/DragAndDrop";
import { s3Prefix } from "../../../aws";
import { v4 as uuid } from "uuid";
import * as aws from "../../../aws";
import LocationInput, {
  LocationInputDropdownValue,
} from "../Molecules/LocationInput/LocationInput";

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
  discountEnabled: boolean;
  cuisines: string[];
  areaNames: string[];
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
  const [getToken] = useGetTokenMutation();
  const [userID, setUserID] = useState(null as string | null);
  const [logoFile, setLogoFile] = useState(null as File | null);
  const [coordinatesChanged, setCoordinatesChanged] = useState(false);
  const [submitCuisine] = useCreateCuisineTypeMutation();
  const [submitArea] = useCreateAreaMutation();
  const [deleteArea] = useDeleteAreaMutation();
  const [deleteCuisineType] = useDeleteCuisineTypeMutation();

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

  const {
    data: cuisines,
    isSuccess: cuisineQueryIsSuccess,
    isLoading: cuisineQueryIsLoading,
  } = useCuisineTypesByVendorIDQuery(vendor?.ID!, { skip: !vendor });

  console.log(cuisines);

  const {
    data: areas,
    isSuccess: areaQueryIsSuccess,
    isLoading: areaQueryIsLoading,
  } = useAreasByVendorIDQuery(vendor?.ID!, {
    skip: !vendor,
  });

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
    discountEnabled: false,
    cuisines: [],
    areaNames: [],
    businessLogo: "",
  } as inputValues);

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (vendorQueryIsSuccess && cuisineQueryIsSuccess && areaQueryIsSuccess) {
      console.log(cuisines);
      console.log(areas);

      let currentCuisines: string[] = [];
      let currentAreas: string[] = [];

      for (const element of cuisines!) {
        currentCuisines.push(element.CuisineType);
      }

      for (const element of areas!) {
        currentAreas.push(element.AreaName);
      }

      console.log(currentCuisines);

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
        socialmedialink: vendor!.SocialMediaLink,
        discountEnabled: vendor!.DiscountEnabled,
        cuisines: currentCuisines,
        areaNames: currentAreas,
      });
    }
  }, [vendorQueryIsSuccess, cuisineQueryIsSuccess, areaQueryIsSuccess]);

  const [getS3Credentials] = useS3CredentialsMutation();
  const [uploadToS3] = useUploadToS3Mutation();
  const [getLocationRole] = useLocationRoleMutation();

  const [locationInputOption, setLocationInputOption] = useState(
    "address" as LocationInputDropdownValue
  );

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
    discountEnabled: Yup.boolean(),
    description: Yup.string(),
    socialmedialink: Yup.string(),
    cuisines: Yup.array().min(1).required("Required"),
    areaNames: Yup.array().min(1).required("Required"),
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
      await uploadToS3({
        credentials: s3Response.data,
        objectKey: photoID,
        file: logoFile,
      });
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
      Owner: vendor!.Owner,
      DiscountEnabled: data.discountEnabled,
    };

    switch (locationInputOption) {
      case "address":
        // Since location input is address, set coordinate using address
        const locationRoleResponse = await getLocationRole(userID);
        if ("error" in locationRoleResponse) {
          return;
        }

        // For some reason, useLazyQuery does not return the result, so aws.addressToCoordinates() is
        // called directly.
        const coordinates = await aws.addressToCoordinates(
          locationRoleResponse.data,
          data.businessAddress
        );
        if (coordinates) {
          updatedVendor.Latitude = coordinates[0];
          updatedVendor.Longitude = coordinates[1];
        }
        break;
    }

    const response = await updateVendor(updatedVendor);

    if ("data" in response) {
      // await deleteCuisineType(data.cuisines[0].)

      for (let queriedCuisines of cuisines!) {
        await deleteCuisineType(queriedCuisines.ID);
      }

      for (const cuisine of data.cuisines) {
        const cuisines: CuisineTypes = {
          ID: uuid(),
          VendorID: vendor!.ID,
          CuisineType: cuisine,
        };

        await submitCuisine(cuisines);
      }

      for (let queriedAreas of areas!) {
        await deleteArea(queriedAreas.ID);
      }

      for (const area of data.areaNames) {
        const areas: Areas = {
          ID: uuid(),
          VendorID: vendor!.ID,
          AreaName: area,
        };

        await submitArea(areas);
      }

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
              <strong>
                Location <span style={{ color: "#db2828" }}>*</span>
              </strong>
              <LocationInput
                userID={userID}
                onBlur={(e) => {
                  handleBlur(e);
                }}
                dropdownOption={locationInputOption}
                onDropdownOptionChange={setLocationInputOption}
                businessAddress={values.businessAddress}
                onBusinessAddressChange={(value) =>
                  setFieldValue("businessAddress", value)
                }
                coordinates={[values.latitude, values.longitude]}
                onCoordinateChange={(value) => {
                  setFieldValue("latitude", value[0]);
                  setFieldValue("longitude", value[1]);
                }}
                error={Boolean(errors["businessAddress"])}
                loading={vendorQueryIsLoading}
              />
              <ErrorMessage
                name="businessAddress"
                component="span"
                className={styles.error}
              />

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
                loading={areaQueryIsLoading}
                value={values.areaNames}
                onChange={(_, areas) => {
                  setFieldValue("areaNames", areas.value);
                }}
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
                loading={cuisineQueryIsLoading}
                value={values.cuisines}
                onChange={(_, cuisine) => {
                  console.log(values.cuisines);
                  setFieldValue("cuisines", cuisine.value);
                  console.log(initialValues.cuisines);
                  console.log(cuisine.value);
                }}
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
              <strong>Discount exchange</strong>
              <Form.Checkbox
                name="discountEnabled"
                label="Reward discount in exchange for review"
                checked={values.discountEnabled}
                onChange={(_, data) =>
                  setFieldValue("discountEnabled", data.checked)
                }
              />
              <p style={{ marginLeft: 25 }}>
                Enable this option if you would like to reward a discount to
                your business for posting a review on your vendor page.
              </p>
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
