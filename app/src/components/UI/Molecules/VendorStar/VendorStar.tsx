import {
  getUserIDFromToken,
  useCountStarsForVendorQuery,
  useCreateStarMutation,
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

  return (
    <Button
      onClick={() =>
        createStar({
          // Token is defined because queries are called in vendor page
          UserID: getUserIDFromToken(token!),
          VendorID: vendorID,
        })
      }
      className={styles.starButton}
    >
      <span style={{ color: "#000000" }}>⭐️</span>
      &nbsp;{starCount}
    </Button>
  );
};
