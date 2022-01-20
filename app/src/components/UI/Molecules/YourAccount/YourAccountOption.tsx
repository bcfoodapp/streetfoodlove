import React, { FC } from "react";
import { Container, Icon, Header } from "semantic-ui-react";
import styles from "./youracctbox.module.css";

const YourAccountOption: FC<{ header: string; iconName: string }> = ({
  header,
  iconName,
}) => {
  return (
    <Container className={styles.wrapper}>
      <Header as={"h1"} className={styles.header}>
        {header}
      </Header>
      <Container className={styles.iconWrap}>
        {iconName! === "favorite" ? (
          <Icon name={"favorite"} size="large" />
        ) : iconName! === "history" ? (
          <Icon name={"history"} size="large" />
        ) : null}
      </Container>
    </Container>
  );
};

export default YourAccountOption;
