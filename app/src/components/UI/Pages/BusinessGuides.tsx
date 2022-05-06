import { Container, Header, Card } from "semantic-ui-react";
import styles from "./businessGuide.module.css";
import { useGuidesQuery } from "../../../api";
import { Link } from "react-router-dom";

// Returns the first n words of string.
export function firstWords(s: string, numberOfSpaces: number): string {
  let currentIndex = 0;
  for (let i = 0; i < numberOfSpaces; i++) {
    const index = s.indexOf(" ", currentIndex);
    if (index === -1) {
      currentIndex = s.length + 1;
      break;
    }
    currentIndex = index + 1;
  }

  return s.substring(0, currentIndex - 1);
}

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
              <Link to={`/guides/${guide.ID}`}>
                <Card
                  header={`Guide ${i}`}
                  description={`${firstWords(guide.Guide, 15)}...`}
                />
              </Link>
            ))}
          </Card.Group>
        </Container>
        <Container className={styles.newCards}>
          <Header as="h2">Recently Posted</Header>
          <Card.Group itemsPerRow={2}>
            {guides?.map((guide, i) => (
              <Link to={`/guides/${guide.ID}`}>
                <Card
                  header={`Guide ${i}`}
                  description={`${firstWords(guide.Guide, 15)}...`}
                />
              </Link>
            ))}
          </Card.Group>
        </Container>
      </Container>
    </Container>
  );
};

export default BusinessGuides;
