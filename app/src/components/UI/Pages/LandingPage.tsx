import { Button, Container, Icon, Sidebar } from "semantic-ui-react";
import Map from "../Atoms/Map";
import styles from "./landingpage.module.css";
import config from "../../../configuration.json";
import { useVersionQuery } from "../../../api";
import LandingPageSidebar from "../Molecules/LandingPageSidebar/LandingPageSidebar";
import React from "react";

export const LandingPage = () => {
  const { data: version } = useVersionQuery();

  return (
    <>
      <Container textAlign="center">
        <p>
          Version {config.version}, server commit ID {version}
        </p>
      </Container>
      <Sidebar.Pushable as={Container} fluid>
        <LandingPageSidebar />
        <Sidebar.Pusher>
          <Container fluid>
            <Map />
          </Container>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </>
  );
};
