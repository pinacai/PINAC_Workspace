import { useEffect, useState } from "react";
import { getStoredTheme, setStoredTheme } from "../context/themeManager";

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = getStoredTheme();
    setIsDark(theme === "dark");
    setStoredTheme(theme);
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    setStoredTheme(newTheme);
  };

  return (
    <input
      type="checkbox"
      className="toggle"
      checked={isDark}
      onChange={toggleTheme}
    />
  );
};
