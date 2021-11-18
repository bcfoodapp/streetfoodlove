import Map from './components/UI/Atoms/Map';
import React, {useEffect, useState} from 'react';
import {vendor} from './API';

function App(): React.ReactElement {
	// This is a temporary test
	const [text, setText] = useState('loading');
	useEffect(() => {
		vendor("e72ac985-3d7e-47eb-9f0c-f8e52621a708")
			.then(obj => setText(JSON.stringify(obj, null, 2)));
	}, []);

	return (
		<div className="App">
      <pre>
        {text}
      </pre>
		</div>
	);
}

export default App;
