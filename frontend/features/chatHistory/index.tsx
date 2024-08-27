import React from "react";
import { useLocation } from "react-router-dom";
import { Header } from "../header";
import { SessionCard } from "./components/SessionCard";
import styles from "./styles/index.module.css";

// icons
import { CiSearch } from "react-icons/ci";

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
        <div className={styles.historyCard}>
          <div className={styles.searchBar}>
            <CiSearch className={styles.icon} />
            <input placeholder="Search" type="search" className={styles.input} />
          </div>
          <div className={styles.sessionCard}>
            <SessionCard
              date="27.08.2024"
              title="Sample session. It's under development..."
            />
          </div>
        </div>
      </div>
    </>
  );
};
