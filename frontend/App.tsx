import { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { HomePage } from "./pages/Home";
import { Sidebar } from "./components/Sidebar";
import { ThemeModeContext } from "./context/ThemeMode";
import { ThemeStyleContext } from "./context/ThemeStyle";
import { SubPageProvider } from "./context/SubPage";
import "./App.css";

// sub-pages
import AboutUs from "./features/aboutUs/index";
import Settings from "./features/settings/index";
import Profile from "./features/profile/index";

const BREAKPOINT = 768;

const App = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const themeModeContext = useContext(ThemeModeContext);
  const themeStyleContext = useContext(ThemeStyleContext);

  //
  // For app applying theme
  useEffect(() => {
    const body = document.body;
    // Remove all theme classes first
    body.classList.remove(
      "Dawn_n_Dusk-light",
      "Dawn_n_Dusk-dark",
      "Cyber_Tech_01-light",
      "Cyber_Tech_01-dark",
      "Aesthetics_Unbound-light",
      "Aesthetics_Unbound-dark"
    );
    // Add desired theme pair with mode as user previous preference
    body.classList.add(
      `${themeStyleContext?.themeStyle}-${themeModeContext?.themeMode}`
    );
  });

  //
  // For sub-pages
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
          <SubPageProvider>
            <HomePage />
          </SubPageProvider>
        }
      />
      <Route
        path="/profile"
        element={
          <>
            <Sidebar />
            <div className="container">
              <Profile />
            </div>
          </>
        }
      />
      <Route
        path="/history"
        element={
          <>
            <Sidebar />
            <div className="container" />
          </>
        }
      />
      <Route
        path="/about"
        element={
          <>
            <Sidebar />
            <div className="container">
              <AboutUs />
            </div>
          </>
        }
      />
      <Route
        path="/settings"
        element={
          <>
            <Sidebar />
            <div className="container">
              <Settings />
            </div>
          </>
        }
      />
    </Routes>
  );
};

export default App;
