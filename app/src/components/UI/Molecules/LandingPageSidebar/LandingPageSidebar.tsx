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
      onHide={() => setVisible(false)}
      vertical
      visible={visible}
      width="wide"
      className={styles.sidebar}
    >
      <Menu.Item as="div">
        <Icon name='search' />
        <h3>
        Search
        </h3>
      </Menu.Item>
      <Menu.Item as="div">
        <Icon name='filter' />
        <h3>
          Filters
        </h3>
      </Menu.Item>
      {/* <Menu.Item as="a">
        Channels
      </Menu.Item> */}
    </Sidebar>
  );
};

export default LandingPageSidebar;
