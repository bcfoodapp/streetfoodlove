import React, { useState } from 'react';
import {useParams} from 'react-router-dom';
import {useGetVendorQuery} from '../../../api';
import { Form, TextArea, Container } from 'semantic-ui-react'
import Buttons from '../Atoms/Button/Buttons';
import styles from './vendor.module.css'
import VendorDetailCards from '../Atoms/VendorDetailCards/VendorDetailCards';
import HeaderBar from '../Molecules/HeaderBar/HeaderBar';
import { Review } from '../Organisms/Review/Review';

export function Vendor(): React.ReactElement {
  const params = useParams();
  const query = useGetVendorQuery(params.ID as string);
  const [textAreaInput, setTextAreaInput] = useState('');

  const handleChange = (e) => {
    setTextAreaInput(e.target.value)
  }

  const handleSubmit = () => {
    setTextAreaInput('')
  }

  return <>
    <HeaderBar />
    <Container className={styles.CardWrapper}>
      <VendorDetailCards heading="about-us">Name: {query.data?.Name}</VendorDetailCards>
      <VendorDetailCards heading="contact">{query.data?.Phone}</VendorDetailCards>
      <Container className={styles.secondRowContainer}>
        <VendorDetailCards heading="address">{query.data?.BusinessAddress}</VendorDetailCards>
        <VendorDetailCards heading="map">Map Image</VendorDetailCards>
      </Container>
    </Container>
    <Container className={styles.textArea}>
      <Form onSubmit={handleSubmit}>
        <TextArea 
          placeholder='Write Review here...' 
          style={{minHeight: 60, minWidth: 500}}
          value={textAreaInput}
          onChange={handleChange}
        />
      <Container>
        <Buttons cancel>Cancel</Buttons>
        <Buttons submit>Submit</Buttons>
      </Container>
      </Form>
    </Container>
    <Container className={styles.reviews}>
      <Review />
    </Container>
  </>;
}
