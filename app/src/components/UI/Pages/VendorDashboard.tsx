import { Container, Card, Icon, Header, Image } from "semantic-ui-react";
import styles from "./vendordashboard.module.css";
import { Link, useNavigate } from "react-router-dom";
import {
  getUserIDFromToken,
  useEffectAsync,
  useGetTokenMutation,
  useNewReviewsQuery,
  useVendorByOwnerIDQuery,
} from "../../../api";
import React, { useState } from "react";
import { s3Prefix } from "../../../aws";

const VendorDashBoard: React.FC = () => {
  const [getToken] = useGetTokenMutation();
  const [userID, setUserID] = useState(null as string | null);

  useEffectAsync(async () => {
    const response = await getToken();
    if ("data" in response && response.data) {
      setUserID(getUserIDFromToken(response.data));
    }
  }, []);

  const { data: vendor } = useVendorByOwnerIDQuery(userID as string, {
    skip: !userID,
  });

  const { data: newReviews } = useNewReviewsQuery(userID!, { skip: !userID });

  const navigate = useNavigate();

  if (userID === null) {
    return <p>Not logged in</p>;
  }

  return (
    <Container className={styles.wrapper}>
      <Header as="h2" className={styles.header}>
        Vendor Dashboard
      </Header>
      <Card.Group className={styles.cardGroup}>
        <a
          onClick={() => {
            if (vendor) {
              navigate(`/vendors/${vendor.ID}`);
            }
          }}
        >
          <Card className={styles.card}>
            {vendor ? (
              vendor.BusinessLogo ? (
                <Image
                  src={s3Prefix + vendor.BusinessLogo}
                  alt="logo"
                  style={{ width: 60, height: 60, objectFit: "cover" }}
                  className={styles.icon}
                />
              ) : (
                <Icon name="globe" size="huge" className={styles.icon} />
              )
            ) : null}
            <Card.Content className={styles.content}>
              {vendor ? <Card.Header>{vendor.Name}</Card.Header> : null}
              <Card.Description>My Vendor Page</Card.Description>
            </Card.Content>
          </Card>
        </a>
        <Link to="/edit-vendor-page">
          <Card className={styles.card}>
            <Icon name="setting" size="huge" className={styles.icon} />
            <Card.Content className={styles.content}>
              <Card.Header>Customize Vendor Page</Card.Header>
              <Card.Description>
                Customize existing vendor pages
              </Card.Description>
            </Card.Content>
          </Card>
        </Link>
        <Link to="/vendor-dashboard/photos">
          <Card className={styles.card}>
            <Icon name="picture" size="huge" className={styles.icon} />
            <Card.Content className={styles.content}>
              <Card.Header>Upload Pictures</Card.Header>
              <Card.Description>
                Upload pictures to your page or update current pictures
              </Card.Description>
            </Card.Content>
          </Card>
        </Link>
        <Link to="/vendor-dashboard/analytics">
          <Card className={styles.card}>
            <Icon name="line graph" size="huge" className={styles.icon} />
            <Card.Content className={styles.content}>
              <Card.Header>Trends</Card.Header>
              <Card.Description>
                Analyze your business performance
              </Card.Description>
            </Card.Content>
          </Card>
        </Link>
        <Link to="/vendor-dashboard/new-reviews">
          <Card className={styles.card}>
            <Icon name="write" size="huge" className={styles.icon} />
            <Card.Content className={styles.content}>
              <Card.Header>New Reviews ({newReviews?.length})</Card.Header>
              <Card.Description>
                {newReviews && newReviews.length > 0
                  ? `There are ${newReviews.length} new reviews`
                  : "No new reviews"}
              </Card.Description>
            </Card.Content>
          </Card>
        </Link>
        <Link to="/guides">
          <Card className={styles.card}>
            <Icon name="book" size="huge" className={styles.icon} />
            <Card.Content className={styles.content}>
              <Card.Header>Business Guides</Card.Header>
              <Card.Description>
                Guides on bringing in more customers and improving your business
              </Card.Description>
            </Card.Content>
          </Card>
        </Link>
      </Card.Group>
    </Container>
  );
};

export default VendorDashBoard;
