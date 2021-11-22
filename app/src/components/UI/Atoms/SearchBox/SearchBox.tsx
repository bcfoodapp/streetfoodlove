import React from "react";
import { Container, Input, Icon } from "semantic-ui-react";

export const SearchBox = (props) => {

  return (
    <Container>
      <Input
        icon="search"
        placeholder="Se..."
        size={"huge"}
      />
    </Container>
  )
}