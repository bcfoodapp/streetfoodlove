import React from "react";
import { Icon } from "semantic-ui-react";
import { EnumType } from "typescript";

// interface ReviewLabelProps {
//   color: string
// }

export const ReviewLabel = (props) => {
  return (
    <>
      <Icon size="huge" name="circle" color={props.color} />
    </>
  );
};
