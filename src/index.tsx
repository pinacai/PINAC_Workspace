import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./context/Authentication.tsx";
import { ModalProvider } from "./context/Modal.tsx";
import SettingsProvider from "./context/SettingsProvider";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <SettingsProvider>
        <ModalProvider>
          <App />
        </ModalProvider>
      </SettingsProvider>
    </AuthProvider>
  </React.StrictMode>
);
