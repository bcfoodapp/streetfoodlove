import { Container, Icon, Image } from "semantic-ui-react";
import styles from "./reviewlabel.module.css";
import React from "react";
import { s3Prefix } from "../../../../aws";

/**
 * Displays the little color circle at the left of each displayed review that shows satisfaction
 * @param props color -> from vendor page
 */

interface Props {
  imageName: string;
}

export const ReviewLabel = ({ imageName }: Props) => {
  return (
    <Container className={styles.container}>
      <Image
        src={s3Prefix + imageName}
        alt="logo"
        style={{ width: 30, height: 30, objectFit: "cover" }}
      />
    </Container>
  );
};
