import React, { ChangeEvent } from "react";
import { Container, Form, Icon } from "semantic-ui-react";
import { UserProtected } from "../../../../api";

const FormGroup: React.FC<{
  disabled: boolean;
  formLabels: string[];
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}> = ({ disabled, formLabels, onChange }) => {
  var tempElement: any;
  return (
    <Container>
      <Form>
        {formLabels.map((element, key) => {
          if (key % 2 == 0) {
            if (element.endsWith("!")) {
              tempElement = (
                <Form.Input
                label={element}
                placeholder={element}
                disabled={disabled}
                key={key}
                onChange={onChange}
              />  
              )
            } else {
              tempElement = (
                <Form.Input
                  label={element}
                  placeholder={element}
                  disabled={disabled}
                  key={key}
                />
              );
            }

          } else {
            if (element.endsWith("!")) {
                return (
                <Form.Group widths={3}>
                  {tempElement}
                  <Form.Input
                    label={element}
                    placeholder={element}
                    disabled={disabled}
                    key={key}
                    onChange={onChange}
                  />                
                </Form.Group>
              )
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
          }
        })}
      </Form>
    </Container>
  );
};

export default FormGroup;
