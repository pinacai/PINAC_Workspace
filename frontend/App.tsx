import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ProfilePage } from "./pages/ProfilePage";
import { AboutPage } from "./pages/AboutPage";
import { SettingsPage } from "./pages/SettingsPage";

const App = () => {

  const preferredTheme = localStorage.getItem("preferred-theme");
  const preferredThemePair = localStorage.getItem("preferred-theme-pair");

  if (preferredThemePair !== 'Dawn_n_Dusk' && preferredThemePair !== 'Cyber_Tech_01') {
    localStorage.setItem("preferred-theme-pair", "Dawn_n_Dusk");
  }

  if (preferredTheme !== 'light' && preferredTheme !== 'dark') {
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
