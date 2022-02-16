import React from "react";
import {
  Container,
  Sidebar,
  Grid,
  Menu,
  Icon,
  Button,
} from "semantic-ui-react";
import { SearchBox } from "../../Atoms/SearchBox/SearchBox";
import SelectFilter from "../MultiSelectFilter/SelectFilter";
import styles from "./sidebar.module.css";

const LandingPageSidebar: React.FC<{
  setVisible: (param) => void;
  visible: boolean;
}> = ({ setVisible, visible }) => {
  return (
    <Sidebar
      as={Menu}
      animation="overlay"
      icon="labeled"
      inverted
      vertical
      visible={visible}
      width="very wide"
      className={styles.sidebar}
    >
      <Button
        icon
        onClick={() => setVisible(false)}
        className={styles.closeIcon}
      >
        <Icon name="close" size="big" color="grey" />
      </Button>
      <Menu.Item as="div" className={styles.menuItem}>
        <h3 className={styles.header}>Search</h3>
        <Container className={styles.search}>
          <SearchBox />
        </Container>
      </Menu.Item>
      <Menu.Item as="div" className={styles.menuItem}>
        <h3 className={styles.header}>Filters</h3>
        <SelectFilter />
      </Menu.Item>
    </Sidebar>
  );
};

export default LandingPageSidebar;
