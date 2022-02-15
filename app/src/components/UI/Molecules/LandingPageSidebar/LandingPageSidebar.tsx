import React from "react";
import { Container, Sidebar, Grid, Menu, Icon, Button } from "semantic-ui-react";
import styles from "./sidebar.module.css";

const LandingPageSidebar: React.FC<{setVisible: (param) => void, visible: boolean}> = ({setVisible, visible}) => {

  return (
    <Sidebar
      as={Menu}
      animation="overlay"
      icon="labeled"
      inverted
      // onHide={() => setVisible(false)}
      vertical
      visible={visible}
      width="wide"
      className={styles.sidebar}
    >
      <Menu.Item>
        <Button icon className={styles.closeIcon} onClick={() => setVisible(false)}>
          <Icon name="close" size="large" color={"grey"}/>
        </Button>
      </Menu.Item>
      <Menu.Item as="a">
        {/* <Icon name='home' /> */}
        Home
      </Menu.Item>
      <Menu.Item as="a">
        {/* <Icon name='gamepad' /> */}
        Games
      </Menu.Item>
      <Menu.Item as="a">
        {/* <Icon name='camera' /> */}
        Channels
      </Menu.Item>
    </Sidebar>
  );
};

export default LandingPageSidebar;
