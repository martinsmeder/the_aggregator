import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "./styles/root.css";
import "./styles/header.css";
import "./styles/footer.css";
import "./styles/summaries.css";
import "./styles/news.css";
import "./styles/charts.css";
import ParticleBackground from "./components/ParticleBackground";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <ParticleBackground />
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </>
);
