import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Apply theme class from persisted storage BEFORE React mounts to avoid flash
try {
  const stored = JSON.parse(localStorage.getItem("eventix-storage") || "{}");
  const theme = stored?.state?.theme ?? "dark";
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
} catch {
  document.documentElement.classList.add("dark");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
