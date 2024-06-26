import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./style/Sidebar.css";

// Icons
import userIcon from "../assets/icon/user_icon.png";
import chevronRightIcon from "../assets/icon/chevron_right.svg";
import homeIcon from "../assets/icon/home.svg";
import groupIcon from "../assets/icon/group.svg";
import settingsIcon from "../assets/icon/settings.svg";
import { FaVolumeHigh, FaVolumeXmark } from "react-icons/fa6";

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [speakerState, setSpeakerState] = useState(true);

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
                  {firstName} {lastName}
                </span>
              </div>
              <img
                id="sidebar-btn"
                className="non-changeable-icon"
                src={chevronRightIcon}
                alt="Sidebar Toggle"
                onClick={toggleSidebar}
              />
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
                  <img
                    className="non-changeable-icon"
                    src={homeIcon}
                    alt="Home"
                    style={
                      location.pathname === "/"
                        ? isDarkTheme
                          ? { filter: "invert(100%)" }
                          : { filter: "none" }
                        : {}
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
                    Home
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
                  <img
                    className="non-changeable-icon"
                    src={groupIcon}
                    alt="About Us"
                    style={
                      location.pathname === "/about"
                        ? isDarkTheme
                          ? { filter: "invert(100%)" }
                          : { filter: "none" }
                        : {}
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
                  <img
                    className="non-changeable-icon"
                    src={settingsIcon}
                    alt="Settings"
                    style={
                      location.pathname === "/settings"
                        ? isDarkTheme
                          ? { filter: "invert(100%)" }
                          : { filter: "none" }
                        : {}
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
                    <button
                      id="volume-btn"
                      className={speakerState ? "enabled" : ""}
                      onClick={() => setSpeakerState(!speakerState)}
                    >
                      {speakerState ? (
                        <FaVolumeHigh
                          size={20}
                          className="non-changeable-icon speaker"
                        />
                      ) : (
                        <FaVolumeXmark
                          size={20}
                          className="non-changeable-icon speaker"
                        />
                      )}
                    </button>
                    <span
                      className="sidebar-text"
                      style={{ marginLeft: "10px" }}
                    >
                      Auto Speak
                    </span>
                  </div>
                </li>
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
