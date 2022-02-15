import { Container, Icon, Sidebar } from "semantic-ui-react";
import Map from "../Atoms/Map";
import styles from "./landingpage.module.css";
import config from "../../../configuration.json";
import { useVersionQuery } from "../../../api";
import LandingPageSidebar from "../Molecules/LandingPageSidebar/LandingPageSidebar";
import React from "react";

export const LandingPage = () => {
  const { data: version } = useVersionQuery();
  const [visible, setVisible] = React.useState(false);

  return (
    <>
      <Container textAlign="center">
        <p>
          Version {config.version}, server commit ID {version}
        </p>
      </Container>
      <Sidebar.Pushable as={Container}>
        <LandingPageSidebar setVisible={setVisible} visible={visible}/>
        <Sidebar.Pusher>
          <Container className={styles.container}>
            <Icon name="options" size="big" className={styles.icon} />
            <Map />
          </Container>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </>
  );
};
