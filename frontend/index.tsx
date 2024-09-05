import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter as Router } from "react-router-dom";
import { ThemeModeProvider } from "./context/ThemeMode.tsx";
import { ThemeStyleProvider } from "./context/ThemeStyle.tsx";
import { ChatMsgProvider } from "./context/chatMsg";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <ThemeModeProvider>
        <ThemeStyleProvider>
          <ChatMsgProvider>
            <App />
          </ChatMsgProvider>
        </ThemeStyleProvider>
      </ThemeModeProvider>
    </Router>
  </React.StrictMode>
);

// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event, message) => {
  console.log(message);
});
