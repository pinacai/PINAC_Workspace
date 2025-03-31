import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "../../components/ThemeToggle";
import { RedButton } from "./components/RedButton";
import { NewChatBtn } from "./components/NewChatBtn";

// Icons
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { TbLogout } from "react-icons/tb";
import { MdDelete } from "react-icons/md";

const BREAKPOINT = 768;

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
      if (window.innerWidth < BREAKPOINT) {
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
        className={`w-full h-[60px] py-[10px] px-[20px] flex items-center justify-between
        ${
          location.pathname == "/" && page !== "home"
            ? "text-gray-200"
            : "text-gray-800"
        } dark:text-gray-200
        ${page == "home" ? "lg:mt-[5px]" : "lg:mt-[1px]"}
        `}
      >
        <div className="flex items-center justify-between">
          <div
              className={
                page == "home"
                  ? "font-normal font-nasa text-3xl lg:text-4xl"
                  : "font-bold lg:font-normal font-cormorant text-3xl"
              }
            >
              {title}
          </div>

          {/* Render the sidebar button */}
          {isMenuVisible && (
            <div ref={dropdownMenuRef}>
              <div>
                <button
                  className="ml-3 mt-2 text-gray-500 dark:text-gray-400 rounded-sm hover:bg-gray-300 dark:hover:bg-gray-700"
                  onClick={() => setIsDropdownActive(!isDropdownActive)}
                >
                  {isDropdownActive ? (
                    <IoIosArrowUp size={22} />
                  ) : (
                    <IoIosArrowDown size={22} />
                  )}
                </button>
              </div>
              <div
                className={
                  isDropdownActive
                    ? "block absolute w-[110px] sm:w-[150px] mt-[5px] ml-[10px] font-exo bg-gray-200 dark:bg-tertiary-dark rounded-lg border-2 border-gray-300 dark:border-zinc-600 z-50"
                    : "hidden"
                }
              >
                <ul className="style-none">
                  {location.pathname !== "/profile" && (
                    <li
                      className="header-dropdown-li cursor-pointer hover:bg-gray-300 dark:hover:bg-zinc-600"
                      onClick={() => navigate("/profile")}
                    >
                      Profile
                    </li>
                  )}
                  {location.pathname !== "/" && (
                    <li
                      className="header-dropdown-li cursor-pointer hover:bg-gray-300 dark:hover:bg-zinc-600"
                      onClick={() => navigate("/")}
                    >
                      Chat
                    </li>
                  )}
                  {location.pathname !== "/history" && (
                    <li
                      className="header-dropdown-li cursor-pointer hover:bg-gray-300 dark:hover:bg-zinc-600"
                      onClick={() => navigate("/history")}
                    >
                      Chat History
                    </li>
                  )}
                  {location.pathname !== "/project" && (
                    <li
                      className="header-dropdown-li cursor-pointer hover:bg-gray-300 dark:hover:bg-zinc-600"
                      onClick={() => navigate("/about")}
                    >
                      Project
                    </li>
                  )}
                  {location.pathname !== "/settings" && (
                    <li
                      className="header-dropdown-li cursor-pointer hover:bg-gray-300 dark:hover:bg-zinc-600"
                      onClick={() => navigate("/settings")}
                    >
                      Settings
                    </li>
                  )}
                  {location.pathname !== "/about" && (
                    <li
                      className="header-dropdown-li cursor-pointer hover:bg-gray-300 dark:hover:bg-zinc-600"
                      onClick={() => navigate("/about")}
                    >
                      About Us
                    </li>
                  )}
                  <li
                    className="header-dropdown-li"
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
        <div className="flex gap-[15px]">
          {/* for the Clear Chat */}
          {location.pathname == "/" && clearChat && (
            <NewChatBtn clearChat={clearChat} />
          )}
          {/* for clear history button */}
          {page == "history" && (
            <RedButton task="clear_history" icon={<MdDelete className="size-full" />} />
          )}
          {/* for the logout button */}
          {page == "profile" && (
            <RedButton task="logout" icon={<TbLogout className="size-full" />} />
          )}
        </div>
      </div>
    </>
  );
};
