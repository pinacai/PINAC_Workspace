import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ui/ThemeToggle";
import styles from "./style/Sidebar.module.css";

// Icons
import { MdGroup } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { LuHistory } from "react-icons/lu";
import defaultUserIcon from "/icon/user_icon.png";

const BREAKPOINT = 576;

// type ThemePair = "Dawn_n_Dusk" | "Cyber_Tech_01" | "Aesthetics_Unbound";

// type ColorMap = {
//   [key in ThemePair]: {
//     dark: string;
//     light: string;
//   };
// };

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false);
  const [userImageUrl] = useState<string | null>(null);
  // const [isDarkTheme] = useState<boolean>(
  //   () => localStorage.getItem("preferred-theme") === "dark"
  // );
  //
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarVisible(window.innerWidth >= BREAKPOINT);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //
  const navigateToPage = (path: string): void => {
    navigate(path);
  };

  //
  const renderNavItem = (
    path: string,
    Icon: React.ElementType
  ): JSX.Element => (
    <li onClick={() => navigateToPage(path)}>
      <Icon size={30} />
    </li>
  );

  if (!isSidebarVisible && window.innerWidth < BREAKPOINT) {
    return null;
  }

  // --------------------------------------------------- //
  return (
    <div className={styles.sidebar}>
      <div className={styles.upperPart}>
        <nav>
          <ul>
            <li onClick={() => navigateToPage("/profile")}>
              <img
                className={styles.userImage}
                src={userImageUrl || defaultUserIcon}
                alt="User"
              />
            </li>
            <div className={styles.dividerLine} />
            {renderNavItem("/history", LuHistory)}
            {renderNavItem("/about", MdGroup)}
            {renderNavItem("/settings", IoMdSettings)}
          </ul>
        </nav>
      </div>
      <div className={styles.lowerPart}>
        <nav>
          <ul>
            <li>
              <ThemeToggle />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};
