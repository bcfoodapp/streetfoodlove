import React from "react";
import { Container } from "semantic-ui-react";
import HeaderBar from "../Molecules/HeaderBar/HeaderBar";
import YourAccountOption from "../Molecules/YourAccount/YourAccountOption";
import styles from "./youracctuser.module.css";

const YourAccountUser: React.FC = () => {
  return (
    <Container className={styles.wrapper}>
      <Container className={styles.content}>
        <YourAccountOption header="Your Favorites" iconName="favorite" />
        <YourAccountOption header="Search History" iconName="history" />
        <YourAccountOption header="Notifications" iconName="bell" />
      </Container>
    </Container>
  );
};

export default YourAccountUser;
