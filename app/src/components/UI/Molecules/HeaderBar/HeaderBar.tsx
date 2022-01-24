import React from "react";
import { Container, Header, Menu } from "semantic-ui-react";
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
        <Container className={styles.buttons}>
          {props.signUp ? (
            <Link to="/signup">
              <Container className="btnContainer">
                <Buttons signup>Sign Up</Buttons>
              </Container>
            </Link>
          ) : null}
          {props.login ? (
            <Link to="/login">
              <Container className="btnContainer">
                <Buttons login color="orange">
                  Login
                </Buttons>
              </Container>
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
