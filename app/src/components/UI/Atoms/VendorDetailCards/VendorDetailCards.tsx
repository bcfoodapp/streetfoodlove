import React from "react";
import { Container } from "semantic-ui-react";
import styles from './vendorcard.module.css'

export default function VendorDetailCards(props): React.ReactElement {
  let headingContent

  if (props.heading === 'about-us') {
    headingContent = <h2 className={styles.header}>About Us</h2>
  } else if (props.heading === 'contact') {
    headingContent = <h2 className={styles.header}>Contact</h2>
  } else if (props.heading === 'address') {
    headingContent = <h2 className={styles.header}>Address</h2>
  } else if (props.heading === 'map') {
    headingContent = <h2 className={styles.header}>Map</h2>
  }

  return (
    <> 
    <Container className={styles.wrapper}>
      {headingContent}
      <Container className={styles.description}>
        <span>{props.children}</span>
      </Container>
    </Container>    
    </>
  )
}