import { createRoot } from "react-dom/client";
import { StrictMode } from "react";

import { Wrapper } from "./components/Wrapper.jsx";
import App from "./App.jsx";
import "./index.css";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Wrapper>
      <App />
    </Wrapper>
  </StrictMode>
);
