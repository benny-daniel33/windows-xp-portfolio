import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// ADD THIS:
import "xp.css/dist/XP.css"; // XP theme styles [web:1]

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

