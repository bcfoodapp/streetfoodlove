import React from "react";
import classes from "./button.module.css";
import { Button } from "semantic-ui-react";

/**
 * This file assigns the respective classes and styling classes to all the different buttons on this app.
 */

export default function Buttons(props): React.ReactElement {
  let name = "";

  if (props.enter) name = classes.Enter;
  else if (props.submit) name = classes.Submit;
  else if (props.login) name = classes.Login;
  else if (props.signup) name = classes.Signup;
  else if (props.apply) name = classes.Apply;
  else if (props.getstarted) name = classes.getStarted;
  else if (props.logout) name = classes.Logout;
  else if (props.cancel) name = classes.Cancel;
  else if (props.writeReview) name = classes.writeReview;
  else throw new Error("Invalid Prop");

  return (
    <>
      <Button
        className={classes.Button + " " + name}
        color={props.color}
        onClick={props.clicked}
      >
        <span>{props.children}</span>
      </Button>
    </>
  );
}
