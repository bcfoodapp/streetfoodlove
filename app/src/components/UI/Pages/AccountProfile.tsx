import React from "react";
import { Container } from "semantic-ui-react";
import styles from "./accountprofile.module.css";
import { Tab } from "semantic-ui-react";
import HeaderBar from "../Molecules/HeaderBar/HeaderBar";
import FormGroup from "../Molecules/Form Group/FormGroup";
import Buttons from "../Atoms/Button/Buttons";

const AccountProfile: React.FC = () => {
  const panes = [
    {
      menuItem: "Account Settings",
      render: () => (
        <Tab.Pane className={styles.pane}>
          <FormGroup />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Personal Information",
      render: () => <Tab.Pane className={styles.pane}>Tab 2 Content</Tab.Pane>,
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
          <Buttons save color="green">Save</Buttons>
        </Container>
      </Container>
    </Container>
  );
};

export default AccountProfile;
