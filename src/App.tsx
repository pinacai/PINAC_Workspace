import { useContext, useEffect } from "react";
import { FrameHeader } from "./components/FrameHeader";
import { EmbeddingSettingsContext } from "./context/EmbeddingSettings";

// context
import { AuthContext } from "./context/Authentication";
import { WelcomeTextProvider } from "./context/WelcomeText";
import { ChatMsgProvider } from "./context/ChatMsg";
import { AttachmentProvider } from "./context/Attachment";
import "./index.css";

// pages
import SignInPage from "./pages/SignIn";
import HomePage from "./pages/Home";

const App = () => {
  const isAuthenticated = useContext(AuthContext)?.isAuthenticated;
  const isLoading = useContext(AuthContext)?.isLoading;
  const embeddingContext = useContext(EmbeddingSettingsContext);

  // check if default embedding model is downloaded
  useEffect(() => {
    window.ipcRenderer.send("get-backend-port");
    window.ipcRenderer.once("backend-port", async (_, port) => {
      try {
        const response = await fetch(
          `http://localhost:${port}/api/rag/default-embedder/status`
        );
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        const data = await response.json();
        embeddingContext?.setIsDefaultModel(data.status);
      } catch (error) {
        console.error("Failed to fetch:", error);
      }
    });
  });

  // ---------------------------------------------------- //
  return (
    <WelcomeTextProvider>
      <AttachmentProvider>
        <ChatMsgProvider>
          {isAuthenticated ? (
            <FrameHeader children={<HomePage />} />
          ) : (
            <FrameHeader children={<SignInPage isLoading={isLoading} />} />
          )}
        </ChatMsgProvider>
      </AttachmentProvider>
    </WelcomeTextProvider>
  );
};

export default App;
