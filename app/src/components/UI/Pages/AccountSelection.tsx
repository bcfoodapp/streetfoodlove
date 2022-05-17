import React from "react";
import { Container } from "semantic-ui-react";
import HeaderBar from "../Molecules/HeaderBar/HeaderBar";
import styles from "./accountSelection.module.css";
import { Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";

const AccountSelection: React.FC = () => {
  return (
    <Container className={styles.wrapper}>
      <Container className={styles.selectBox}>
        <h2>Choose Account Type</h2>
        <Link to="/signup">
          <Container className={styles.customerBox}>
            <h3>Customer</h3>
            <Icon name="arrow right" className={styles.icon} size="large" />
          </Container>
        </Link>
        <Link to="/signup?usertype=vendor">
          <Container className={styles.vendorBox}>
            <h3>
              Vendor <i>(for business)</i>
            </h3>
            <Icon name="arrow right" className={styles.icon} size="large" />
          </Container>
        </Link>
      </Container>
    </Container>
  );
};

export default AccountSelection;
