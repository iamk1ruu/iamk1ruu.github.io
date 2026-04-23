import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ForumPage from "./ForumPage";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ForumPage />
  </StrictMode>,
);
