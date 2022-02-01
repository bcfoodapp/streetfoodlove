import React from "react";
import { Container } from "semantic-ui-react";
import HeaderBar from "../Molecules/HeaderBar/HeaderBar";
import styles from "./accountSelection.module.css";
import { Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";

const AccountSelection: React.FC = () => {
  return (
    <Container className={styles.wrapper}>
      <h2>Choose Account Type</h2>
      <Container className={styles.selectBox}>
        <Container className={styles.customerBox}>
          <h3>Customer</h3>
          <Link to={"/signup"}>
            <Icon name="arrow right" className={styles.icon} size="large" />
          </Link>
        </Container>
        <Container className={styles.vendorBox}>
          <h3>
            Vendor <i>(for business)</i>
          </h3>
          <Link to={"/signup"}>
            <Icon name="arrow right" className={styles.icon} size="large" />
          </Link>
        </Container>
      </Container>
    </Container>
  );
};

export default AccountSelection;
