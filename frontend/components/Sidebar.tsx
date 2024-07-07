import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./style/Sidebar.css";

// Icons
import { IoMdChatbubbles } from "react-icons/io";
import { MdGroup } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";
import userIcon from "../assets/icon/user_icon.png";

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  //
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

  // Function to handle page navigation
  const changePage = (path: string) => {
    navigate(path);
  };

  //
  // Function to toggle the sidebar's activation state
  const toggleSidebar = () => {
    setIsActive(!isActive);
  };

  //
  // Functions to change the Theme
  const changeTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    localStorage.setItem("preferred-theme", isDarkTheme ? "light" : "dark");
  };

  //
  // Selecting Icon Color for Present Page
  const getPresentPageIconColor = () => {
    const preferredThemePair = localStorage.getItem("preferred-theme-pair");
    //
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

    // If none of the conditions match, you can return a default value or null
    return undefined;
  };

  //
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

  //
  // Retrieve the preferred theme from local storage and set that theme
  useEffect(() => {
    const preferredTheme = localStorage.getItem("preferred-theme");
    setIsDarkTheme(preferredTheme === "dark");
  }, []);

  useEffect(() => {
    const body = document.body;
    const preferredThemePair = localStorage.getItem("preferred-theme-pair");
    // Remove all theme classes first
    body.classList.remove(
      "Dawn_n_Dusk-light",
      "Dawn_n_Dusk-dark",
      "Cyber_Tech_01-light",
      "Cyber_Tech_01-dark",
      "Aesthetics_Unbound-light",
      "Aesthetics_Unbound-dark"
    );
    if (isDarkTheme) {
      body.classList.add(`${preferredThemePair}-dark`); // Add 'dark-theme' class if isDarkTheme is true
    } else {
      body.classList.add(`${preferredThemePair}-light`); // Add 'light-theme' class if isDarkTheme is false
    }
  }, [isDarkTheme]);

  return (
    <>
      {/* Render the sidebar */}
      {(window.innerWidth >= 576 || isSidebarVisible) && (
        <div className={`sidebar ${isActive ? "active" : ""}`}>
          <div className="upper-part">
            <div className="top">
              <div className="profile" onClick={() => changePage("/profile")}>
                {imageUrl ? (
                  <img id="user-image" src={imageUrl} alt="User Image" />
                ) : (
                  <img id="user-image" src={userIcon} alt="User Image" />
                )}
                <span id="user-name" className="sidebar-text">
                  {firstName ? firstName : "Profile"} {lastName ? lastName : ""}
                </span>
              </div>
              {isActive ? (
                <FaAngleLeft
                  size={25}
                  color="var(--text-color1)"
                  id="sidebar-btn"
                  onClick={toggleSidebar}
                />
              ) : (
                <FaAngleRight
                  size={25}
                  color="var(--text-color1)"
                  id="sidebar-btn"
                  onClick={toggleSidebar}
                />
              )}
            </div>
            <div className="border-line"></div>
            <nav>
              <ul>
                <li
                  title="Homepage"
                  id="go-home"
                  className={location.pathname === "/" ? "present-page" : "li"}
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
                    className="sidebar-text"
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
                <li
                  title="About Us"
                  id="go-about"
                  className={
                    location.pathname === "/about" ? "present-page" : "li"
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
                    className="sidebar-text"
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
                <li
                  title="Settings"
                  id="go-settings"
                  className={
                    location.pathname === "/settings" ? "present-page" : "li"
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
                    className="sidebar-text"
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
          <div className="lower-part">
            <nav>
              <ul>
                <li className="li">
                  <div>
                    <input
                      type="checkbox"
                      id="theme-switch"
                      className="theme-switch"
                      checked={isDarkTheme}
                      onChange={changeTheme}
                    />
                    <label htmlFor="theme-switch" className="toggle-label">
                      <span className="toggle-ball"></span>
                    </label>
                  </div>
                  <span className="sidebar-text">Change theme</span>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};
