import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { JiraCloneFrond } from "./JiraCloneFrond";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <JiraCloneFrond />
  </StrictMode>,
);
