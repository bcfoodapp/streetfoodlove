import {
  getUserIDFromToken,
  useCountStarsForVendorQuery,
  useCreateStarMutation,
  useStarExistsQuery,
} from "../../../../api";
import styles from "./vendorstar.module.css";
import { Button } from "semantic-ui-react";
import React from "react";
import { useAppSelector } from "../../../../store";

interface Props {
  vendorID: string;
}

// Star shown on top of vendor page
export default ({ vendorID }: Props): React.ReactElement => {
  const [createStar] = useCreateStarMutation();
  const { data: starCount } = useCountStarsForVendorQuery(vendorID);
  const token = useAppSelector((state) => state.token.token);
  let userID = "";
  if (token) {
    userID = getUserIDFromToken(token!);
  }
  const { data: starExists } = useStarExistsQuery(
    { UserID: userID, VendorID: vendorID },
    { skip: !token }
  );

  let buttonClass = styles.starButton;
  if (starExists) {
    buttonClass += " " + styles.highlight;
  }

  return (
    <Button
      onClick={() => {
        if (starExists) {
          return;
        }

        if (userID === "") {
          throw new Error("userID is empty");
        }
        createStar({
          UserID: userID,
          VendorID: vendorID,
        });
      }}
      className={buttonClass}
    >
      <span style={{ color: "#000000" }}>⭐️</span>
      &nbsp;{starCount}
    </Button>
  );
};
