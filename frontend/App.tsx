import { useContext, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/Home";
import { ThemeModeContext } from "./context/ThemeMode";
import { ThemeStyleContext } from "./context/ThemeStyle";
import { SubPageProvider } from "./context/subPage";
import "./App.css";

// sub-pages
import AboutUs from "./features/aboutUs/index";
import Settings from "./features/settings/index";
import Profile from "./features/profile/index";

const App = () => {
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

  // ---------------------------------------------------- //
  return (
    <Router>
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
              <div className="container">
                <Profile />
              </div>
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
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
              <div className="container">
                <Settings />
              </div>
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
