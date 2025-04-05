import React from "react";
import { deleteAllSessions } from "../../../database/db";

interface RedButtonProps {
  task: "logout" | "clear_history";
  icon: JSX.Element;
}

export const RedButton: React.FC<RedButtonProps> = ({ task, icon }) => {
  //
  const handleClick = () => {
    if (task === "clear_history") {
      deleteAllSessions().catch((error) => {
        console.error("Error deleting all sessions:", error);
      });
    }
    //
    else if (task === "logout") {
      window.ipcRenderer.send("logout");
      window.ipcRenderer.send("reload-app");
    }
  };

  return (
    <>
      <button
        className="size-7 p-1.5 bg-red-500 hover:bg-red-700 rounded-full"
        onClick={handleClick}
      >
        {icon}
      </button>
    </>
  );
};
