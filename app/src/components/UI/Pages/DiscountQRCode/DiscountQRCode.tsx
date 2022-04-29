import React from "react";
import { Link, useParams } from "react-router-dom";
import { useDiscountQuery } from "../../../../api";

export default (): React.ReactElement => {
  const id = useParams().ID as string;

  const { data: discount } = useDiscountQuery(id);
  const discountURL = `/vendor-dashboard/validate-discount/${discount?.Secret}`;

  return (
    <>
      <Link to={discountURL}>{discountURL}</Link>
    </>
  );
};
