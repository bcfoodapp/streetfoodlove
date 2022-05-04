import React from "react";
import { Container } from "semantic-ui-react";
import styles from "./vendorcard.module.css";

/**
 * This shows the square info cards about that particular vendor
 */

interface Props {
  heading: "about-us" | "contact" | "address" | "map" | "description" | "business-hours" | "social-media-links" | "website" | "cuisine-types" | "review-count" | "average-review-rating";
}

export default function VendorDetailCards(
  props: React.PropsWithChildren<Props>
): React.ReactElement {
  let headingContent;

  if (props.heading === "about-us") {
    headingContent = <h2 className={styles.header}>About Us</h2>;
  } else if (props.heading === "contact") {
    headingContent = <h2 className={styles.header}>Contact</h2>;
  } else if (props.heading === "address") {
    headingContent = <h2 className={styles.header}>Address</h2>;
  } else if (props.heading === "map") {
    headingContent = <h2 className={styles.header}>Map</h2>;
  } else if (props.heading === "description") {
    headingContent = <h2 className={styles.header}>Description</h2>;
  } else if (props.heading === "business-hours") {
    headingContent = <h2 className={styles.header}>Business Hours</h2>;
  } else if (props.heading === "social-media-links") {
    headingContent = <h2 className={styles.header}>Social Media Links</h2>
  } else if (props.heading === "website") {
    headingContent = <h2 className={styles.header}>Website</h2>
  } else if (props.heading === "cuisine-types") {
    headingContent = <h2 className={styles.header}>Cuisine Types</h2>
  } else if (props.heading === "review-count") {
    headingContent = <h2 className={styles.header}>Review Count</h2>
  } else if (props.heading === "average-review-rating") {
    headingContent = <h2 className={styles.header}>Average Review Rating</h2>
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
  );
}
