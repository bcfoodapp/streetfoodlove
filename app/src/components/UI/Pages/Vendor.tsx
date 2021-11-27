import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {useGetReviewsQuery, useGetVendorQuery} from '../../../api';
import { Container, Grid } from "semantic-ui-react";
import Buttons from "../Atoms/Button/Buttons";
import styles from "./vendor.module.css";
import VendorDetailCards from "../Atoms/VendorDetailCards/VendorDetailCards";
import HeaderBar from "../Molecules/HeaderBar/HeaderBar";
import { Review } from "../Organisms/Review/Review";
import { ReviewForm } from "../Organisms/ReviewForm/ReviewForm";

/**
 * Displays the vendor page of a vendor, including listed reviews and add review button
 */
export function Vendor(): React.ReactElement {
  const vendorID = useParams().ID as string;
  const getVendorQuery = useGetVendorQuery(vendorID);
  const getReviewsQuery = useGetReviewsQuery(vendorID);
  const [openReviewForm, setOpenReviewForm] = useState(false);
  const [completedFormData, setCompletedFormData] = useState({});

  const openReviewHandler = () => {
    setOpenReviewForm(true);
  };

  const cancelReviewHandler = () => {
    setOpenReviewForm(false)
  }

  const completedReviewHandler = (obj) => {
    setCompletedFormData(obj)
  }

  return (
    <>
      <HeaderBar />
      <Container className={styles.wrapper}>
        <Grid>
          <Grid.Row>
            <Grid.Column width={6}>
              <VendorDetailCards heading="about-us">
                Name: {getVendorQuery.data?.Name}
              </VendorDetailCards>
            </Grid.Column>
            <Grid.Column width={6}>
              <VendorDetailCards heading="contact">
                {getVendorQuery.data?.Phone}
              </VendorDetailCards>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={6}>
              <VendorDetailCards heading="address">
                {getVendorQuery.data?.BusinessAddress}
              </VendorDetailCards>
            </Grid.Column>
            <Grid.Column width={6}>
              <VendorDetailCards heading="map">Map Image</VendorDetailCards>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
      {openReviewForm ? (
        <ReviewForm cancelFormHandler={cancelReviewHandler} finishedFormHandler={completedReviewHandler}/>
      ) : (
        <Container className={styles.textArea}>
          <Buttons color="orange" writeReview clicked={openReviewHandler}>
            Write Review
          </Buttons>
        </Container>
      )}
      <Container className={styles.reviews}>
        {getReviewsQuery.data?.map((review, i) => <Review review={review} key={i} />)}
      </Container>
    </>
  );
}
