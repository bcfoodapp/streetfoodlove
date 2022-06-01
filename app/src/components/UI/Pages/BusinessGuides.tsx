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
            <Link to={`/article1`}>
              <Card
                header="How to start a food cart business?"
                description="The timing could not be better: it seems that the street food..."
                style={{ marginLeft: "10px" }}
              />
            </Link>
            <Link to={`/article2`}>
              <Card
                header="How to Buy a Food Truck?"
                description="Purchasing a kitchen-equipped truck is the most expensive and
                  time-consuming part of..."
                style={{ marginLeft: "10px" }}
              />
            </Link>
            <Link to={`/article3`}>
              <Card
                header="Food Truck Start Up Cost?"
                description="The amount of work required to open a bricks and mortar restaurant of
                  your own can be daunting..."
                style={{ marginTop: "20px" }}
              />
            </Link>
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
            <Link to={`/article4`}>
              <Card
                header="How to Start an Ice Cream Cart Business?"
                description=" Did you know that the average American consumes 22 lbs of ice cream
              every year?"
                style={{ marginLeft: "10px" }}
              />
            </Link>

            <Link to={`/article5`}>
              <Card
                header="10 Tips for Running a Successful Food Truck Business?"
                description="Food trucks are more popular today than ever before; you've likely
              seen them at festivals, birthday parties..."
                style={{ marginLeft: "10px" }}
              />
            </Link>
            <Link to={`/article6`}>
              <Card
                header="Steps to start a hot dog cart business."
                description="A hot dog cart business is one of the most lucrative enterprises to
              undertake since it's based on..."
              />
            </Link>
          </Card.Group>
        </Container>
      </Container>
    </Container>
  );
};

export default BusinessGuides;
