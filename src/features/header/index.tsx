import { useEffect, useState, useRef } from "react";
import { RedButton } from "./components/RedButton";
import { NewChatBtn } from "./components/NewChatBtn";

// Icons
import { TbLogout } from "react-icons/tb";
import { MdDelete } from "react-icons/md";

interface HeaderProps {
  title: string;
  page: "home" | "profile" | "history" | "about" | "settings" | "project";
  clearChat?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, page, clearChat }) => {


  //
  // --------------------------------------------------- //
  return (
    <>
      <div
        className={`w-full h-[60px] py-[10px] px-5 flex items-center justify-between
        ${
          location.pathname == "/" && page !== "home"
            ? "text-gray-200"
            : "text-gray-800"
        } dark:text-gray-200
        ${page == "home" ? "mt-[5px]" : "mt-[1px]"}
        `}
      >
        <div className="flex items-center justify-between">
          <div
            className={
              page == "home"
                ? "font-normal font-nasa text-4xl"
                : "font-normal font-cormorant text-3xl"
            }
          >
            {title}
          </div>
        </div>
        <div className="flex gap-[15px]">
          {/* for the Clear Chat */}
          {location.pathname == "/" && clearChat && (
            <NewChatBtn clearChat={clearChat} />
          )}
          {/* for clear history button */}
          {page == "history" && (
            <RedButton
              task="clear_history"
              icon={<MdDelete className="size-full" />}
            />
          )}
          {/* for the logout button */}
          {page == "profile" && (
            <RedButton
              task="logout"
              icon={<TbLogout className="size-full" />}
            />
          )}
        </div>
      </div>
    </>
  );
};
