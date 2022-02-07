import React, { useState, MouseEvent } from "react";
import { Container, Message, MessageProps } from "semantic-ui-react";
import styles from "./msgerror.module.css";

const MessageError: React.FC<{ errorMsg: string }> = ({ errorMsg }) => {
  const [visibleMsg, setVisibleMsg] = useState<boolean>(true);

  const dismissHandler = (e: MouseEvent<HTMLElement>, data: MessageProps) => {
    setVisibleMsg(false);
  };

  return (
    <Container className={styles.wrapper}>
      {visibleMsg ? (
        <Message negative className={styles.msg} onDismiss={dismissHandler}>
          <Message.Header>Error</Message.Header>
          <Message.List>
            <Message.Item>{errorMsg}</Message.Item>
          </Message.List>
        </Message>
      ) : null}
    </Container>
  );
};

export default MessageError;
