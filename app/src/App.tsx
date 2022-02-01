import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Vendor } from "./components/UI/Pages/Vendor";
import { Provider } from "react-redux";
import { store, useAppSelector } from "./store";
import Login from "./components/UI/Pages/Login";
import { ErrorBoundary } from "./components/UI/Organisms/ErrorBoundary";
import Signup from "./components/UI/Pages/Signup";
import { LandingPage } from "./components/UI/Pages/LandingPage";
import AccountSelection from "./components/UI/Pages/AccountSelection";
import VendorAppForm from "./components/UI/Pages/VendorAppForm";
import AccountProfile from "./components/UI/Pages/AccountProfile";
import YourAccountUser from "./components/UI/Pages/YourAccountUser";
import BusinessGuides from "./components/UI/Pages/BusinessGuides";
import VendorDashBoard from "./components/UI/Pages/VendorDashboard";
import CreateVendorPage from "./components/UI/Pages/CreateVendorPage";
import BusinessGuideArticle from "./components/UI/Molecules/BusinessGuideGUI/BusinessGuideArticle";
import MessageError from "./components/UI/Atoms/Message/MessageError";

function App(): React.ReactElement {
  const error = useAppSelector((state) => state.root.error);
  return (
    <ErrorBoundary>
      {error ? <MessageError errorMsg={error.toString()} /> : null}
      <BrowserRouter basename="/streetfoodlove">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/vendors/:ID" element={<Vendor />} />
          <Route path="*" element={<p>Page not found</p>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/account-selection" element={<AccountSelection />} />
          <Route path="/vendor-signup" element={<VendorAppForm />} />
          <Route path="/account-profile" element={<AccountProfile />} />
          <Route path="/your-acct-user" element={<YourAccountUser />} />
          <Route path="/business-guide" element={<BusinessGuides />} />
          <Route path="vendor-dashboard" element={<VendorDashBoard />} />
          <Route path="/create-vendor-page" element={<CreateVendorPage />} />
          <Route path="/guides/:ID" element={<BusinessGuideArticle />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
