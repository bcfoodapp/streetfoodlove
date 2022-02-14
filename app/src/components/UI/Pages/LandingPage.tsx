import { Container } from "semantic-ui-react";
import Map from "../Atoms/Map";
import styles from "./landingpage.module.css";
import config from "../../../configuration.json";
import { useVersionQuery } from "../../../api";

export const LandingPage = () => {
  const { data: version } = useVersionQuery();

  return (
    <>
      <Container textAlign="center">
        <p>
          Version {config.version}, server commit ID {version}
        </p>
      </Container>
      <Container className={styles.container}>
        <Map />
      </Container>
    </>
  );
};
