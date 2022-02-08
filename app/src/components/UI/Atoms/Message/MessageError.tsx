import React, { useEffect } from "react";
import { Container, Message } from "semantic-ui-react";
import styles from "./msgerror.module.css";
import { hideError, useAppDispatch, useAppSelector } from "../../../../store";
import { useLocation } from "react-router-dom";

const MessageError: React.FC = () => {
  const error = useAppSelector((state) => state.root.error);
  const showError = useAppSelector((state) => state.root.showError);
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(hideError());
  }, [location]);

  const dismissHandler = () => {
    dispatch(hideError());
  };

  return (
    <Container className={styles.wrapper}>
      {showError ? (
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
