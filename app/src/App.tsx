import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Vendor } from "./components/UI/Pages/Vendor";
import { Provider } from "react-redux";
import { store } from "./store";
import Login from "./components/UI/Pages/Login";
import { ErrorBoundary } from "./components/UI/Organisms/ErrorBoundary";
import Signup from "./components/UI/Pages/Signup";

function App(): React.ReactElement {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<p>index</p>} />
            <Route path="/vendors/:ID" element={<Vendor />} />
            <Route path="*" element={<p>Page not found</p>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
