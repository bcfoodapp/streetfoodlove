import { Container, Card, Icon, Header } from "semantic-ui-react";
import HeaderBar from "../Molecules/HeaderBar/HeaderBar";
import styles from "./vendordashboard.module.css";

const VendorDashBoard: React.FC = () => {
  return (
    <Container className={styles.wrapper}>
      <Header as={"h2"} className={styles.header}>
        Vendor Dashboard
      </Header>
      <Card.Group className={styles.cardGroup}>
        <Card className={styles.card}>
          <Icon name="setting" size="huge" className={styles.icon} />
          <Card.Content className={styles.content}>
            <Card.Header>Customize Vendor Page</Card.Header>
            <Card.Description>
              Customize existing vendor pages!
            </Card.Description>
          </Card.Content>
          {/* <Card.Content extra>
            <a>
              <Icon name='user' />
              10 Friends
            </a>
          </Card.Content> */}
        </Card>
        <Card className={styles.card}>
          <Icon name="line graph" size="huge" className={styles.icon} />
          <Card.Content className={styles.content}>
            <Card.Header>Trends</Card.Header>
            <Card.Description>
              Analyze your business performance!
            </Card.Description>
          </Card.Content>
          {/* <Card.Content extra>
            <a>
              <Icon name='user' />
              10 Friends
            </a>
          </Card.Content> */}
        </Card>
        <Card className={styles.card}>
          <Icon name="write" size="huge" className={styles.icon} />
          <Card.Content className={styles.content}>
            <Card.Header>New Reviews!</Card.Header>
            <Card.Description>Look at recent reviews!</Card.Description>
          </Card.Content>
          {/* <Card.Content extra>
            <a>
              <Icon name='user' />
              10 Friends
            </a>
          </Card.Content> */}
        </Card>
      </Card.Group>
    </Container>
  );
};

export default VendorDashBoard;
