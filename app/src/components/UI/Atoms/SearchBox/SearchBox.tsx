import React from "react";
import { Container, Input } from "semantic-ui-react";
import styles from "./searchbox.module.css";
import Buttons from "../Button/Buttons";

export const SearchBox: React.FC = () => {
  return (
    <Container className={styles.searchBox}>
      <Input
        icon={
          <Buttons enter color="green">
            Enter
          </Buttons>
        }
        placeholder="Search..."
        focus
      />
    </Container>
  );
};
