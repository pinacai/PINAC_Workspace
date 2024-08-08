import React, { createContext, useState } from "react";

export const ThemeModeContext = createContext<{
  themeMode: string;
  setThemeMode: React.Dispatch<React.SetStateAction<string>>;
} | null>(null);

interface ThemeModeProviderProps {
  children: React.ReactNode;
}

export const ThemeModeProvider: React.FC<ThemeModeProviderProps> = ({
  children,
}) => {
  const [themeMode, setThemeMode] = useState("light");
  return (
    <ThemeModeContext.Provider value={{ themeMode, setThemeMode }}>
      {children}
    </ThemeModeContext.Provider>
  );
};
