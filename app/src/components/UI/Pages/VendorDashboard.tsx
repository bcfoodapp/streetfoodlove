import { Container, Card, Icon, Header, Image } from "semantic-ui-react";
import styles from "./vendordashboard.module.css";
import { Link, useNavigate } from "react-router-dom";
import {
  getUserIDFromToken,
  useEffectAsync,
  useGetTokenMutation,
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
              {vendor ? <Card.Header>My Vendor Page</Card.Header> : null}
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
        <Link to="">
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
              <Card.Header>New Reviews</Card.Header>
              <Card.Description>Look at recent reviews</Card.Description>
            </Card.Content>
          </Card>
        </Link>
      </Card.Group>
    </Container>
  );
};

export default VendorDashBoard;
