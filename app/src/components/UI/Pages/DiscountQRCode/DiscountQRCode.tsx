import React from "react";
import { useParams } from "react-router-dom";

export default (): React.ReactElement => {
  const id = useParams().ID as string;

  return <>{id}</>;
};
