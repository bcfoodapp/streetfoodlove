import * as renderer from "react-test-renderer";
import React from "react";
import { LandingPage } from "../components/UI/Pages/LandingPage";
import App from "../App";

test("App", () => {
  renderer.create(<App />);
});

test("LandingPage", () => {
  renderer.create(<LandingPage />);
});
