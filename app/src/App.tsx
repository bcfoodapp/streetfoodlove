import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Vendor } from "./components/UI/Pages/Vendor";
import { Provider } from "react-redux";
import store from "./store";
import Login from "./components/UI/Pages/Login";

function App(): React.ReactElement {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Vendor />} />
          <Route path="/vendors/:ID" element={<Vendor />} />
          <Route path="*" element={<p>Page not found</p>} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
