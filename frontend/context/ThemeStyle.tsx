import React, { createContext, useState, useEffect } from "react";

const ThemeStyleContext = createContext<{
  themeStyle: string;
  setThemeStyle: React.Dispatch<React.SetStateAction<string>>;
} | null>(null);

interface ThemeStyleProviderProps {
  children: React.ReactNode;
}

const ThemeStyleProvider: React.FC<ThemeStyleProviderProps> = ({
  children,
}) => {
  // Initialize themeStyle state from localStorage or default
  const [themeStyle, setThemeStyle] = useState(() => {
    const style = localStorage.getItem("theme-style");
    return style ? style : "Dawn_n_Dusk";
  });

  // Update localStorage on themeStyle change
  useEffect(() => {
    localStorage.setItem("theme-style", themeStyle);
  }, [themeStyle]);

  return (
    <ThemeStyleContext.Provider value={{ themeStyle, setThemeStyle }}>
      {children}
    </ThemeStyleContext.Provider>
  );
};

export { ThemeStyleContext, ThemeStyleProvider };
