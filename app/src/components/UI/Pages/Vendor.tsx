import React from 'react';
import {useParams} from 'react-router-dom';

export function Vendor(): React.ReactElement {
	const params = useParams();
	console.log(params.ID);
	return <p>vendor</p>;
}
