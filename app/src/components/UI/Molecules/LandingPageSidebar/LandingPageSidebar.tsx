import React from "react";
import {
  Container,
  Sidebar,
  Grid,
  Menu,
  Icon,
  Button,
  Checkbox,
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
        <Icon
          name="caret down"
          size="big"
          color="black"
          className={styles.downIcon}
        />
        <h3 className={styles.header}>Filters</h3>
        <h3 className={styles.header}>Cuisine</h3>
        <SelectFilter />
        <h3 className={styles.header}>Prices</h3>
        <Checkbox label="0~5$" className={styles.checkbox} />
        <Checkbox label="5~10$" className={styles.checkbox} />
        <Checkbox label="10~15$" className={styles.checkbox} />
        <Checkbox label="20+$" className={styles.checkbox} />
      </Menu.Item>
      <Menu.Item>
        <h3 className={styles.header}>Results</h3>
      </Menu.Item>
    </Sidebar>
  );
};

export default LandingPageSidebar;
