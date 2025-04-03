import React, { useState } from "react";

export const ThemeToggle: React.FC = () => {
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);

  const changeTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div>
      <input
        type="checkbox"
        className="toggle"
        checked={isDarkTheme}
        onChange={changeTheme}
      />
      <label htmlFor="toggle"></label>
    </div>
  );
};
