import React, { ChangeEvent } from "react";
import { Container, Form, Icon } from "semantic-ui-react";
import Buttons from "../../Atoms/Button/Buttons";
import styles from './personalinfogroup.module.css'

const PersonalInfoFormGroup: React.FC<{
  disabled: boolean;
  setDisabledForm: (value: boolean) => void

}> = ({ disabled, setDisabledForm }) => {

  const handleSubmit = () => {

  }

  return (
    <Container>
      <Form>
        <Form.Group widths={2}>
          <Form.Input 
            label="Field 1"
            placeholder="Field 1"
            disabled={disabled}
          />
          <Form.Input 
            label="Field 2"
            placeholder="Filed 2"
            disabled={disabled}
          />     
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

export default PersonalInfoFormGroup;
