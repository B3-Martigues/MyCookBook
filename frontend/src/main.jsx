import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  //StrictMode permet de détecter les problèmes potentiels dans l'application (conçu pour le développement)
  <StrictMode>
    <App />
  </StrictMode>
);
