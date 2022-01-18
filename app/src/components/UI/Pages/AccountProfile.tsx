import React from "react";
import { Container, Header } from "semantic-ui-react";
import styles from './accountprofile.module.css'
import { Image, Form, Tab } from 'semantic-ui-react'
import HeaderBar from "../Molecules/HeaderBar/HeaderBar";
import FormGroup from "../Molecules/Form Group/FormGroup";

const AccountProfile: React.FC = () => {
  const panes = [
    { menuItem: 'Account Settings', render: () => <Tab.Pane className={styles.pane}><FormGroup /></Tab.Pane> },
    { menuItem: 'Personal Information', render: () => <Tab.Pane className={styles.pane}>Tab 2 Content</Tab.Pane> },
    { menuItem: 'Privacy', render: () => <Tab.Pane className={styles.pane}>Tab 3 Content</Tab.Pane> },
  ]


  return (
    <Container className={styles.wrapper}>
      <HeaderBar />
      <Container className={styles.profileActions}>
        <Tab menu={{ fluid: true, vertical: true, tabular: true }} panes={panes}/>
      </Container>
    </Container>
  )
}

export default AccountProfile