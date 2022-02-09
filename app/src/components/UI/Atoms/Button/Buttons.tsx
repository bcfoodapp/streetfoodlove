import React from "react";
import classes from "./button.module.css";
import { Button, ButtonProps } from "semantic-ui-react";

/**
 * This file assigns the respective classes and styling classes to all the different buttons on this app.
 */

interface ButtonsProps {
  enter?: boolean;
  submit?: boolean;
  login?: boolean;
  signup?: boolean;
  apply?: boolean;
  getstarted?: boolean;
  cancel?: boolean;
  edit?: boolean;
  save?: boolean;
  writeReview?: boolean;
  color?: ButtonProps["color"];
  create?: boolean;
  clicked?: () => void | ((values: any) => void);
  children: React.ReactNode;
  valid?: boolean;
  dirty?: boolean;
  loading?: boolean;
}

export default function Buttons(props: ButtonsProps): React.ReactElement {
  let name = "";

  if (props.enter) name = classes.Enter;
  else if (props.submit) name = classes.Submit;
  else if (props.login) name = classes.Login;
  else if (props.signup) name = classes.Signup;
  else if (props.apply) name = classes.Apply;
  else if (props.getstarted) name = classes.getStarted;
  else if (props.cancel) name = classes.Cancel;
  else if (props.writeReview) name = classes.writeReview;
  else if (props.edit) name = classes.edit;
  else if (props.save) name = classes.save;
  else if (props.create) name = classes.create;
  else throw new Error("Invalid Prop");

  return (
    <>
      {props.valid === undefined || props.dirty === undefined ? (
        <Button
          className={classes.Button + " " + name}
          color={props.color}
          onClick={props.clicked}
          loading={props.loading}
        >
          <span>{props.children}</span>
        </Button>
      ) : (
        <Button
          className={classes.Button + " " + name}
          color={props.color}
          onClick={props.clicked}
          disabled={!props.valid || !props.dirty}
          loading={props.loading}
        >
          <span>{props.children}</span>
        </Button>
      )}
    </>
  );
}
