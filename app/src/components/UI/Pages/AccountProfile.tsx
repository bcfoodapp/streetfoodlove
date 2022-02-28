import React, { useState } from "react";
import { Container } from "semantic-ui-react";
import styles from "./accountprofile.module.css";
import { Tab } from "semantic-ui-react";
import AccountSettingsFormGroup from "../Molecules/Form Group/AccountSettingsFormGroup";
import Buttons from "../Atoms/Button/Buttons";
import AccountProfileStars from "../Organisms/AccountProfileStars/AccountProfileStars";

const AccountProfile: React.FC = () => {
  const [disabledForm, setDisabledForm] = useState<boolean>(true);

  const panes = [
    {
      menuItem: "Account Settings",
      render: () => (
        <Tab.Pane className={styles.pane}>
          <h2 className={styles.header}>Account Settings</h2>
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
      menuItem: "Starred Vendors",
      render: () => (
        <Tab.Pane className={styles.pane}>
          <AccountProfileStars />
        </Tab.Pane>
      ),
    },
  ];

  return (
    <Container className={styles.wrapper}>
      <h2>Profile</h2>
      <Container className={styles.profileActions}>
        <Tab
          menu={{ fluid: true, vertical: true, tabular: true }}
          panes={panes}
        />
      </Container>
    </Container>
  );
};

export default AccountProfile;

function Direction(props) {
  const {direction} = props

  return (
    <div>
      {direction === 0 ? (
        <p>North</p>
      ) : direction === 1 ? (
        <p>East</p>
      ) : direction === 2 ? (
        <p>South</p>
      ) : direction === 3 ? (
        <p>West</p>
      ) : null}
    </div>
  )
}

function Direction2() {
  const [direction, setDirection] = useState(0)

  const increment = () => {
    if (direction === 3) {
      setDirection(0)
    } else {
      setDirection(direction + 1)
    }
  }

  return (
    <div>
      <button onClick={() => increment()}>Rotate</button>
      <Direction direction={direction}/>
    </div>
  )
}

