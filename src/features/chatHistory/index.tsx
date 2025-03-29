import React from "react";
import { Header } from "../header";
import { SessionCard } from "./components/SessionCard";
import { getAllSessions } from "../../database/db";
import styles from "./styles/index.module.css";

// icons
import { CiSearch } from "react-icons/ci";

const ChatHistory: React.FC = () => {
  const [sessions, setSessions] = React.useState<JSX.Element[]>([]);

  // get all sessions from DB
  getAllSessions().then((sessions) => {
    setSessions(
      sessions.map((session) => (
        <SessionCard
          sessionId={session.id}
          date={`${String(session.timestamp.getDate()).padStart(
            2,
            "0"
          )}.${String(session.timestamp.getMonth() + 1).padStart(
            2,
            "0"
          )}.${String(session.timestamp.getFullYear())}`}
          title={session.title}
          key={session.id}
        />
      ))
    );
  });

  return (
    <>
      <div className={styles.historyContainer}>
        <Header title="Chat History" page="history" />
        <div className={styles.historyCard}>
          <div className={styles.searchBar}>
            <CiSearch className={styles.icon} />
            <input
              placeholder="Search"
              type="search"
              className={styles.input}
            />
          </div>
        </div>
        <div className={styles.cardContainer}>
          {sessions.length === 0 ? (
            <span className={styles.noSessions}>No history yet</span>
          ) : (
            sessions.map((session) => session)
          )}
        </div>
      </div>
    </>
  );
};

export default ChatHistory;
