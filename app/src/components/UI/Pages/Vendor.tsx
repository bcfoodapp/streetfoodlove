import React from 'react';
import {useParams} from 'react-router-dom';
import {useGetVendorQuery} from '../../../api';

export function Vendor(): React.ReactElement {
  const params = useParams();
  const query = useGetVendorQuery(params.ID as string);

  let content;
  if (query.isLoading) {
    content = <p>loading</p>;
  } else if (query.isError) {
    content = <>
      <p>{'status: ' + (query.error as any).status}</p>
      <p>{(query.error as any).error}</p>
    </>;
  } else if (query.isSuccess) {
    content = <pre>{JSON.stringify(query.data, null, 2)}</pre>
  }

  return <>
    {content}
  </>;
}
