import { Container } from "semantic-ui-react";
import Map from "../Atoms/Map";
import HeaderBar from "../Molecules/HeaderBar/HeaderBar";
import styles from "./landingpage.module.css";

export const LandingPage = () => {
  return (
    <>
      <Container className={styles.mapWrap}>
        <Map />
      </Container>
    </>
  );
};
