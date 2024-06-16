import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./style/Header.css";

// Icons
import addLogo from "../assets/icon/add_circle.svg";
import downArrow from "../assets/icon/arrow_down.svg";
import upArrow from "../assets/icon/arrow_up.svg";

interface HeaderProps {
  title: string;
  clearChat?: () => void;
}

export const Header: React.FC<HeaderProps> = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownMenuRef = useRef<HTMLDivElement>(null);
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
  const [isDropdownActive, setIsDropdownActive] = useState<boolean>(false);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);

  // Function to handle page navigation
  const changePage = (path: string) => {
    navigate(path);
  };

  // adds border line below the page title
  // except HomePage
  const borderLine = () => {
    return (
      <>
        <div className="bottom-line"></div>
      </>
    );
  };

  // adds new-chat button only
  // for HomePage
  const newChatBtn = () => {
    return (
      <>
        <button className="newChatButton" onClick={props.clearChat}>
          <img src={addLogo} className="non-changeable-icon" />
          <span>New Chat</span>
        </button>
      </>
    );
  };

  //
  const openMenu = () => {
    setIsDropdownActive(!isDropdownActive);
  };

  // Functions to change the Theme
  const changeTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    localStorage.setItem("preferred-theme", isDarkTheme ? "light" : "dark");
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 576) {
        setIsMenuVisible(true);
      } else {
        setIsMenuVisible(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Retrieve the preferred theme from local storage and set that theme
  useEffect(() => {
    const preferredTheme = localStorage.getItem("preferred-theme");
    setIsDarkTheme(preferredTheme === "dark");
  }, []);

  // Creating an event handler to close the dropdown menu by click elsewhere outside the menu
  useEffect(() => {
    const handleOutsideClicks = (e: MouseEvent) => {
      if (isDropdownActive && dropdownMenuRef.current && !dropdownMenuRef.current.contains(e.target as Node)) {
        setIsDropdownActive(false);
      }
    };

    window.addEventListener("mousedown", handleOutsideClicks);

    return () => window.removeEventListener("mousedown", handleOutsideClicks);
  }, [isDropdownActive]);

  //
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
      <div className="pageHeader">
        <div className="left-side">
          <div>
            <span className={location.pathname == "/" ? "home-title" : "title"}>
              {props.title}
            </span>
            {location.pathname !== "/" ? borderLine() : null}
          </div>
          {/* Render the sidebar button */}
          {isMenuVisible && (
            <div className="header-menu" ref={dropdownMenuRef}>
              <div>
                <button
                  className={location.pathname == "/" ? "home" : ""}
                  onClick={() => openMenu()}
                >
                  <img
                    src={isDropdownActive ? upArrow : downArrow}
                    alt="Menu"
                    className="changeable-icon"
                  />
                </button>
              </div>
              <div
                className={`dropdown-menu ${isDropdownActive ? "active" : ""}`}
              >
                <ul>
                  {location.pathname !== "/" && (
                    <li onClick={() => changePage("/")}>Home</li>
                  )}
                  {location.pathname !== "/profile" && (
                    <li onClick={() => changePage("/profile")}>Profile</li>
                  )}
                  {location.pathname !== "/about" && (
                    <li onClick={() => changePage("/about")}>About Us</li>
                  )}
                  {location.pathname !== "/settings" && (
                    <li onClick={() => changePage("/settings")}>Settings</li>
                  )}
                </ul>
              </div>
              {/* Special section at last for theme change */}
              <div
                className={`dropdown-last-menu dropdown-menu ${isDropdownActive ? "active" : ""
                  }`}
                style={{ marginTop: "130px" }}
              >
                <ul>
                  <li
                    style={{
                      alignItems: "center",
                      padding: "5px 10px",
                    }}
                  >
                    {/* toggle btn coppied from sidebar */}
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
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
        <div className="right-side">
          {location.pathname == "/" ? newChatBtn() : null}
        </div>
      </div>
    </>
  );
};
