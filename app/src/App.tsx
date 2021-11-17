import Map from './components/UI/Atoms/Map';
import Buttons from './components/UI/Atoms/Button/Buttons'
import React from 'react';

function App(): React.ReactElement {
  return (
    <div className="App">
      <Map />
      <div>
        <Buttons login/>
      </div>
    </div>
  );
}

export default App;
