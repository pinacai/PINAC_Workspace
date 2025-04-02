import { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
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
import Profile from "./features/profile/index";
import ChatHistory from "./features/chatHistory/index";
import Settings from "./features/settings/index";
import AboutUs from "./features/aboutUs/index";

const BREAKPOINT = 768;

const App = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const isAuthenticated = useContext(AuthContext)?.isAuthenticated;

  //
  // For pages
  useEffect(() => {
    const handleFunc = () => {
      if (currentPath !== "/" && window.innerWidth > BREAKPOINT) {
        navigate("/");
      }
    };
    window.addEventListener("resize", handleFunc);
    handleFunc();

    return () => window.removeEventListener("resize", handleFunc);
  }, [currentPath, navigate]);

  // ---------------------------------------------------- //
  return (
    <Routes>
      <Route
        path="/"
        element={
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
        }
      />
      <Route path="/profile" element={<FrameHeader children={<Profile />} />} />
      <Route
        path="/history"
        element={<FrameHeader children={<ChatHistory />} />}
      />
      <Route path="/project" element={<FrameHeader children={<></>} />} />
      <Route
        path="/settings"
        element={<FrameHeader children={<Settings />} />}
      />
      <Route path="/about" element={<FrameHeader children={<AboutUs />} />} />
    </Routes>
  );
};

export default App;
