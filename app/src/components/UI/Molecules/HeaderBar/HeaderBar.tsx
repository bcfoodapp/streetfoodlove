import React from "react";
import { Icon, Menu, Dropdown } from "semantic-ui-react";
import Buttons from "../../Atoms/Button/Buttons";
import { SearchBox } from "../../Atoms/SearchBox/SearchBox";
import styles from "./headerbar.module.css";
import { Link, useNavigate } from "react-router-dom";
import { clearLocalStorage, getCredentialsEntry } from "../../../../api";

/**
 * Returns the headerbar element
 */

export default function HeaderBar(): React.ReactElement {
  const name = getCredentialsEntry()?.Name;

  const navigate = useNavigate();

  const ProfileIcon = (
    <span>
      <Icon name="user circle" size="big" /> Hi {name}
    </span>
  );

  const options = [
    {
      key: "user",
      text: (
        <span>
          Signed in as <strong>{name}</strong>
        </span>
      ),
      disabled: true,
    },
    {
      key: "profile",
      text: "Profile Settings",
      onClick: () => {
        navigate("/account-profile");
      },
    },
    {
      key: "page",
      text: "Edit Vendor Page",
      onClick: () => {
        navigate("/edit-vendor-page");
      },
    },
    { key: "help", text: "Help" },
    {
      key: "log-out",
      text: "Log Out",
      onClick: () => {
        clearLocalStorage();
        navigate("/");
      },
    },
  ];

  return (
    <Menu size="massive" className={styles.menu}>
      <Link to="/">
        <Menu.Item>
          <h2>StreetFoodLove</h2>
        </Menu.Item>
      </Link>
      <SearchBox />
      <Menu.Menu position="right">
        {name ? (
          <Dropdown
            trigger={ProfileIcon}
            options={options}
            className={styles.dropdown}
          />
        ) : (
          <Menu.Item>
            <Link to="/account-selection">
              <Buttons signup>Sign Up</Buttons>
            </Link>
            <Link to="/login">
              <Buttons login color="orange">
                Login
              </Buttons>
            </Link>
          </Menu.Item>
        )}
      </Menu.Menu>
    </Menu>
  );
}
