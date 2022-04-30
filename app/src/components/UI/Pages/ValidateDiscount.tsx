import { useParams } from "react-router-dom";
import {
  useDeleteDiscountMutation,
  useDiscountsBySecretQuery,
} from "../../../api";
import { Container, Header } from "semantic-ui-react";
import Buttons from "../Atoms/Button/Buttons";
import { useState } from "react";

export default (): React.ReactElement => {
  const secret = useParams().secret as string;

  const { data: discounts } = useDiscountsBySecretQuery(secret);
  const [deleteDiscount] = useDeleteDiscountMutation();

  const [discountDeleted, setDiscountDeleted] = useState(false);

  if (!discounts) {
    return <p>Loading</p>;
  }

  return (
    <Container>
      <Header as="h1">Validate Discount</Header>
      {discountDeleted ? (
        <p>Discount has been deleted.</p>
      ) : discounts.length === 0 ? (
        <p>Discount is invalid.</p>
      ) : (
        <>
          <p>Discount is valid.</p>
          <Buttons
            signup
            clicked={() => {
              deleteDiscount(discounts[0].ID);
              setDiscountDeleted(true);
            }}
          >
            Claim and delete discount
          </Buttons>
        </>
      )}
    </Container>
  );
};
