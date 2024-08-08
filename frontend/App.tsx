import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/Home";
import { SubPageProvider } from "./context/subPage";
import "./App.css";

// sub-pages
import AboutUs from "./features/aboutUs/index";
import Settings from "./features/settings/index";
import Profile from "./features/profile/index";

const App = () => {
  // Setting the default theme
  const preferredTheme = localStorage.getItem("preferred-theme");
  const preferredThemePair = localStorage.getItem("preferred-theme-pair");

  if (
    preferredThemePair !== "Dawn_n_Dusk" &&
    preferredThemePair !== "Cyber_Tech_01" &&
    preferredThemePair !== "Aesthetics_Unbound"
  ) {
    localStorage.setItem("preferred-theme-pair", "Dawn_n_Dusk");
  }
  if (preferredTheme !== "light" && preferredTheme !== "dark") {
    localStorage.setItem("preferred-theme", "light");
  }

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
