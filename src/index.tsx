import React from "react";
import ReactDOM from "react-dom/client";
import CalibrationApp from "./CalibrationApp";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <CalibrationApp />
  </React.StrictMode>
);
