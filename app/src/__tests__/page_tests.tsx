import * as renderer from "react-test-renderer";
import React from "react";
import { LandingPage } from "../components/UI/Pages/LandingPage";
import AccountProfile from "../components/UI/Pages/AccountProfile";
import { MemoryRouter } from "react-router-dom";
import { store } from "../store/root";
import { Provider } from "react-redux";
import AccountSelection from "../components/UI/Pages/AccountSelection";
import BusinessGuides from "../components/UI/Pages/BusinessGuides";
import EditVendorPage from "../components/UI/Pages/EditVendorPage";
import Login from "../components/UI/Pages/Login";
import Signup from "../components/UI/Pages/Signup";
import { Vendor } from "../components/UI/Pages/Vendor";
import VendorAppForm from "../components/UI/Pages/VendorAppForm";
import VendorDashboard from "../components/UI/Pages/VendorDashboard";
import YourAccountUser from "../components/UI/Pages/YourAccountUser";
import App from "../App";
import VendorPhotosUploader from "../components/UI/Pages/VendorPhotosUploader";

const MockEnvironment: React.FC = ({
  children,
}: React.PropsWithChildren<Record<never, never>>) => {
  (window as any).google = {
    accounts: {
      id: {
        initialize: () => {},
        renderButton: () => {},
      },
    },
  };

  return (
    <>
      <Provider store={store}>
        <MemoryRouter>{children}</MemoryRouter>
      </Provider>
    </>
  );
};

test("App", () => {
  renderer.create(
    <MockEnvironment>
      <App />
    </MockEnvironment>
  );
});

test("AccountProfile", () => {
  renderer.create(
    <MockEnvironment>
      <AccountProfile />
    </MockEnvironment>
  );
});

test("AccountSelection", () => {
  renderer.create(
    <MockEnvironment>
      <AccountSelection />
    </MockEnvironment>
  );
});

test("BusinessGuides", () => {
  renderer.create(
    <MockEnvironment>
      <BusinessGuides />
    </MockEnvironment>
  );
});

test("EditVendorPage", () => {
  renderer.create(
    <MockEnvironment>
      <EditVendorPage />
    </MockEnvironment>
  );
});

test("LandingPage", () => {
  renderer.create(
    <MockEnvironment>
      <LandingPage />
    </MockEnvironment>
  );
});

test("Login", () => {
  renderer.create(
    <MockEnvironment>
      <Login />
    </MockEnvironment>
  );
});

test("Signup", () => {
  renderer.create(
    <MockEnvironment>
      <Signup />
    </MockEnvironment>
  );
});

test("Vendor", () => {
  renderer.create(
    <MockEnvironment>
      <Vendor />
    </MockEnvironment>
  );
});

test("VendorAppForm", () => {
  renderer.create(
    <MockEnvironment>
      <VendorAppForm />
    </MockEnvironment>
  );
});

test("VendorDashboard", () => {
  renderer.create(
    <MockEnvironment>
      <VendorDashboard />
    </MockEnvironment>
  );
});

test("VendorPhotosUploader", () => {
  renderer.create(
    <MockEnvironment>
      <VendorPhotosUploader />
    </MockEnvironment>
  );
});

test("YourAccountUser", () => {
  renderer.create(
    <MockEnvironment>
      <YourAccountUser />
    </MockEnvironment>
  );
});
