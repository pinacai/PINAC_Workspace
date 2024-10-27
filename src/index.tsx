import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/Authentication.tsx";
import { ThemeModeProvider } from "./context/ThemeMode.tsx";
import { ThemeStyleProvider } from "./context/ThemeStyle.tsx";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <ThemeModeProvider>
          <ThemeStyleProvider>
            <App />
          </ThemeStyleProvider>
        </ThemeModeProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
