import React from "react";
import QRCode from "react-qr-code";
import { Link, useParams } from "react-router-dom";
import { useDiscountQuery } from "../../../../api";
import { Container, Header } from "semantic-ui-react";
import config from "../../../../configuration.json";

export default (): React.ReactElement => {
  const id = useParams().ID as string;

  const { data: discount } = useDiscountQuery(id);
  const discountURL = discount
    ? `/vendor-dashboard/validate-discount/${discount.Secret}`
    : null;

  return (
    <Container>
      <Header as="h1">Discount QR Code</Header>
      {discountURL ? (
        <>
          <Container textAlign="center">
            <QRCode value={config.apiBaseURL + discountURL} />
          </Container>

          <p>URL for testing:</p>
          <Link to={discountURL}>{discountURL}</Link>
        </>
      ) : null}
    </Container>
  );
};
