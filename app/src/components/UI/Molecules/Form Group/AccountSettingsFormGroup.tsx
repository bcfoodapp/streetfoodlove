import React, { ChangeEvent } from "react";
import { Container, Form, Icon } from "semantic-ui-react";
import Buttons from "../../Atoms/Button/Buttons";
import styles from "./accountformgroup.module.css";

const AccountSettingsFormGroup: React.FC<{
  disabled: boolean;
  setDisabledForm: (value: boolean) => void;
}> = ({ disabled, setDisabledForm }) => {
  const handleSubmit = () => {};
  return (
    <Container className={styles.wrapper}>
      <Form onSubmit={handleSubmit}>
        <Form.Group widths={2}>
          <Form.Input
            label="First Name"
            placeholder="First Name"
            disabled={disabled}
          />
          <Form.Input
            label="Last Name"
            placeholder="Last Name"
            disabled={disabled}
          />
          <Form.Input label="Email" placeholder="Email" disabled={disabled} />
        </Form.Group>
        <Container className={styles.saveBtn}>
          <Buttons submit color="green" clicked={() => setDisabledForm(true)}>
            Save
          </Buttons>
        </Container>
      </Form>
    </Container>
  );
};

export default AccountSettingsFormGroup;
