import {
  Container,
  Form,
  Header,
  Input,
  Select,
  TextArea,
} from "semantic-ui-react";
import Buttons from "../Atoms/Button/Buttons";
import MessageError from "../Atoms/Message/MessageError";
import HeaderBar from "../Molecules/HeaderBar/HeaderBar";
import styles from "./createvendorpage.module.css";
import { useCreateVendorMutation, Vendor } from "../../../api";
import { v4 as uuid } from "uuid";
import { Formik, FormikProps, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAppSelector } from "../../../store";

const fileInput = () => {
  return <Input type="file" className={styles.input} size="small" fluid />;
};

interface inputValues {
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
const CreateVendorPage: React.FC = () => {
  const [createVendor] = useCreateVendorMutation();

  const initialValues: inputValues = {
    name: "",
    businessAddress: "",
    phoneNumber: "",
    businessHours: "",
    website: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    businessAddress: Yup.string().required("Required"),
    phoneNumber: Yup.string().required("Required"),
    businessHours: Yup.string().required("Required"),
    website: Yup.string(),
  });

  const onSubmit = (data: inputValues) => {
    const id = uuid();
    const vendor: Vendor = {
      ID: id,
      Name: data.name,
      BusinessAddress: data.businessAddress,
      Website: data.website,
      BusinessHours: data.businessHours,
      Phone: data.phoneNumber,
      BusinessLogo: "",
      Latitude: 0,
      Longitude: 0,
    };
    createVendor(vendor);
    // Temporary output
    console.log(`vendor ID: ${id}`);
  };

  return (
    <Container className={styles.wrapper}>
      <HeaderBar logout />
      <Header as={"h2"} className={styles.header}>
        Create New Vendor Page
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

              <Buttons create color="green" dirty={dirty} valid={isValid}>
                Create
              </Buttons>
            </Form>
          );
        }}
      </Formik>
    </Container>
  );
};

export default CreateVendorPage;
