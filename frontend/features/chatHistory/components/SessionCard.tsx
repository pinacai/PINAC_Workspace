import React from "react";
import styles from "../styles/SessionCard.module.css";

interface SessionCardProps {
  date: string;
  title: string;
}

export const SessionCard: React.FC<SessionCardProps> = ({ date, title }) => {
  return (
    <div className={styles.sessionCard}>
      <div className={styles.dateBlock}>
        <span className={styles.date}>{date}</span>
      </div>
      <div className={styles.titleBlock}>
        <span className={styles.title}>{title}</span>
      </div>
    </div>
  );
};
