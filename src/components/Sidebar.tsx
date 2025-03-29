import React, { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";

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
      className={`h-full
      ${isExpanded ? "w-96" : "w-18"}	
      bg-secondary dark:bg-secondary-dark
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
              <li className="sidebar-li">
                <LuHistory size={25} />
              </li>
              <li className="sidebar-li">
                <LuLayers size={25} />
              </li>
              <li className="sidebar-li">
                <IoSettingsOutline size={30} />
              </li>
              <li className="sidebar-li">
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
              <li className="sidebar-li">
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
      ></div>
    </div>
  );
};
