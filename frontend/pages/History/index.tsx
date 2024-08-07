import React, { useEffect } from "react";
import { Sidebar } from "../../components/Sidebar";
import { Header } from "../../components/Header";
import styles from "./style/index.module.css";

export const HistoryPage: React.FC = () => {
  // For smooth applying of current theme
  useEffect(() => {
    const body = document.body;
    const preferredTheme = localStorage.getItem("preferred-theme");
    const preferredThemePair = localStorage.getItem("preferred-theme-pair");
    // Remove all theme classes first
    body.classList.remove(
      "Dawn_n_Dusk-light",
      "Dawn_n_Dusk-dark",
      "Cyber_Tech_01-light",
      "Cyber_Tech_01-dark",
      "Aesthetics_Unbound-light",
      "Aesthetics_Unbound-dark"
    );
    // Add desired theme pair with 'light-theme' or 'dark-theme' as user previous preference
    body.classList.add(`${preferredThemePair}-${preferredTheme}`);
  });

  // ---------------------------------------------------- //
  return (
    <>
      <Sidebar />
      <div className="container">
        <Header title="Chat History" />
        <div className={styles.history_container}>
          <span>Coming Soon...</span>
        </div>
      </div>
    </>
  );
};
