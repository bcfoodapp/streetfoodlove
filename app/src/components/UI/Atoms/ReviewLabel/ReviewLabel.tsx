import { Container, Icon } from "semantic-ui-react";
import styles from './reviewlabel.module.css'

/**
 * Displays the little color circle at the left of each displayed review that shows satisfaction
 * @param props color -> from vendor page
 */

export const ReviewLabel = (props) => {

  return (
    <Container className={styles.container}>
      <Icon size="big" name="circle" color={props.color} className={styles.wrapper}/>
    </Container>
  );
};
