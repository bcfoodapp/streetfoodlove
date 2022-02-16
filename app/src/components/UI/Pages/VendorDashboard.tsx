import { Container, Card, Icon, Header } from "semantic-ui-react";
import styles from "./vendordashboard.module.css";
import { Link } from "react-router-dom";

const VendorDashBoard: React.FC = () => {
  return (
    <Container className={styles.wrapper}>
      <Header as="h2" className={styles.header}>
        Vendor Dashboard
      </Header>
      <Card.Group className={styles.cardGroup}>
        <Link to="/edit-vendor-page">
          <Card className={styles.card}>
            <Icon name="setting" size="huge" className={styles.icon} />
            <Card.Content className={styles.content}>
              <Card.Header>Customize Vendor Page</Card.Header>
              <Card.Description>
                Customize existing vendor pages
              </Card.Description>
            </Card.Content>
          </Card>
        </Link>
        <Link to="/vendor-dashboard/photos">
          <Card className={styles.card}>
            <Icon name="picture" size="huge" className={styles.icon} />
            <Card.Content className={styles.content}>
              <Card.Header>Upload Pictures</Card.Header>
              <Card.Description>
                Upload pictures to your page or update previously uploaded
                pictures
              </Card.Description>
            </Card.Content>
          </Card>
        </Link>
        <Card className={styles.card}>
          <Icon name="line graph" size="huge" className={styles.icon} />
          <Card.Content className={styles.content}>
            <Card.Header>Trends</Card.Header>
            <Card.Description>
              Analyze your business performance
            </Card.Description>
          </Card.Content>
        </Card>
        <Card className={styles.card}>
          <Icon name="write" size="huge" className={styles.icon} />
          <Card.Content className={styles.content}>
            <Card.Header>New Reviews</Card.Header>
            <Card.Description>Look at recent reviews</Card.Description>
          </Card.Content>
        </Card>
      </Card.Group>
    </Container>
  );
};

export default VendorDashBoard;
