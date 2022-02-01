import React from "react";
import { Container, Input, Menu } from "semantic-ui-react";
import styles from "./searchbox.module.css";
import Buttons from "../Button/Buttons";

/**
 * This is the searchbox for the header
 */

export const SearchBox: React.FC = () => {
  const searchEnterHandler = () => {};

  return (
    <Menu.Item className={styles.searchBox}>
      <Input
        icon={
          <Buttons enter color={"green"} clicked={searchEnterHandler}>
            Enter
          </Buttons>
        }
        placeholder="Search..."
        focus
      />
    </Menu.Item>
  );
};
