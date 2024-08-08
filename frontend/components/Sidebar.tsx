import React, { useState, useContext, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { SubPageContext } from "../context/subPage";
import styles from "./styles/Sidebar.module.css";

// Icons
import { MdGroup } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { LuHistory } from "react-icons/lu";
import defaultUserIcon from "/icon/user_icon.png";

const BREAKPOINT = 576;

export const Sidebar: React.FC = () => {
  const subPageContext = useContext(SubPageContext);
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false);
  const [userImageUrl] = useState<string | null>(null);

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
  const changeSubPage = (subPage: string): void => {
    subPageContext?.setSubPage(subPage);
  };

  //
  const renderNavItem = (
    subPage: string,
    Icon: React.ElementType
  ): JSX.Element => (
    <li onClick={() => changeSubPage(subPage)}>
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
            <li onClick={() => changeSubPage("/profile")}>
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
