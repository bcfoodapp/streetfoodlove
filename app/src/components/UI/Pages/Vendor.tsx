import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetVendorQuery } from "../../../api";
import { Form, TextArea, Container, Grid, Label } from "semantic-ui-react";
import Buttons from "../Atoms/Button/Buttons";
import styles from "./vendor.module.css";
import VendorDetailCards from "../Atoms/VendorDetailCards/VendorDetailCards";
import HeaderBar from "../Molecules/HeaderBar/HeaderBar";
import { Review } from "../Organisms/Review/Review";
import { StarRating } from "../Atoms/StarRating/StarRating";

export function Vendor(): React.ReactElement {
  const params = useParams();
  const query = useGetVendorQuery(params.ID as string);
  const [textAreaInput, setTextAreaInput] = useState("");

  const handleChange = (e) => {
    setTextAreaInput(e.target.value);
  };

  const handleSubmit = () => {
    setTextAreaInput("");
  };

  return (
    <>
      <HeaderBar />
      <Container className={styles.wrapper}>
        <Grid>
          <Grid.Row>
            <Grid.Column width={6}>
              <VendorDetailCards heading="about-us">
                Name: {query.data?.Name}
              </VendorDetailCards>
            </Grid.Column>
            <Grid.Column width={6}>
              <VendorDetailCards heading="contact">
                {query.data?.Phone}
              </VendorDetailCards>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={6}>
              <VendorDetailCards heading="address">
                {query.data?.BusinessAddress}
              </VendorDetailCards>
            </Grid.Column>
            <Grid.Column width={6}>
              <VendorDetailCards heading="map">Map Image</VendorDetailCards>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
      <Container className={styles.textArea}>
        <h2>Write A Review!</h2>
        <Container>
          <h4>Select a Rating</h4>
          <Container className={styles.starrating}>
            <StarRating />
          </Container>
        </Container>
        <Form onSubmit={handleSubmit}>
          <TextArea
            placeholder="Write Review here..."
            style={{ minHeight: 60, maxWidth: 700 }}
            value={textAreaInput}
            onChange={handleChange}
          />
          <Container className={styles.buttons}>
            <Buttons cancel>Cancel</Buttons>
            <Buttons submit color="green">
              Submit
            </Buttons>
          </Container>
        </Form>
      </Container>
      <Container className={styles.reviews}>
        <Review />
      </Container>
    </>
  );
}
