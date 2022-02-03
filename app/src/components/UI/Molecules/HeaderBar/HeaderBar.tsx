import React from "react";
import { Icon, Menu, Dropdown, DropdownItemProps } from "semantic-ui-react";
import Buttons from "../../Atoms/Button/Buttons";
import { SearchBox } from "../../Atoms/SearchBox/SearchBox";
import styles from "./headerbar.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { deleteCredentials } from "../../../../api";

/**
 * Returns the headerbar element
 */

const ProfileIcon = (
  <span>
    <Icon name="user circle" size="big" /> Hi Colin
  </span>
);

export default function HeaderBar(): React.ReactElement {
  const token = useSelector((state: any) => state.token.token);
  const navigate = useNavigate();

  const options: DropdownItemProps[] = [
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
    {
      key: "log-out",
      text: "Log Out",
      onClick: () => {
        deleteCredentials();
        navigate("/");
      },
    },
  ];

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
        {token === null ? (
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
        ) : null}
      </Menu.Menu>
    </Menu>
  );
}
