import React from "react";
import { Icon, Menu, Dropdown, Button } from "semantic-ui-react";
import Buttons from "../../Atoms/Button/Buttons";
import { SearchBox } from "../../Atoms/SearchBox/SearchBox";
import styles from "./headerbar.module.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * Returns the headerbar element
 */

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
  { key: "sign-out", text: "Log Out" },
];

export default function HeaderBar(): React.ReactElement {
  const token = useSelector((state: any) => state.token.token);

  return (
    <Menu size="massive">
      <Menu.Item>
        <h2>StreetFoodLove</h2>
      </Menu.Item>
      <SearchBox />

      <Menu.Menu position="right">
        {token !== null ? (
          <Dropdown
            trigger={ProfileIcon}
            options={options}
            className={styles.dropdown}
            // onChange={() => window.location.reload()}
          />
        ) : null}
        <Menu.Item>
          <Link to="/signup">
            <Buttons signup>Sign Up</Buttons>
          </Link>
          {token === null ? (
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
