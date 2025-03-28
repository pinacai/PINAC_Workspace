import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "../../components/ThemeToggle";
import { RedButton } from "./components/RedButton";
import { NewChatBtn } from "./components/NewChatBtn";
import styles from "./styles/index.module.css";

// Icons
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { TbLogout } from "react-icons/tb";
import { MdDelete } from "react-icons/md";

interface HeaderProps {
  title: string;
  page: "home" | "profile" | "history" | "about" | "settings" | "project";
  clearChat?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, page, clearChat }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownMenuRef = useRef<HTMLDivElement>(null);
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
  const [isDropdownActive, setIsDropdownActive] = useState<boolean>(false);
  //
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 460) {
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
      <div
        className={`${styles.pageHeader} ${
          page == "home" && styles.homePageHeader
        }`}
      >
        <div className={styles.leftSide}>
          <div>
            <span
              className={
                page == "home" ? `${styles.homeTitle}` : `${styles.title}`
              }
            >
              {title}
            </span>
          </div>

          {/* Render the sidebar button */}
          {isMenuVisible && (
            <div className={styles.headerMenu} ref={dropdownMenuRef}>
              <div>
                <button
                  className={location.pathname == "/" ? `${styles.home}` : ""}
                  onClick={() => setIsDropdownActive(!isDropdownActive)}
                >
                  {isDropdownActive ? (
                    <IoIosArrowUp size={25} color="var(--text-color-iconic)" />
                  ) : (
                    <IoIosArrowDown
                      size={25}
                      color="var(--text-color-iconic)"
                    />
                  )}
                </button>
              </div>
              <div
                className={`${styles.dropdownMenu} ${
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
                  {location.pathname !== "/history" && (
                    <li onClick={() => navigate("/history")}>Chat History</li>
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
                className={`${styles.dropdownLastMenu} ${styles.dropdownMenu} ${
                  isDropdownActive ? `${styles.active}` : ""
                }`}
                style={{ marginTop: "167px" }}
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
        <div className={styles.rightSide}>
          {/* for the Clear Chat */}
          {location.pathname == "/" && clearChat && (
            <NewChatBtn clearChat={clearChat} />
          )}
          {/* for clear history button */}
          {page == "history" && (
            <RedButton task="clear_history" text="Delete" icon={<MdDelete />} />
          )}
          {/* for the logout button */}
          {page == "profile" && (
            <RedButton task="logout" text="Logout" icon={<TbLogout />} />
          )}
        </div>
      </div>
    </>
  );
};
