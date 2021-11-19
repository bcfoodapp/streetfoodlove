import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {Vendor} from './components/UI/Pages/Vendor';

function App(): React.ReactElement {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<p>index</p>} />
				<Route path="/vendors/:ID" element={<Vendor />} />
				<Route path="*" element={<p>Page not found</p>} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
