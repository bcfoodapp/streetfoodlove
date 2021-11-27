import React from "react";
import {
  Header,
  Menu
} from "semantic-ui-react";
import Buttons from "../../Atoms/Button/Buttons";
import { SearchBox } from "../../Atoms/SearchBox/SearchBox";
import styles from "./headerbar.module.css";
import { Link } from "react-router-dom";

/**
 * Returns the headerbar element
 */

export default function HeaderBar(): React.ReactElement {
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
        {/* TODO need feedback for logged in status by hiding these buttons */}
        <Buttons signup color="white">
          Sign Up
        </Buttons>
        <Link to="/login">
          <Buttons login color="orange">
            Login
          </Buttons>
        </Link>
      </Menu.Item>
    </Menu>
  );
}
