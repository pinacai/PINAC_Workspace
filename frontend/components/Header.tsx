import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./style/Header.css";

// Icons
import { IoAddCircleOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

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

  //
  // adds border line below the page title except HomePage
  const borderLine = () => {
    return (
      <>
        <div className="bottom-line"></div>
      </>
    );
  };

  //
  const logout = () => {
    window.ipcRenderer.send("request-to-backend", { request_type: "logout" });
    changePage("/");
    window.ipcRenderer.send("reload-app");
  };

  //
  // adds new-chat button only for HomePage
  const newChatBtn = () => {
    return (
      <>
        <button className="newChatButton" onClick={props.clearChat}>
          <IoAddCircleOutline
            size={30}
            color="var(--text-color1)"
            style={{ zIndex: 2 }}
          />
          <span>New Chat</span>
        </button>
      </>
    );
  };

  //
  // adds new-chat button only for HomePage
  const logoutBtn = () => {
    return (
      <>
        <button className="logout-btn" onClick={() => logout()}>
          <div className="logout-img">
            <svg viewBox="0 0 512 512">
              <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
            </svg>
          </div>
          <div className="logout-text">Logout</div>
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

  //
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

  //
  // Retrieve the preferred theme from local storage and set that theme
  useEffect(() => {
    const preferredTheme = localStorage.getItem("preferred-theme");
    setIsDarkTheme(preferredTheme === "dark");
  }, []);

  //
  // Creating an event handler to close the dropdown menu by click elsewhere outside the menu
  useEffect(() => {
    const handleOutsideClicks = (e: MouseEvent) => {
      if (
        isDropdownActive &&
        dropdownMenuRef.current &&
        !dropdownMenuRef.current.contains(e.target as Node)
      ) {
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
                  {isDropdownActive ? (
                    <IoIosArrowUp size={25} color="var(--headerTitle-color)" />
                  ) : (
                    <IoIosArrowDown
                      size={25}
                      color="var(--headerTitle-color)"
                    />
                  )}
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
                className={`dropdown-last-menu dropdown-menu ${
                  isDropdownActive ? "active" : ""
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
                    {/* toggle btn copied from sidebar */}
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
          {location.pathname == "/profile" ? logoutBtn() : null}
        </div>
      </div>
    </>
  );
};
