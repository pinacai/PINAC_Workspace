import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/Home/index";
import { ProfilePage } from "./pages/Profile/index";
import { HistoryPage } from "./pages/History/index";
import { AboutPage } from "./pages/About/index";
import { SettingsPage } from "./pages/Settings/index";
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
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
