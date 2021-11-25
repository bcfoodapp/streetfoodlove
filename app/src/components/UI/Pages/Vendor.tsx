import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetVendorQuery } from "../../../api";
import { Form, TextArea, Container, Grid, Label } from "semantic-ui-react";
import Buttons from "../Atoms/Button/Buttons";
import styles from "./vendor.module.css";
import VendorDetailCards from "../Atoms/VendorDetailCards/VendorDetailCards";
import HeaderBar from "../Molecules/HeaderBar/HeaderBar";
import { Review } from "../Organisms/Review/Review";
import { ReviewForm } from "../Organisms/ReviewForm/ReviewForm";

export function Vendor(): React.ReactElement {
  const params = useParams();
  const query = useGetVendorQuery(params.ID as string);
  const [openReviewForm, setOpenReviewForm] = useState(false);

  const openReviewHandler = () => {
    setOpenReviewForm(true);
  };

  const cancelReviewHandler = () => {
    setOpenReviewForm(false)
  }

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
      {openReviewForm ? (
        <ReviewForm cancelFormHandler={cancelReviewHandler}/>
      ) : (
        <Container className={styles.textArea}>
          <Buttons color="orange" writeReview clicked={openReviewHandler}>
            Write Review
          </Buttons>
        </Container>
      )}
      <Container className={styles.reviews}>
        <Review />
      </Container>
    </>
  );
}
