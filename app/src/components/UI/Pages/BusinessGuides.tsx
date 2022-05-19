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
              <Link key={i} to={`/guides/${guide.ID}`}>
                <Card
                  header={guide.Title}
                  description={`${firstWords(guide.Guide, 20)}...`}
                />
              </Link>
            ))}
            <Container style={{ marginTop: "30px" }}>
              <Link to={`/article1`}>How to start a food cart business?</Link>
            </Container>
            <Container style={{ marginTop: "30px" }}>
              <Link to={`/article2`}>How to Buy a Food Truck?</Link>
            </Container>
            <Container style={{ marginTop: "30px" }}>
              <Link to={`/article3`}>Food Truck Start Up Cost?</Link>
            </Container>
          </Card.Group>
        </Container>
        <Container className={styles.newCards}>
          <Header as="h2">Recently Posted</Header>
          <Card.Group itemsPerRow={2}>
            {guides?.map((guide, i) => (
              <Link key={i} to={`/guides/${guide.ID}`}>
                <Card
                  header={guide.Title}
                  description={`${firstWords(guide.Guide, 15)}...`}
                />
              </Link>
            ))}
          </Card.Group>
        </Container>
        <Container style={{ marginTop: "30px" }}>
          <Link to={`/article4`}>How to Start an Ice Cream Cart Business?</Link>
        </Container>
        <Container style={{ marginTop: "30px" }}>
          <Link to={`/article5`}>
            10 Tips for Running a Successful Food Truck Business
          </Link>
        </Container>
        <Container style={{ marginTop: "30px" }}>
          <Link to={`/article6`}>Steps to start a hot dog cart business</Link>
        </Container>
      </Container>
    </Container>
  );
};

export default BusinessGuides;
