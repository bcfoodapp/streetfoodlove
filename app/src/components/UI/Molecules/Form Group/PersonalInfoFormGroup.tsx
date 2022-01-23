import React, { ChangeEvent } from "react";
import { Container, Form, Icon } from "semantic-ui-react";
import Buttons from "../../Atoms/Button/Buttons";

const PersonalInfoFormGroup: React.FC<{
  disabled: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}> = ({ disabled, onChange }) => {
  return (
    <Container>
      <Form>
        <Form.Group widths={2}>
          <Form.Input 
            label="First Name"
            placeholder="First Name"
            disabled={disabled}
            onChange={onChange}
          />
          <Form.Input 
            label="Last Name"
            placeholder="Last Name"
            disabled={disabled}
            onChange={onChange}
          />     
          <Form.Input 
            label="Email"
            placeholder="Email"
            disabled={disabled}
            onChange={onChange}
          />     
        </Form.Group>
        {/* <Container className={styles.saveBtn}>
          <Buttons submit color="green" clicked={() => setDisabledForm(true)}>
            Save
          </Buttons>
        </Container> */}
      </Form>
    </Container>
  );
};

export default PersonalInfoFormGroup;
