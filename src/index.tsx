import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/Authentication.tsx";
import { ModelSettingsProvider } from "./context/ModelSettings";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <ModelSettingsProvider>
          <App />
        </ModelSettingsProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
