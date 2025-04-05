import { useContext } from "react";
import { FrameHeader } from "./components/FrameHeader";

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

  // ---------------------------------------------------- //
  return (
    <WelcomeTextProvider>
      <AttachmentProvider>
        <ChatMsgProvider>
          {isAuthenticated ? (
            <FrameHeader children={<HomePage />} />
          ) : (
            <FrameHeader children={<SignInPage />} />
          )}
        </ChatMsgProvider>
      </AttachmentProvider>
    </WelcomeTextProvider>
  );
};

export default App;
