import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "./styles/root.css";
import "./styles/header.css";
import "./styles/footer.css";
import "./styles/summaries.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
