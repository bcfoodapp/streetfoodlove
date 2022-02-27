import {
  getUserIDFromToken,
  useEffectAsync,
  useGetTokenMutation,
  useStarsByUserIDQuery,
} from "../../../../api";
import React, { useState } from "react";

export default (): React.ReactElement => {
  const [getToken] = useGetTokenMutation();
  const [token, setToken] = useState(null as string | null);

  useEffectAsync(async () => {
    const response = await getToken();
    if ("data" in response) {
      setToken(response.data);
    }
  }, []);

  let userID = "";
  if (token) {
    userID = getUserIDFromToken(token as string);
  }

  const { data: stars } = useStarsByUserIDQuery(userID, {
    skip: userID === "",
  });

  if (!token) {
    return <p>Not logged in</p>;
  }

  return (
    <>
      {stars?.map((star) => (
        <p>{star.VendorID}</p>
      ))}
    </>
  );
};
