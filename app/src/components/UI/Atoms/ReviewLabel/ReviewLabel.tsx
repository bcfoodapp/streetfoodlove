import { Container, Icon, SemanticCOLORS } from "semantic-ui-react";
import styles from "./reviewlabel.module.css";

/**
 * Displays the little color circle at the left of each displayed review that shows satisfaction
 * @param props color -> from vendor page
 */

interface Props {
  color?: SemanticCOLORS;
}

export const ReviewLabel = (props: Props) => {
  return (
    <Container className={styles.container}>
      <Icon
        size="big"
        name="circle"
        color={props.color}
        className={styles.wrapper}
      />
    </Container>
  );
};
