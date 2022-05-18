import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Vendor } from "./components/UI/Pages/Vendor";
import { ErrorBoundary } from "./components/UI/Organisms/ErrorBoundary";
import Signup from "./components/UI/Pages/Signup";
import { LandingPage } from "./components/UI/Pages/LandingPage";
import AccountSelection from "./components/UI/Pages/AccountSelection";
import VendorAppForm from "./components/UI/Pages/VendorAppForm";
import AccountProfile from "./components/UI/Pages/AccountProfile";
import BusinessGuides from "./components/UI/Pages/BusinessGuides";
import VendorDashBoard from "./components/UI/Pages/VendorDashboard";
import EditVendorPage from "./components/UI/Pages/EditVendorPage";
import BusinessGuideArticle from "./components/UI/Molecules/BusinessGuideGUI/BusinessGuideArticle";
import HeaderBar from "./components/UI/Molecules/HeaderBar/HeaderBar";
import MessageError from "./components/UI/Atoms/Message/MessageError";
import LoginWrapper from "./components/UI/Pages/Login";
import VendorPhotosUploader from "./components/UI/Pages/VendorPhotosUploader";
import NewReviews from "./components/UI/Pages/NewReviews/NewReviews";
import Chart from "./components/ReviewsChart";
import Chart1 from "./components/LineRechartComponent";
import Chart2 from "./components/PopularVendor";
import DiscountQRCode from "./components/UI/Pages/DiscountQRCode/DiscountQRCode";
import ValidateDiscount from "./components/UI/Pages/ValidateDiscount/ValidateDiscount";
import ArticleTemplate from "./components/UI/Pages/ArticleTemplate";
import RecentVendors from "./components/UI/Pages/RecentVendors/RecentVendors";

function App(): React.ReactElement {
  return (
    <ErrorBoundary>
      <BrowserRouter basename="/streetfoodlove">
        <MessageError />
        <HeaderBar />
        <Routes>
          <Route path="*" element={<p>Page not found</p>} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/vendors/:ID" element={<Vendor />} />
          <Route path="/login" element={<LoginWrapper />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/account-selection" element={<AccountSelection />} />
          <Route path="/vendor-signup" element={<VendorAppForm />} />
          <Route path="/account-profile" element={<AccountProfile />} />
          <Route
            path="/account-profile/discount/:ID"
            element={<DiscountQRCode />}
          />
          <Route path="/vendor-dashboard" element={<VendorDashBoard />} />
          <Route
            path="/vendor-dashboard/photos"
            element={<VendorPhotosUploader />}
          />
          <Route
            path="/vendor-dashboard/new-reviews"
            element={<NewReviews />}
          />
          <Route
            path="/vendor-dashboard/validate-discount/:secret"
            element={<ValidateDiscount />}
          />
          <Route path="/edit-vendor-page" element={<EditVendorPage />} />
          <Route path="/guides" element={<BusinessGuides />} />
          <Route path="/guides/:ID" element={<BusinessGuideArticle />} />
          <Route path="/chart" element={<Chart />} />
          <Route path="/chart1" element={<Chart1 />} />
          <Route path="/chart2" element={<Chart2 />} />
          <Route path="/article-template" element={<ArticleTemplate />} />
          <Route path="/recent-vendors" element={<RecentVendors />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
