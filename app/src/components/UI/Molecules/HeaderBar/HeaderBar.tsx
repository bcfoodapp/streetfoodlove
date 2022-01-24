import React from "react";
import { Container, Header, Icon, Menu, Dropdown } from "semantic-ui-react";
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
  <span className={styles.user}>
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
        {props.profile ? (
          <Dropdown
            trigger={ProfileIcon}
            options={options}
            disabled={false}
            simple={true}
          />
        ) : null}
        <Container className={styles.buttons}>
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
        </Container>
        {/* <Container>
          <Link to="/login">
            <Buttons login color="orange">
              Login
            </Buttons>
          </Link>          
        </Container> */}
      </Menu.Item>
    </Menu>
  );
}
