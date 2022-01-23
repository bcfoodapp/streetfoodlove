import React, { ChangeEvent, useState } from "react";
import { Container, Icon } from "semantic-ui-react";
import styles from "./accountprofile.module.css";
import { Tab } from "semantic-ui-react";
import HeaderBar from "../Molecules/HeaderBar/HeaderBar";
import FormGroup from "../Molecules/Form Group/FormGroup";
import Buttons from "../Atoms/Button/Buttons";
import { UserProtected, useUserProtectedQuery } from "../../../api";

const AccountProfile: React.FC = () => {
  const [disabledForm, setDisabledForm] = useState<boolean>(true);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    let test = event.target.value as unknown as UserProtected
  }

  const panes = [
    {
      menuItem: "Account Settings",
      render: () => (
        <Tab.Pane className={styles.pane}>
          <h2>Personal Credentials</h2>
          <Container className={styles.editBtn}>
            <Buttons edit clicked={() => setDisabledForm(false)} color="blue">
              Edit
            </Buttons>
          </Container>
          <FormGroup
            disabled={disabledForm}
            formLabels={[
              "First Name!",
              "Last Name!",
              "Email!",
              "SignUp Date",
              "Username",
              "Photo",
            ]}
            onChange={onChange}
          />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Personal Information",
      render: () => (
        <Tab.Pane className={styles.pane}>
          <h2>Personal Information</h2>
          <Container className={styles.editBtn}>
            <Buttons edit clicked={() => setDisabledForm(false)} color="blue">
              Edit
            </Buttons>
          </Container>
          <FormGroup
            disabled={disabledForm}
            formLabels={["Information 1", "Information 2"]}
            onChange={onChange}
          />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Privacy",
      render: () => <Tab.Pane className={styles.pane}>Tab 3 Content</Tab.Pane>,
    },
  ];

  return (
    <Container className={styles.wrapper}>
      <HeaderBar />
      <h2>Profile</h2>
      <Container className={styles.profileActions}>
        <Tab
          menu={{ fluid: true, vertical: true, tabular: true }}
          panes={panes}
        />
        <Container className={styles.saveBtn}>
          <Buttons save color="green" clicked={() => setDisabledForm(true)}>
            Save
          </Buttons>
        </Container>
      </Container>
    </Container>
  );
};

export default AccountProfile;
