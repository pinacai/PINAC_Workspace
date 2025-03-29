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

export const Sidebar: React.FC = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [userImageUrl, setUserImageUrl] = useState<string | null>(null);
  const [page, setPage] = useState<
    "profile" | "history" | "about" | "settings" | "project"
  >("history");

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
      className={`h-full pt-[30px]
      ${isExpanded ? "w-96" : "w-18"}
      text-gray-200 dark:text-gray-300
      flex items-center justify-between overflow-hidden
      transition-all duration-300
      `}
    >
      <div className="w-18 h-full flex flex-col items-center justify-between">
        <div className="w-full">
          <nav className="style-none w-full">
            <ul>
              <li
                className="w-full sidebar-li"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <IoReorderThreeOutline size={30} />
              </li>
              <li className="sidebar-li" onClick={() => setPage("history")}>
                <LuHistory size={25} />
              </li>
              <li className="sidebar-li" onClick={() => setPage("project")}>
                <LuLayers size={25} />
              </li>
              <li className="sidebar-li" onClick={() => setPage("settings")}>
                <IoSettingsOutline size={30} />
              </li>
              <li className="sidebar-li" onClick={() => setPage("about")}>
                <MdOutlinePeopleAlt size={25} />
              </li>
            </ul>
          </nav>
        </div>
        <div className="w-full">
          <nav className="style-none">
            <ul>
              <li className="sidebar-li">
                <ThemeToggle />
              </li>
              <li className="sidebar-li" onClick={() => setPage("profile")}>
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
        className={`w-full h-full
        ${isExpanded ? "flex" : "hidden"}`}
      >
        {page === "profile" && <Profile />}
        {page === "history" && <ChatHistory />}
        {page === "project" && <h1>Profile</h1>}
        {page === "settings" && <Settings />}
        {page === "about" && <AboutUs />}
      </div>
    </div>
  );
};
