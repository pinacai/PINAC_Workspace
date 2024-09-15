import React, { createContext, useState, useEffect } from "react";

const ThemeModeContext = createContext<{
  themeMode: string;
  setThemeMode: React.Dispatch<React.SetStateAction<string>>;
} | null>(null);

interface ThemeModeProviderProps {
  children: React.ReactNode;
}

const ThemeModeProvider: React.FC<ThemeModeProviderProps> = ({ children }) => {
  // Initialize themeMode state from localStorage or default
  const [themeMode, setThemeMode] = useState(() => {
    const mode = localStorage.getItem("theme-mode");
    return mode ? mode : "light";
  });

  // Update localStorage on themeMode change
  useEffect(() => {
    localStorage.setItem("theme-mode", themeMode);
  }, [themeMode]);

  return (
    <ThemeModeContext.Provider value={{ themeMode, setThemeMode }}>
      {children}
    </ThemeModeContext.Provider>
  );
};

export { ThemeModeContext, ThemeModeProvider };
