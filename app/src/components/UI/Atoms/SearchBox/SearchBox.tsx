import React from "react";
import { Container, Input } from "semantic-ui-react";
import styles from "./searchbox.module.css";
import Buttons from "../Button/Buttons";

/**
 * This is the searchbox for the header 
 */

export const SearchBox: React.FC = () => {
<<<<<<< HEAD

  const searchEnterHandler = () => {

  }

=======
>>>>>>> main
  return (
    <Container className={styles.searchBox}>
      <Input
        icon={
<<<<<<< HEAD
          <Buttons enter color={"green"} clicked={searchEnterHandler}>
=======
          <Buttons enter color="green">
>>>>>>> main
            Enter
          </Buttons>
        }
        placeholder="Search..."
        focus
      />
    </Container>
  );
};
