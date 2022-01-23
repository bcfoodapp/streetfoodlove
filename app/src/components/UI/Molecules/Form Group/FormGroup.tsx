import React from "react";
import { Container, Form, Icon } from "semantic-ui-react";
import { UserProtected } from "../../../../api";

const FormGroup: React.FC<{
  disabled: boolean;
  formLabels: string[];
  value: UserProtected;
  onChange: (value: UserProtected) => void;
}> = ({ disabled, formLabels, value, onChange }) => {
  var tempElement: any;
  return (
    <Container>
      <Form>
        {formLabels.map((element, key) => {
          if (key % 2 == 0) {
            tempElement = (
              <Form.Input
                label={element}
                placeholder={element}
                disabled={disabled}
                key={key}
              />
            );
          } else {
            return (
              <Form.Group widths={3}>
                {tempElement}
                <Form.Input
                  label={element}
                  placeholder={element}
                  disabled={disabled}
                  key={key}
                />
              </Form.Group>
            );
          }
        })}
      </Form>
    </Container>
  );
};

export default FormGroup;
