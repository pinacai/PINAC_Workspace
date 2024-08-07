import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/Home";
import { ProfilePage } from "./features/profile/index";
import { AboutPage } from "./features/aboutUs/index";
import { SettingsPage } from "./features/settings/index";
import "./App.css";

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
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
