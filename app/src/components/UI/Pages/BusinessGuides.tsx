import { Container, Header, Card, Dropdown, Icon } from "semantic-ui-react";
import HeaderBar from "../Molecules/HeaderBar/HeaderBar";
import styles from "./businessGuide.module.css";

const ProfileIcon = (
  <span className={styles.user}>
    <Icon name="user circle" size="big" /> Hi Colin
  </span>
);

const options = [
  {
    key: "user",
    text: (
      <span>
        Signed in as <strong>Colin Zhou</strong>
      </span>
    ),
    disabled: true,
  },
  { key: "profile", text: "Profile Settings" },
  { key: "page", text: "Create Vendor Page" },
  { key: "help", text: "Help" },
  { key: "sign-out", text: "Sign Out" },
];

const BusinessGuides: React.FC = () => {
  return (
    <Container className={styles.wrapper}>
      <HeaderBar />
      <Header as="h2" className={styles.title}>
        Business Guides
      </Header>

      <Dropdown
        trigger={ProfileIcon}
        options={options}
        disabled={false}
        simple={true}
      />
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
