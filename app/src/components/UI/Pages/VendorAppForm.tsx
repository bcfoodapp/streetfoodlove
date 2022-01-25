import React from "react";
import { Form, Container, Button } from "semantic-ui-react";
import Buttons from "../Atoms/Button/Buttons";
import HeaderBar from "../Molecules/HeaderBar/HeaderBar";
import { Dropdown } from "semantic-ui-react";
import styles from "./vendorappform.module.css";

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

  return (
    <Container className={styles.signUpWrapper}>
      <HeaderBar login/>
      <h1>Sign Up Form (Vendor account)</h1>
      <Form className={styles.form}>
        <Form.Input
          // error={{ content: 'Please enter your first name', pointing: 'below' }}
          fluid
          label="Name"
          placeholder="Name"
          id="form-input-first-name"
          required
          width={5}
        />
        <Form.Input
          // error='Please enter your last name'
          fluid
          label="Business Address"
          placeholder="Business Address"
          required
          width={5}
        />
        <Form.Input
          // error='Please enter your last name'
          fluid
          label="Website URL"
          placeholder="Website URL"
          required
          width={5}
        />
        <h5>Business Hours: </h5>
        <Dropdown
          placeholder="From"
          search
          selection
          options={startTimeOptions}
        />
        <Dropdown
          placeholder="To"
          search
          selection
          options={endTimeOptions}
          className={styles.dropdown}
        />
        <Form.Input
          // error='Please enter your last name'
          fluid
          label="Phone"
          placeholder="Phone"
          required
          width={5}
          className={styles.phoneInput}
        />
        <h5>Logo Upload</h5>
        <input type="file" className={styles.fileInput} name="myfile" />
        <Form.Checkbox
          label="I agree to the Terms and Conditions"
          required
          className={styles.checkBox}
        />
      </Form>
      <Container className={styles.btnContainer}>
        <Buttons clicked={() => storeUserInfo} color="green" signup>
          Sign Up
        </Buttons>
      </Container>
    </Container>
  );
}
