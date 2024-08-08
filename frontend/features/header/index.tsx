import { useContext, useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "../../components/ThemeToggle";
import { LogoutBtn } from "./components/LogoutBtn";
import { NewChatBtn } from "./components/NewChatBtn";
import { SubPageContext } from "../../context/subPage";
import styles from "./styles/index.module.css";

// Icons
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

interface HomeHeaderProps {
  title: string;
  clearChat: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ title, clearChat }) => {
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
      <div className={`${styles.pageHeader} ${styles.homePageHeader}`}>
        <div className={styles.leftSide}>
          <div>
            <span className={styles.homeTitle}>{title}</span>
          </div>
          {/* Render the menubar button */}
          {isMenuVisible && (
            <div className={styles.headerMenu} ref={dropdownMenuRef}>
              <div>
                <button
                  className={styles.home}
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
        <div className={styles.rightSide}>
          <NewChatBtn clearChat={clearChat} />
        </div>
      </div>
    </>
  );
};

//
//
//
interface SubPageHeaderProps {
  title: string;
}

export const SubPageHeader: React.FC<SubPageHeaderProps> = ({ title }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const subPageContext = useContext(SubPageContext);

  return (
    <>
      <div className={styles.pageHeader}>
        <div className={styles.leftSide}>
          <div>
            <span className={styles.title}>{title}</span>
            <div className={styles.bottomLine}></div>
          </div>
        </div>
        <div className={styles.rightSide}>
          {/* Render the logout button only for Profile Page */}
          {location.pathname == "/profile" ||
          subPageContext?.subPage == "/profile" ? (
            <LogoutBtn changePage={navigate} />
          ) : null}
        </div>
      </div>
    </>
  );
};
