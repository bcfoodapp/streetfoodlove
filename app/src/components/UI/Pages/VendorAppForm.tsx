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
  useCreateCuisineTypeMutation,
  useCreateAreaMutation,
  CuisineTypes,
  Areas,
  useLocationRoleMutation,
} from "../../../api";
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";
import LocationInput, {
  LocationInputDropdownValue,
} from "../Molecules/LocationInput/LocationInput";
import * as aws from "../../../aws";
import { DateTime } from "luxon";

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
  latitude: number;
  longitude: number;
  phoneNumber: string;
  fromHour: string;
  toHour: string;
  website: string;
  agreedConditions: boolean;
  cuisines: string[];
  areaNames: string[];
}

export default function VendorAppForm(): React.ReactElement {
  const navigate = useNavigate();
  const [createVendor] = useCreateVendorMutation();
  const [getToken, { isSuccess: tokenIsSuccess }] = useGetTokenMutation();
  const [userID, setUserID] = useState(null as string | null);
  const [locationInputOption, setLocationInputOption] = useState(
    "address" as LocationInputDropdownValue
  );
  const [submitCuisine] = useCreateCuisineTypeMutation();
  const [submitArea] = useCreateAreaMutation();
  const [getLocationRole] = useLocationRoleMutation();

  useEffectAsync(async () => {
    const response = await getToken();
    if ("data" in response && response.data) {
      setUserID(getUserIDFromToken(response.data));
    }
  }, []);

  if (userID === null) {
    return <p>Not logged in</p>;
  }

  const onSubmit = async (data: inputValues) => {
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
      LastLocationUpdate: DateTime.now(),
      Description: "",
      SocialMediaLink: "",
      Owner: userID,
      DiscountEnabled: false,
    };

    const locationRoleResponse = await getLocationRole(userID);
    if ("error" in locationRoleResponse) {
      return;
    }

    switch (locationInputOption) {
      case "address": {
        const coordinates = await aws.addressToCoordinates(
          locationRoleResponse.data,
          data.businessAddress
        );
        if (coordinates) {
          vendor.Latitude = coordinates[0];
          vendor.Longitude = coordinates[1];
        }
        break;
      }
      case "coordinates": {
        const address = await aws.coordinatesToAddress(
          locationRoleResponse.data,
          [data.latitude, data.longitude]
        );
        if (address) {
          vendor.BusinessAddress = address;
        }
        break;
      }
    }

    const response = await createVendor(vendor);
    if ("data" in response) {
      for (const cuisine of data.cuisines) {
        const cuisineTypes: CuisineTypes = {
          ID: uuid(),
          VendorID: vendor.ID,
          CuisineType: cuisine,
        };

        await submitCuisine(cuisineTypes);
      }

      for (const area of data.areaNames) {
        const areas: Areas = {
          ID: uuid(),
          VendorID: vendor.ID,
          AreaName: area,
        };

        await submitArea(areas);
      }

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
    latitude: 0,
    longitude: 0,
    website: "",
    fromHour: "",
    toHour: "",
    phoneNumber: "",
    agreedConditions: false,
    cuisines: [],
    areaNames: [],
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    businessAddress: Yup.string().required("Required"),
    website: Yup.string(),
    fromHour: Yup.string().required("Required"),
    toHour: Yup.string().required("Required"),
    phoneNumber: Yup.string().required("Required"),
    agreedConditions: Yup.bool().oneOf([true], "Required"),
    cuisines: Yup.array().min(1).required("Required"),
    areaNames: Yup.array().min(1).required("Required"),
  });

  return (
    <Container className={styles.wrapper}>
      <Container className={styles.signUpWrapper}>
        <h1>Sign Up Form (Vendor account)</h1>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          validateOnChange
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
                <strong>
                  Location <span style={{ color: "#db2828" }}>*</span>
                </strong>
                <LocationInput
                  userID={userID}
                  onBlur={handleBlur}
                  dropdownOption={locationInputOption}
                  onDropdownOptionChange={setLocationInputOption}
                  businessAddress={values.businessAddress}
                  onBusinessAddressChange={(value) => {
                    setFieldValue("businessAddress", value);
                  }}
                  coordinates={[values.latitude, values.longitude]}
                  onCoordinateChange={(value) => {
                    setFieldValue("latitude", value[0]);
                    setFieldValue("longitude", value[1]);
                  }}
                  error={
                    touched.businessAddress && Boolean(errors.businessAddress)
                  }
                />
                <Form.Field
                  id="vendorArea"
                  name="vendorArea"
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
                  error={touched.areaNames && Boolean(errors.areaNames)}
                  onChange={(e, data) => {
                    setFieldValue("areaNames", data.value);
                  }}
                />
                <Form.Field
                  id="cuisineTypes"
                  name="cuisineTypes"
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
                  error={touched.cuisines && Boolean(errors.cuisines)}
                  onChange={(e, data) => {
                    setFieldValue("cuisines", data.value);
                  }}
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
                <h5>
                  Business Hours <span style={{ color: "#db2828" }}>*</span>
                </h5>
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
                <Container className={styles.fileUpload}>
                  <h5>Logo Upload</h5>
                  <input
                    type="file"
                    className={styles.fileInput}
                    name="myfile"
                    width={15}
                  />
                </Container>

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
