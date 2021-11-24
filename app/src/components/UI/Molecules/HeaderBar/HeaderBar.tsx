import React, { Component } from 'react'
import { Button, Container, Header, Segment, Menu, Item } from "semantic-ui-react";
import Buttons from "../../Atoms/Button/Buttons";
import { SearchBox } from "../../Atoms/SearchBox/SearchBox";
import styles from './headerbar.module.css'
import { Link } from 'react-router-dom';

export default function HeaderBar():React.ReactElement {
  return (
    <Menu as="div" className={styles.wrapContainer} fluid widths={3}>
      <Menu.Item as="a" className={styles.header} position="left">
        <Header as="h1">StreetFoodLove</Header>
      </Menu.Item>
      <Menu.Item as="a">
        <SearchBox />
      </Menu.Item>
      <Menu.Item position="right">
        <Buttons signup color="white">Sign Up</Buttons>
        <Link to="/login"> 
          <Buttons login color="orange">Login</Buttons>
        </Link>
      </Menu.Item>
    </Menu>
  )
}