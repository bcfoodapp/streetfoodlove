import { Container } from "semantic-ui-react";
import Map from "../Atoms/Map";
import styles from "./landingpage.module.css";
import config from "../../../configuration.json";

export const LandingPage = () => {
  return (
    <>
      <Container textAlign="center">
        <p>Version {config.version}</p>
      </Container>
      <Container className={styles.mapWrap}>
        <Map />
      </Container>
    </>
  );
};
