import React from "react";
import { Container, Form } from "semantic-ui-react";

const FormGroup: React.FC = () => {
  return (
    <Container>
      <Form>
        <Form.Group unstackable widths={2}>
          <Form.Input label='First name' placeholder='First name'/>
          <Form.Input label='Last name' placeholder='Last name'/>
        </Form.Group>
        <Form.Group widths={2}>
          <Form.Input label='Address' placeholder='Address'/>
          <Form.Input label='Phone' placeholder='Phone'/>
        </Form.Group>
      </Form>
    </Container>
  )
}

export default FormGroup