import React from "react";
import { Container, Form, Icon } from "semantic-ui-react";

const FormGroup: React.FC<{ disabled: boolean }> = ({ disabled }) => {
  return (
    <Container>
      <Form>
        <Form.Group unstackable widths={2}>
          <Form.Input
            label="First name"
            placeholder="First name"
            disabled={disabled}
          />
          <Form.Input
            label="Last name"
            placeholder="Last name"
            disabled={disabled}
          />
        </Form.Group>
        <Form.Group widths={2}>
          <Form.Input
            label="Address"
            placeholder="Address"
            disabled={disabled}
          />
          <Form.Input label="Phone" placeholder="Phone" disabled={disabled} />
        </Form.Group>
      </Form>
    </Container>
  );
};

export default FormGroup;
