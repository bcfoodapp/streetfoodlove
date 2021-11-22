import React from "react";
import { Container, Search, Icon } from "semantic-ui-react";

export const SearchBox = (props) => {
  const element = <Icon name="search" size="small" />

  return (
    <Container>
      <Search
        size={"large"}
        showNoResults={true}
        icon={element}
      />
    </Container>
  )
}