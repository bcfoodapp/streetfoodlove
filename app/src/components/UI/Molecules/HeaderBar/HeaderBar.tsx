import React, { Component } from 'react'
import { Button, Container, Header, Segment, Menu, Item } from "semantic-ui-react";
import Buttons from "../../Atoms/Button/Buttons";
import { SearchBox } from "../../Atoms/SearchBox/SearchBox";
import styles from './headerbar.module.css'

export default function HeaderBar(props):React.ReactElement {
  return (
    <Container className={styles.wrapContainer}>
      <Container className={styles.header}>
        <Header as="h1">StreetFoodLove</Header>
      </Container>
      <Container className={styles.searchBox}>
        <SearchBox />
      </Container>
      <Container className={styles.buttonWrap}>
        <Buttons signup>Sign Up</Buttons>
        <Buttons login>Login</Buttons>
      </Container>
    </Container>
  )
}