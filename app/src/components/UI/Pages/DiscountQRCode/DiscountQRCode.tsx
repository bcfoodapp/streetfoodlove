import React from "react";
import QRCode from "react-qr-code";
import { Link, useParams } from "react-router-dom";
import { useDiscountQuery } from "../../../../api";
import { Container, Divider, Header } from "semantic-ui-react";

export default (): React.ReactElement => {
  const id = useParams().ID as string;

  const { data: discount } = useDiscountQuery(id);
  const discountURL = `/vendor-dashboard/validate-discount/${discount?.Secret}`;

  return (
    <Container>
      <Header as="h1">Discount QR Code</Header>
      {discount ? (
        <>
          <Container textAlign="center">
            <QRCode value={discountURL} />
          </Container>

          <p>URL for testing:</p>
          <Link to={discountURL}>{discountURL}</Link>
        </>
      ) : null}
    </Container>
  );
};
