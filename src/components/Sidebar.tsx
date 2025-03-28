import React, { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./styles/Sidebar.module.css";

// Icons
import { MdOutlinePeopleAlt } from "react-icons/md";
import { IoReorderThreeOutline, IoSettingsOutline } from "react-icons/io5";
import { LuHistory, LuLayers } from "react-icons/lu";
import { BiUserCircle } from "react-icons/bi";

const BREAKPOINT = 768;

export const Sidebar: React.FC = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false);
  const [userImageUrl, setUserImageUrl] = useState<string | null>(null);

  //
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarVisible(window.innerWidth >= BREAKPOINT);
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  });

  //
  useEffect(() => {
    window.ipcRenderer.send("give-user-info");
    window.ipcRenderer.once("backend-response", (_, response) => {
      setUserImageUrl(response.photoURL);
    });
  });

  if (!isSidebarVisible && window.innerWidth < BREAKPOINT) {
    return null;
  }

  // --------------------------------------------------- //
  return (
    <div className={styles.sidebar}>
      <div className={styles.upperPart}>
        <nav>
          <ul>
            <li>
              <IoReorderThreeOutline />
            </li>
            <li>
              <LuHistory />
            </li>
            <li>
              <LuLayers />
            </li>
            <li>
              <IoSettingsOutline />
            </li>
            <li>
              <MdOutlinePeopleAlt />
            </li>
          </ul>
        </nav>
      </div>
      <div className={styles.lowerPart}>
        <nav>
          <ul>
            <li>
              <ThemeToggle />
            </li>
            <li>
              {userImageUrl ? (
                <img
                  className={styles.userImage}
                  src={userImageUrl}
                  alt="User"
                />
              ) : (
                <BiUserCircle />
              )}
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};
