import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./context/Authentication.tsx";
import { ModelSettingsProvider } from "./context/ModelSettings";
import { WebSearchProvider } from "./context/WebSearch.tsx";
import { ModalProvider } from "./context/Modal.tsx";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <ModelSettingsProvider>
        <WebSearchProvider>
          <ModalProvider>
            <App />
          </ModalProvider>
        </WebSearchProvider>
      </ModelSettingsProvider>
    </AuthProvider>
  </React.StrictMode>
);
