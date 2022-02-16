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
      // onHide={() => setVisible(true)}
      vertical
      visible={visible}
      width="wide"
      className={styles.sidebar}
    >
      <Button icon onClick={() => setVisible(false)} className={styles.closeIcon}>
        <Icon name="close" size="big" color="grey"/>
      </Button>
      <Menu.Item as="div" className={styles.menuItem}>
          <Icon name='search' />
          <h3>Search</h3>
          
        {/* <Container>
        </Container>
        <Container>
        </Container> */}
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
