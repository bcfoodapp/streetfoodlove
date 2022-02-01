import * as renderer from "react-test-renderer";
import React from "react";
import { LandingPage } from "../components/UI/Pages/LandingPage";

test("LandingPage", () => {
  renderer.create(<LandingPage />);
});
