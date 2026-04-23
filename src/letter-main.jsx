import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import LetterPage from "./LetterPage";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LetterPage />
  </StrictMode>,
);
