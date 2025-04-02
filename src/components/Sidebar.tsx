import React, { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";
import Profile from "../features/profile";
import ChatHistory from "../features/chatHistory";
import Settings from "../features/settings";
import AboutUs from "../features/aboutUs";

// Icons
import { MdOutlinePeopleAlt } from "react-icons/md";
import { IoReorderThreeOutline, IoSettingsOutline } from "react-icons/io5";
import { LuHistory, LuLayers } from "react-icons/lu";
import { BiUserCircle } from "react-icons/bi";

const BREAKPOINT = 768;
type PageType = "profile" | "history" | "about" | "settings" | "project";

interface SidebarProps {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isExpanded,
  setIsExpanded,
}) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false);
  const [userImageUrl, setUserImageUrl] = useState<string | null>(null);
  const [page, setPage] = useState<PageType>("history");

  const openSidebar = (givenPage: PageType) => {
    setPage(givenPage);
    if (givenPage == page) {
      setIsExpanded(!isExpanded);
    } else {
      setIsExpanded(true);
    }
  };

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
    <div
      className={`h-full pt-1
      ${isExpanded ? "w-80 xl:w-96" : "w-18"}
      text-gray-200 dark:text-gray-300
      flex items-center justify-between overflow-hidden
      transition-all duration-300
      `}
    >
      <div
        className={`w-18 h-full flex flex-col items-center justify-between
        ${isExpanded && "border-r border-gray-700 dark:border-zinc-700"}`}
      >
        <div className="w-18">
          <nav className="style-none w-full">
            <ul>
              <li
                className="w-full sidebar-li"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <IoReorderThreeOutline size={30} />
              </li>
              <li className="sidebar-li hover:bg-gray-700 dark:hover:bg-zinc-700" onClick={() => openSidebar("history")}>
                <LuHistory size={25} />
              </li>
              <li className="sidebar-li hover:bg-gray-700 dark:hover:bg-zinc-700" onClick={() => openSidebar("project")}>
                <LuLayers size={25} />
              </li>
              <li
                className="sidebar-li hover:bg-gray-700 dark:hover:bg-zinc-700"
                onClick={() => openSidebar("settings")}
              >
                <IoSettingsOutline size={30} />
              </li>
              <li className="sidebar-li hover:bg-gray-700 dark:hover:bg-zinc-700" onClick={() => openSidebar("about")}>
                <MdOutlinePeopleAlt size={25} />
              </li>
            </ul>
          </nav>
        </div>
        <div className="w-full">
          <nav className="style-none mb-2">
            <ul>
              <li className="sidebar-li">
                <ThemeToggle />
              </li>
              <li className="sidebar-li hover:bg-gray-700 dark:hover:bg-zinc-700" onClick={() => openSidebar("profile")}>
                {userImageUrl ? (
                  <img
                    className="size-30 rounded-b-full"
                    src={userImageUrl}
                    alt="User"
                  />
                ) : (
                  <BiUserCircle size={30} />
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
      {/* Hidden Part of Sidebar */}
      <div
        className={`w-78 h-full
        ${isExpanded ? "flex" : "hidden"}`}
      >
        {page === "profile" && <Profile />}
        {page === "history" && <ChatHistory />}
        {page === "project" && <></>}
        {page === "settings" && <Settings />}
        {page === "about" && <AboutUs />}
      </div>
    </div>
  );
};
