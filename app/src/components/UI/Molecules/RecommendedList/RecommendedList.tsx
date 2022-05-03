import React from "react";
import {
  getUserIDFromToken,
  usePastSearchQuery,
  usePastSearchByUserIDQuery,
} from "../../../../api";
import { useAppSelector } from "../../../../store/root";

const RecommendedList: React.FC = () => {
  const token = useAppSelector((state) => state.token.token);

  let userID = null as string | null;
  if (token) {
    userID = getUserIDFromToken(token);
  }

  const { data: pastSearch } = usePastSearchQuery(userID as string);
  console.log(pastSearch);

  return <></>;
};

export default RecommendedList;
