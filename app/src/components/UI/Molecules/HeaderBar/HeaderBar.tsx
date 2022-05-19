import React from "react";
import { Dropdown, Image, Menu } from "semantic-ui-react";
import Buttons from "../../Atoms/Button/Buttons";
import { SearchBox } from "../../Atoms/SearchBox/SearchBox";
import styles from "./headerbar.module.css";
import { Link, useNavigate } from "react-router-dom";
import {
  clearLocalStorage,
  getCredentialsEntry,
  UserType,
} from "../../../../api";
import { s3Prefix } from "../../../../aws";

/**
 * Returns the headerbar element
 */

export default function HeaderBar(): React.ReactElement {
  const storeEntry = getCredentialsEntry();

  const navigate = useNavigate();

  const options = [
    {
      key: "user",
      text: (
        <span>
          Signed in as <strong>{storeEntry?.Name}</strong>
        </span>
      ),
      disabled: true,
    },
    {
      key: "profile",
      text: "Profile Settings",
      onClick: () => navigate("/account-profile"),
    },
    {
      key: "nearby-vendors",
      text: "Vendors Near You",
      onClick: () => navigate("/nearby-vendors"),
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

  if (storeEntry?.UserType === UserType.Vendor) {
    options.splice(3, 0, {
      key: "vendor-dashboard",
      text: "Vendor Dashboard",
      onClick: () => navigate("/vendor-dashboard"),
    });
  }

  return (
    <Menu size="massive" className={styles.menu}>
      <Link to="/">
        <Menu.Item>
          <h2 className={styles.title}>
            <Image
              src="/streetfoodlove/logo.svg"
              alt="StreetFoodLove logo"
              style={{ width: 200 }}
            />
          </h2>
        </Menu.Item>
      </Link>
      <SearchBox />
      <Menu.Menu position="right">
        {storeEntry ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Image
              src={s3Prefix + storeEntry.UserPhoto}
              alt="user photo"
              style={{ width: 30, height: 30, objectFit: "cover" }}
            />
            &nbsp;&nbsp;
            <Dropdown
              inline
              text={storeEntry?.Name}
              options={options}
              className={styles.dropdown}
            />
          </div>
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
