import React, { useState, useContext, useEffect } from "react";
import { ThemeModeContext } from "../context/ThemeMode";
import styles from "./styles/ThemeToggle.module.css";

export const ThemeToggle: React.FC = () => {
  const themeModeContext = useContext(ThemeModeContext);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);

  const changeTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    themeModeContext?.setThemeMode(isDarkTheme ? "light" : "dark");
  };

  //
  useEffect(() => {
    setIsDarkTheme(themeModeContext?.themeMode === "dark");
  }, [themeModeContext?.themeMode]);

  return (
    <div>
      <input
        type="checkbox"
        className={styles.toggle}
        checked={isDarkTheme}
        onChange={changeTheme}
      />
      <label htmlFor="toggle"></label>
    </div>
  );
};
