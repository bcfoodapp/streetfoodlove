import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "semantic-ui-react";
import {
  getUserIDFromToken,
  usePastSearchByUserIDQuery,
  useVendorsQuery,
  Vendor,
} from "../../../../api";
import { useAppSelector } from "../../../../store/root";
import styles from "../LandingPageSidebar/sidebar.module.css";

const RecommendedList: React.FC = () => {
  const token = useAppSelector((state) => state.token.token);
  const [recommendedResult, setRecommendedResult] = useState<Vendor[]>([]);

  let userID = null as string | null;
  if (token) {
    userID = getUserIDFromToken(token);
  }

  const { data: pastSearch } = usePastSearchByUserIDQuery(userID as string);

  let relevantWord = null as string | null;
  let random = 0;

  function generateIndexingNumber() {
    if (pastSearch) {
      //generate a random number which will be used to randomly get a previous search entry
      let length = pastSearch.length - 1;
      random = Math.floor(Math.random() * length);
      relevantWord = pastSearch[random]?.RelevantSearchWord;
    }
  }

  const { data: vendors } = useVendorsQuery();

  useEffect(() => {
    generateIndexingNumber();
    if (vendors && relevantWord) {
      for (const vendor of vendors) {
        if (vendor.Name.includes(relevantWord)) {
          setRecommendedResult((previous) => [...previous, vendor]);
        }
      }
    }
  }, [pastSearch]);

  return (
    <Container textAlign="left">
      {recommendedResult.length === 0 ? (
        <h4 className={styles.errorMessage}>No Recommendations Available</h4>
      ) : null}
      {recommendedResult.map((vendor, index) => {
        if (index < 5) {
          return (
            <Container key={vendor.ID}>
              <Container className={styles.vendorInfo}>
                <h2>
                  <Link to={`/vendors/${vendor.ID}`}>{vendor.Name}</Link>
                </h2>
                <p>Address: {vendor.BusinessAddress}</p>
                <p>Business Hours: {vendor.BusinessHours}</p>
              </Container>
              <Container className={styles.divider} />
            </Container>
          );
        }
      })}
    </Container>
  );
};

export default RecommendedList;
