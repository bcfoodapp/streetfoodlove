import React, { useState } from 'react';
import {useParams} from 'react-router-dom';
import {useGetVendorQuery} from '../../../api';
import { Form, TextArea, Container } from 'semantic-ui-react'
import Buttons from '../Atoms/Button/Buttons';
import './vendor.css'
import VendorDetailCards from '../Atoms/VendorDetailCards/VendorDetailCards';
import HeaderBar from '../Molecules/HeaderBar/HeaderBar';

export function Vendor(): React.ReactElement {
  const params = useParams();
  const query = useGetVendorQuery(params.ID as string);
  const [textAreaInput, setTextAreaInput] = useState('');

  // let content;
  // if (query.isLoading) {
  //   content = <p>loading</p>;
  // } else if (query.isError) {
  //   content = <>
  //     <p>{'status: ' + (query.error as any).status}</p>
  //     <p>{(query.error as any).error}</p>
  //   </>;
  // } else if (query.isSuccess) {
  //   content = <>
  //     <p>ID: {query.data.ID}</p>
  //     <p>BusinessAddress: {query.data.BusinessAddress}</p>
  //     <p>Name: {query.data.Name}</p>
  //     <p>Phone: {query.data.Phone}</p>
  //   </>;
  // }

  const handleChange = (e) => {
    setTextAreaInput(e.target.value)
  }

  const handleSubmit = () => {
    setTextAreaInput('')
  }

  return <>
    {/* {content} */}
    <HeaderBar />
    <Container id="card-wrapper" style={{marginLeft: 600, marginTop: 200}}>
      <VendorDetailCards heading="about-us" style={{marginRight: 50}}>Name: {query.data?.Name}</VendorDetailCards>
      <VendorDetailCards heading="contact">{query.data?.Phone}</VendorDetailCards>
      <Container style={{marginTop: 30}}>
        <VendorDetailCards heading="address">{query.data?.BusinessAddress}</VendorDetailCards>
        <VendorDetailCards heading="map">Map Image</VendorDetailCards>
      </Container>
    </Container>

    <Container>
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
  </>;
}
