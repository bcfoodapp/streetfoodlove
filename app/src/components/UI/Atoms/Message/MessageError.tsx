import React, { useState } from "react";
import { Container, Message } from "semantic-ui-react";
import styles from "./msgerror.module.css";
import { useAppSelector } from "../../../../store";

const MessageError: React.FC = () => {
  const error = useAppSelector((state) => state.root.error);
  const [visibleMsg, setVisibleMsg] = useState(true);

  const dismissHandler = () => {
    setVisibleMsg(false);
  };

  return (
    <Container className={styles.wrapper}>
      {visibleMsg ? (
        <Message negative className={styles.msg} onDismiss={dismissHandler}>
          <Message.Header>Error</Message.Header>
          <Message.List>
            <Message.Item>{error}</Message.Item>
          </Message.List>
        </Message>
      ) : null}
    </Container>
  );
};

export default MessageError;
