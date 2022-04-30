import { useParams } from "react-router-dom";
import {
  useDeleteDiscountMutation,
  useDiscountsBySecretQuery,
} from "../../../api";
import { Container, Header } from "semantic-ui-react";
import Buttons from "../Atoms/Button/Buttons";

export default (): React.ReactElement => {
  const secret = useParams().secret as string;

  const { data: discounts } = useDiscountsBySecretQuery(secret);
  const [deleteDiscount] = useDeleteDiscountMutation();

  if (!discounts) {
    return <p>Loading</p>;
  }

  return (
    <Container>
      <Header as="h1">Validate Discount</Header>
      {discounts.length === 0 ? (
        <p>Discount is invalid.</p>
      ) : (
        <>
          <p>Discount is valid.</p>
          <Buttons
            signup
            clicked={() => {
              deleteDiscount(discounts[0].ID);
            }}
          >
            Claim and delete discount
          </Buttons>
        </>
      )}
    </Container>
  );
};
