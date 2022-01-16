import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {Vendor} from './components/UI/Pages/Vendor';
import {Provider} from 'react-redux';
import store from './store'

function App(): React.ReactElement {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<p>index</p>}/>
          <Route path="/vendors/:ID" element={<Vendor/>}/>
          <Route path="*" element={<p>Page not found</p>}/>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
