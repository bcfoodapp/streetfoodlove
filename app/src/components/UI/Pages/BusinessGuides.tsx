import { Container, Header, Card } from "semantic-ui-react";
import styles from "./businessGuide.module.css";
import { useGuidesQuery } from "../../../api";

const BusinessGuides: React.FC = () => {
  const { data: guides } = useGuidesQuery();

  return (
    <Container className={styles.wrapper}>
      <Header as="h2" className={styles.title}>
        Business Guides
      </Header>
      <Container className={styles.content}>
        <Container>
          <Header as="h2">Popular</Header>
          <Card.Group itemsPerRow={2}>
            {guides?.slice(0, 4).map((guide, i) => (
              <Card
                header={`Guide ${i}`}
                description={`${guide.Guide.substring(0, 50)}...`}
              />
            ))}
          </Card.Group>
        </Container>
        <Container className={styles.newCards}>
          <Header as="h2">Recently Posted</Header>
          <Card.Group itemsPerRow={2}>
            {guides?.slice(0, 4).map((guide, i) => (
              <Card
                header={`Guide ${i}`}
                description={`${guide.Guide.substring(0, 50)}...`}
              />
            ))}
          </Card.Group>
        </Container>
      </Container>
    </Container>
  );
};

export default BusinessGuides;
