import React from "react";
import styles from "../styles/RedButton.module.css";

interface RedButtonProps {
  text: string;
  icon: JSX.Element;
  changePage?: (path: string) => void;
}

export const RedButton: React.FC<RedButtonProps> = ({
  text,
  icon,
  changePage,
}) => {
  //
  const logout = () => {
    if (changePage) {
      window.ipcRenderer.send("request-to-backend", { request_type: "logout" });
      changePage("/");
      window.ipcRenderer.send("reload-app");
    }
  };

  return (
    <>
      <button className={styles.logoutBtn} onClick={logout}>
        <div className={styles.logoutImg}>{icon}</div>
        <div className={styles.logoutText}>{text}</div>
      </button>
    </>
  );
};
