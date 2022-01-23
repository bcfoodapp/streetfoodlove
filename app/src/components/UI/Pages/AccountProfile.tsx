import React, { ChangeEvent, useState } from "react";
import { Container, Icon } from "semantic-ui-react";
import styles from "./accountprofile.module.css";
import { Tab } from "semantic-ui-react";
import HeaderBar from "../Molecules/HeaderBar/HeaderBar";
import AccountSettingsFormGroup from "../Molecules/Form Group/AccountSettingsFormGroup";
import Buttons from "../Atoms/Button/Buttons";
import { UserProtected, useUserProtectedQuery } from "../../../api";
import PersonalInfoFormGroup from "../Molecules/Form Group/PersonalInfoFormGroup";

const AccountProfile: React.FC = () => {
  const [disabledForm, setDisabledForm] = useState<boolean>(true);

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
          <AccountSettingsFormGroup
            disabled={disabledForm}
            setDisabledForm={setDisabledForm}
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
          <PersonalInfoFormGroup 
            setDisabledForm={setDisabledForm}
            disabled={disabledForm}          
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
        {/* <Container className={styles.saveBtn}>
          <Buttons save color="green" clicked={() => setDisabledForm(true)}>
            Save
          </Buttons>
        </Container> */}
      </Container>
    </Container>
  );
};

export default AccountProfile;
