import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ui/ThemeToggle";
import styles from "./style/Sidebar.module.css";

// Icons
import { MdGroup } from "react-icons/md";
import { IoMdChatbubbles, IoMdSettings } from "react-icons/io";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { LuHistory } from "react-icons/lu";
import userIcon from "/icon/user_icon.png";

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [isDarkTheme] = useState<boolean>(() => {
    const theme = localStorage.getItem("preferred-theme");
    return theme === "dark";
  });

  //
  // for handeling sidebar visibility according to screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 576) {
        setIsSidebarVisible(false);
      } else {
        setIsSidebarVisible(true);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //
  // Function to handle page navigation
  const changePage = (path: string) => {
    navigate(path);
  };

  //
  // Selecting Icon Color for Present Page
  const getPresentPageIconColor = () => {
    const preferredThemePair = localStorage.getItem("preferred-theme-pair");
    if (isDarkTheme && preferredThemePair === "Dawn_n_Dusk") {
      return "white";
    } else if (isDarkTheme && preferredThemePair === "Cyber_Tech_01") {
      return "white";
    } else if (isDarkTheme && preferredThemePair === "Aesthetics_Unbound") {
      return "#d83b26";
    } else if (!isDarkTheme && preferredThemePair === "Dawn_n_Dusk") {
      return "#1f2937";
    } else if (!isDarkTheme && preferredThemePair === "Cyber_Tech_01") {
      return "#153fc5";
    } else if (!isDarkTheme && preferredThemePair === "Aesthetics_Unbound") {
      return "#dc6d18";
    }
    return undefined;
  };

  //
  // Get User Info
  useEffect(() => {
    window.ipcRenderer.send("request-to-backend", {
      request_type: "give-user-info",
    });
    window.ipcRenderer.once("backend-response", (_, response) => {
      setImageUrl(response.image);
      setFirstName(response.first_name);
      setLastName(response.last_name);
    });
  }, []);

  // ------------------------------------------------------------- //
  return (
    <>
      {/* Render the sidebar */}
      {(window.innerWidth >= 576 || isSidebarVisible) && (
        <div
          className={`${styles.sidebar} ${isActive ? `${styles.active}` : ""}`}
        >
          {/*          Upper Part of Sidebar          */}
          {/* --------------------------------------- */}
          <div className={styles.upper_part}>
            <div className={styles.top}>
              {/* ============================== */}
              {/*         Profile Page           */}
              {/* ============================== */}
              <div
                className={styles.profile}
                onClick={() => changePage("/profile")}
              >
                {imageUrl ? (
                  <img id={styles.user_image} src={imageUrl} alt="User Image" />
                ) : (
                  <img id={styles.user_image} src={userIcon} alt="User Image" />
                )}
                <span id={styles.user_name} className={styles.sidebar_text}>
                  {firstName ? firstName : "Profile"} {lastName ? lastName : ""}
                </span>
              </div>
              {isActive ? (
                <FaAngleLeft
                  size={25}
                  color="var(--text-color1)"
                  id={styles.sidebar_btn}
                  onClick={() => setIsActive(!isActive)}
                />
              ) : (
                <FaAngleRight
                  size={25}
                  color="var(--text-color1)"
                  id={styles.sidebar_btn}
                  onClick={() => setIsActive(!isActive)}
                />
              )}
            </div>
            <div className={styles.border_line}></div>
            <nav>
              <ul>
                {/* =========================== */}
                {/*            Chat             */}
                {/* =========================== */}
                <li
                  title="Chat"
                  id={styles.go_home}
                  className={
                    location.pathname === "/"
                      ? `${styles.present_page}`
                      : `${styles.li}`
                  }
                  onClick={() => changePage("/")}
                >
                  <IoMdChatbubbles
                    size={25}
                    color={
                      location.pathname === "/"
                        ? getPresentPageIconColor()
                        : undefined
                    }
                  />
                  <span
                    className={styles.sidebar_text}
                    style={
                      location.pathname === "/"
                        ? isDarkTheme
                          ? {}
                          : { color: "var(--text-color2)" }
                        : {}
                    }
                  >
                    Chat
                  </span>
                </li>
                {/* ============================== */}
                {/*          Chat History          */}
                {/* ============================== */}
                <li
                  title="Chat History"
                  id={styles.go_home}
                  className={
                    location.pathname === "/history"
                      ? `${styles.present_page}`
                      : `${styles.li}`
                  }
                  onClick={() => changePage("/history")}
                >
                  <LuHistory
                    size={25}
                    color={
                      location.pathname === "/history"
                        ? getPresentPageIconColor()
                        : undefined
                    }
                  />
                  <span
                    className={styles.sidebar_text}
                    style={
                      location.pathname === "/history"
                        ? isDarkTheme
                          ? {}
                          : { color: "var(--text-color2)" }
                        : {}
                    }
                  >
                    Chat History
                  </span>
                </li>
                {/* ============================== */}
                {/*            About Us            */}
                {/* ============================== */}
                <li
                  title="About Us"
                  id={styles.go_about}
                  className={
                    location.pathname === "/about"
                      ? `${styles.present_page}`
                      : `${styles.li}`
                  }
                  onClick={() => changePage("/about")}
                >
                  <MdGroup
                    size={25}
                    color={
                      location.pathname === "/about"
                        ? getPresentPageIconColor()
                        : undefined
                    }
                  />
                  <span
                    className={styles.sidebar_text}
                    style={
                      location.pathname === "/about"
                        ? isDarkTheme
                          ? {}
                          : { color: "var(--text-color2)" }
                        : {}
                    }
                  >
                    About Us
                  </span>
                </li>
                {/* ============================== */}
                {/*          Settings Page         */}
                {/* ============================== */}
                <li
                  title="Settings"
                  id={styles.go_settings}
                  className={
                    location.pathname === "/settings"
                      ? `${styles.present_page}`
                      : `${styles.li}`
                  }
                  onClick={() => changePage("/settings")}
                >
                  <IoMdSettings
                    size={25}
                    color={
                      location.pathname === "/settings"
                        ? getPresentPageIconColor()
                        : undefined
                    }
                  />
                  <span
                    className={styles.sidebar_text}
                    style={
                      location.pathname === "/settings"
                        ? isDarkTheme
                          ? {}
                          : { color: "var(--text-color2)" }
                        : {}
                    }
                  >
                    Settings
                  </span>
                </li>
              </ul>
            </nav>
          </div>
          {/*          Lower Part of Sidebar          */}
          {/* --------------------------------------- */}
          <div className={styles.lower_part}>
            <nav>
              <ul>
                <li className={styles.li}>
                  <ThemeToggle />
                  <span className={styles.sidebar_text}>Change theme</span>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};
