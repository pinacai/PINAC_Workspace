import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./context/Authentication.tsx";
import { ModelSettingsProvider } from "./context/ModelSettings";
import { ModalProvider } from "./context/Modal.tsx";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <ModelSettingsProvider>
        <ModalProvider>
          <App />
        </ModalProvider>
      </ModelSettingsProvider>
    </AuthProvider>
  </React.StrictMode>
);
