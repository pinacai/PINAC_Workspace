import React from "react";
import { Sidebar } from "../../components/Sidebar";
import { Header } from "../../components/Header";
import { DropdownMenu } from "./components/DropdownMenu";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import styles from "./style/index.module.css";

export const SettingsPage: React.FC = () => {
  //
  return (
    <>
      <Sidebar />
      <div className={styles.container}>
        <Header title="Settings" />
        <div className={styles.setting_container}>
          {/* ------------------- */}
          {/* Section 1 ( Theme ) */}
          <div className={styles.section}>
            <div className={styles.section_title}>
              <span>AI Model</span>
            </div>
            <DropdownMenu optionList={["Llama 3"]} defaultOption="Llama 3" />
          </div>

          {/* Section 2 ( Theme ) */}
          <div className={styles.section}>
            <div className={styles.section_title}>
              <span>Theme</span>
            </div>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </>
  );
};
