import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ui/ThemeToggle";
import { LogoutBtn } from "./ui/LogoutBtn";
import { NewChatBtn } from "./ui/NewChatBtn";
import styles from "./style/Header.module.css";

// Icons
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

interface HeaderProps {
  title: string;
  clearChat?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, clearChat }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownMenuRef = useRef<HTMLDivElement>(null);
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
  const [isDropdownActive, setIsDropdownActive] = useState<boolean>(false);

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
  // --------------------------------------------------- //
  return (
    <>
      <div className={styles.pageHeader}>
        <div className={styles.left_side}>
          <div>
            <span
              className={
                location.pathname == "/"
                  ? `${styles.home_title}`
                  : `${styles.title}`
              }
            >
              {title}
            </span>
            {location.pathname !== "/" ? (
              <>
                <div className={styles.bottom_line}></div>
              </>
            ) : null}
          </div>
          {/* Render the sidebar button */}
          {isMenuVisible && (
            <div className={styles.header_menu} ref={dropdownMenuRef}>
              <div>
                <button
                  className={location.pathname == "/" ? `${styles.home}` : ""}
                  onClick={() => setIsDropdownActive(!isDropdownActive)}
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
                className={`${styles.dropdown_menu} ${
                  isDropdownActive ? `${styles.active}` : ""
                }`}
              >
                <ul>
                  {location.pathname !== "/profile" && (
                    <li onClick={() => navigate("/profile")}>Profile</li>
                  )}
                  {location.pathname !== "/" && (
                    <li onClick={() => navigate("/")}>Chat</li>
                  )}
                  {location.pathname !== "/about" && (
                    <li onClick={() => navigate("/about")}>About Us</li>
                  )}
                  {location.pathname !== "/settings" && (
                    <li onClick={() => navigate("/settings")}>Settings</li>
                  )}
                </ul>
              </div>
              {/* Special section at last for theme change */}
              <div
                className={`${styles.dropdown_last_menu} ${
                  styles.dropdown_menu
                } ${isDropdownActive ? `${styles.active}` : ""}`}
                style={{ marginTop: "130px" }}
              >
                <ul>
                  <li
                    style={{
                      alignItems: "center",
                      padding: "5px 10px",
                    }}
                  >
                    <ThemeToggle />
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
        <div className={styles.right_side}>
          {/* Render the new chat button only for Home Page */}
          {location.pathname == "/" && clearChat && (
            <NewChatBtn clearChat={clearChat} />
          )}
          {/* Render the logout button only for Profile Page */}
          {location.pathname == "/profile" ? (
            <LogoutBtn changePage={navigate} />
          ) : null}
        </div>
      </div>
    </>
  );
};
