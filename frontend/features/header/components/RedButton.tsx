import React from "react";
import { deleteAllSessions } from "../../../database/db";
import { useNavigate } from "react-router-dom";
import styles from "../styles/RedButton.module.css";

interface RedButtonProps {
  task: "logout" | "clear_history";
  text: string;
  icon: JSX.Element;
}

export const RedButton: React.FC<RedButtonProps> = ({ task, text, icon }) => {
  const navigate = useNavigate();

  //
  const handleClick = () => {
    //
    if (task === "clear_history") {
      deleteAllSessions().catch((error) => {
        console.error("Error deleting all sessions:", error);
      });
    }
    //
    else if (task === "logout") {
      window.ipcRenderer.send("request-to-backend", { request_type: "logout" });
      navigate("/");
      window.ipcRenderer.send("reload-app");
    }
  };

  return (
    <>
      <button className={styles.logoutBtn} onClick={handleClick}>
        <div className={styles.logoutImg}>{icon}</div>
        <div className={styles.logoutText}>{text}</div>
      </button>
    </>
  );
};
