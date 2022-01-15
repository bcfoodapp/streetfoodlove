import React from "react";
import { Header, Menu } from "semantic-ui-react";
import Buttons from "../../Atoms/Button/Buttons";
import { SearchBox } from "../../Atoms/SearchBox/SearchBox";
import styles from "./headerbar.module.css";
import { Link } from "react-router-dom";

/**
 * Returns the headerbar element
 */

interface Props {
  signUp?: boolean;
}

export default function HeaderBar(props: Props): React.ReactElement {
  return (
    <Menu as="div" className={styles.wrapContainer} fluid widths={3}>
      <Menu.Item as="a" className={styles.header} position="left">
        <Link to="/">
          <Header as="h1">StreetFoodLove</Header>
        </Link>
      </Menu.Item>
      <Menu.Item as="a">
        <SearchBox />
      </Menu.Item>
      <Menu.Item position="right">
        {/* TODO need indication for logged in status by hiding these buttons */}
        {props.signUp ? <Buttons signup>Sign Up</Buttons> : null}
        <Link to="/login">
          <Buttons login color="orange">
            Login
          </Buttons>
        </Link>
      </Menu.Item>
    </Menu>
  );
}
