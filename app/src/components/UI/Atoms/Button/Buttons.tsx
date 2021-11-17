import React from "react";
import classes from "./button.module.css"
import { Button } from 'semantic-ui-react'

export default function Buttons(props) {

  let name = ''

  if (props.enter) name = classes.Submit;
  else if (props.login) name = classes.Login;
  else if (props.signup) name = classes.Signup
  else if (props.apply) name = classes.Apply
  else if (props.getstarted) name = classes.getStarted
  else if (props.logout) name = classes.Logout
  else throw new Error('Invalid Prop')
  console.log(name);

  return (
    <div>
      <span>Colin</span>
       <Button floated="right" className={classes.Button + ' ' + name}>
         <span>Testing</span>
       </Button>
    </div>
    // <Grid.Column floated={right}>
    // </Grid.Column>
  )
}