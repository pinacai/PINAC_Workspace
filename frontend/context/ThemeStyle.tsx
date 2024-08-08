import React, { createContext, useState } from "react";

export const ThemeStyleContext = createContext<{
  themeStyle: string;
  setThemeStyle: React.Dispatch<React.SetStateAction<string>>;
} | null>(null);

interface ThemeStyleProviderProps {
  children: React.ReactNode;
}

export const ThemeStyleProvider: React.FC<ThemeStyleProviderProps> = ({
  children,
}) => {
  const [themeStyle, setThemeStyle] = useState("Dawn_n_Dusk");
  return (
    <ThemeStyleContext.Provider value={{ themeStyle, setThemeStyle }}>
      {children}
    </ThemeStyleContext.Provider>
  );
};
