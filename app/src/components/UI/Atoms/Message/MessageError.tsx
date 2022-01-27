import React from "react";
import { Message } from "semantic-ui-react";
import styles from './msgerror.module.css'

const MessageError: React.FC<{errorMsg: string}> = ({errorMsg}) => (
  <Message negative className={styles.msg}>
    <Message.Header>Error</Message.Header>
    <Message.List>
      <Message.Item>{errorMsg}</Message.Item>
    </Message.List>
  </Message>
);

export default MessageError;
