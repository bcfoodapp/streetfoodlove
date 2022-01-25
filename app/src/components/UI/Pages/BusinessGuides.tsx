import { Container, Header, Card, Dropdown, Icon } from "semantic-ui-react";
import HeaderBar from "../Molecules/HeaderBar/HeaderBar";
import styles from "./businessGuide.module.css";

const BusinessGuides: React.FC = () => {
  return (
    <Container className={styles.wrapper}>
      <HeaderBar logout />
      <Header as="h2" className={styles.title}>
        Business Guides
      </Header>
      <Container className={styles.content}>
        <Container>
          <Header as="h2">Popular!</Header>
          <Card
            href="#"
            header="Business Guide 1"
            meta="Beginner"
            description="Business guide one description."
          />
          <Card
            href="#"
            header="Business Guide 2"
            meta="Beginner"
            description="Business guide one description."
          />

          <Card
            href="#"
            header="Business Guide 3"
            meta="Intermediate"
            description="Business guide one description."
          />
        </Container>
        <Container className={styles.newCards}>
          <Header as="h2">New!</Header>

          <Card
            href="#"
            header="Business Guide 4"
            meta="Beginner"
            description="Business guide one description."
          />
          <Card
            href="#"
            header="Business Guide 5"
            meta="Beginner"
            description="Business guide one description."
          />

          <Card
            href="#"
            header="Business Guide 6"
            meta="Intermediate"
            description="Business guide one description."
          />
        </Container>
      </Container>
    </Container>
  );
};

export default BusinessGuides;
