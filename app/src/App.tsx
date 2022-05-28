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
/*import Chart1 from "./components/PopularCuisine";*/
import Chart2 from "./components/PopularVendor";
import Chart3 from "./components/PopularSearch";
import Chart4 from "./components/AverageRating";
import DiscountQRCode from "./components/UI/Pages/DiscountQRCode/DiscountQRCode";
import ValidateDiscount from "./components/UI/Pages/ValidateDiscount/ValidateDiscount";
import ArticleTemplate from "./components/UI/Pages/ArticleTemplate";
import NearbyVendors from "./components/UI/Pages/NearbyVendors/NearbyVendors";
import Article1 from "./components/UI/Pages/Guides/Article1";
import Article2 from "./components/UI/Pages/Guides/Article2";
import Article3 from "./components/UI/Pages/Guides/Article3";
import Article4 from "./components/UI/Pages/Guides/Article4";
import Article5 from "./components/UI/Pages/Guides/Article5";
import Article6 from "./components/UI/Pages/Guides/Article6";
import Article1Wrapper from "./components/UI/Pages/Guides/Article1";

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
          <Route path="/chart2" element={<Chart2 />} />
          <Route path="/chart3" element={<Chart3 />} />
          <Route path="/chart4" element={<Chart4 />} />
          <Route path="/article-template" element={<ArticleTemplate />} />
          <Route path="/nearby-vendors" element={<NearbyVendors />} />
          <Route path="/article1" element={<Article1 />} />
          <Route path="/article2" element={<Article2 />} />
          <Route path="/article3" element={<Article3 />} />
          <Route path="/article4" element={<Article4 />} />
          <Route path="/article5" element={<Article5 />} />
          <Route path="/article6" element={<Article6 />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
