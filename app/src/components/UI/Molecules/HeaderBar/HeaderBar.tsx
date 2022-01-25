import React from "react";
import {
  Container,
  Header,
  Icon,
  Menu,
  Dropdown,
  Button,
} from "semantic-ui-react";
import Buttons from "../../Atoms/Button/Buttons";
import { SearchBox } from "../../Atoms/SearchBox/SearchBox";
import styles from "./headerbar.module.css";
import { Link } from "react-router-dom";

/**
 * Returns the headerbar element
 */

interface Props {
  signUp?: boolean;
  login?: boolean;
  profile?: boolean;
}

const ProfileIcon = (
  <span>
    <Icon name="user circle" size="big" /> Hi Colin
  </span>
);

const options = [
  {
    key: "user",
    text: (
      <span>
        Signed in as <strong>Colin Zhou</strong>
      </span>
    ),
    disabled: true,
  },
  { key: "profile", text: "Profile Settings" },
  { key: "page", text: "Create Vendor Page" },
  { key: "help", text: "Help" },
  { key: "sign-out", text: "Sign Out" },
];

export default function HeaderBar(props: Props): React.ReactElement {
  return (
    <Menu size="massive">
      <Menu.Item>
        <h2>StreetFoodLove</h2>
      </Menu.Item>
      <SearchBox />

      <Menu.Menu position="right">
        <Dropdown
          trigger={ProfileIcon}
          options={options}
          className={styles.dropdown}
        />
        <Menu.Item>
          {props.signUp ? (
            <Link to="/signup">
              <Buttons signup>Sign Up</Buttons>
            </Link>
          ) : null}
          {props.login ? (
            <Link to="/login">
              <Buttons login color="orange">
                Login
              </Buttons>
            </Link>
          ) : null}
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
}
