import React from "react";
import { useLocation } from "react-router-dom";
import { Header } from "../header";
import styles from "./styles/index.module.css";

export const ChatHistory: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <>
      <div className={styles.historyContainer}>
        {currentPath !== "/" ? (
          <Header title="Chat History" subPage={false} />
        ) : (
          <Header title="Chat History" subPage={true} />
        )}
      </div>
    </>
  );
};
