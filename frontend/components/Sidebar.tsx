import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { SubPageContext } from "../context/SubPage";
import styles from "./styles/Sidebar.module.css";

// Icons
import { MdGroup } from "react-icons/md";
import { IoMdChatbubbles, IoMdSettings } from "react-icons/io";
import { LuHistory } from "react-icons/lu";
import defaultUserIcon from "/icon/user_icon.png";

const BREAKPOINT = 460;
const BREAKPOINT2 = 768;

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const subPageContext = useContext(SubPageContext);
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false);
  const [isChatIconVisible, setIsChatIconVisible] = useState<boolean>(false);
  const [userImageUrl, setUserImageUrl] = useState<string | null>(null);

  //
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarVisible(window.innerWidth >= BREAKPOINT);
      setIsChatIconVisible(window.innerWidth <= BREAKPOINT2);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  });

  //
  useEffect(() => {
    window.ipcRenderer.send("request-to-backend", {
      request_type: "give-user-info",
    });
    window.ipcRenderer.once("backend-response", (_, response) => {
      setUserImageUrl(response.image);
    });
  });

  //
  const changeSubPage = (subPage: string): void => {
    subPageContext?.setSubPage(subPage);
  };

  //
  const changePage = (subPage: string): void => {
    changeSubPage(subPage);
    if (window.innerWidth < BREAKPOINT2) {
      navigate(subPage);
    }
  };

  //
  const renderNavItem = (
    subPage: string,
    Icon: React.ElementType,
  ): JSX.Element => (
    <li onClick={() => changePage(subPage)}>
      <Icon size={30} color="var(--sidebar-icon-color)" />
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
            <li onClick={() => changePage("/profile")}>
              <img
                className={styles.userImage}
                src={userImageUrl || defaultUserIcon}
                alt="User"
              />
            </li>
            <div className={styles.dividerLine} />
            {isChatIconVisible && renderNavItem("/", IoMdChatbubbles)}
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
