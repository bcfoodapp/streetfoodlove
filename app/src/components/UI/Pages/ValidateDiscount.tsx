import { useParams } from "react-router-dom";
import { useDiscountsBySecretQuery } from "../../../api";
import { Container, Header } from "semantic-ui-react";

export default (): React.ReactElement => {
  const secret = useParams().secret as string;

  const { data: discounts } = useDiscountsBySecretQuery(secret);

  if (!discounts) {
    return <p>Loading</p>;
  }

  return (
    <Container>
      <Header as="h1">Validate Discount</Header>
      {discounts.length === 0 ? (
        <p>Discount is invalid.</p>
      ) : (
        <p>Discount is valid.</p>
      )}
    </Container>
  );
};
