import React, { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "../header";
import { Menubar } from "../../components/Menubar";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { LLMSelector } from "./components/LLMSelector";
import { DropdownMenu } from "./components/DropdownMenu";
import { LLMSettingsContext } from "../../context/LLMSettings";
import styles from "./styles/index.module.css";

const Settings: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const llmContext = useContext(LLMSettingsContext);
  const [isPage1, setIsPage1] = useState<boolean>(true); // show by default
  const [isPage2, setIsPage2] = useState<boolean>(false);

  const menuItems = [
    { label: "General", onClick: () => activePage1() },
    { label: "LLM Settings", onClick: () => activePage2() },
  ];

  //
  const activePage1 = () => {
    setIsPage1(true);
    setIsPage2(false);
  };

  const activePage2 = () => {
    setIsPage2(true);
    setIsPage1(false);
  };

  // ------------------------------ //
  return (
    <>
      <div className={styles.settingContainer}>
        {currentPath !== "/" ? (
          <Header title="Settings" subPage={false} />
        ) : (
          <Header title="Settings" subPage={true} />
        )}
        <div className={styles.menubarContainer}>
          <Menubar menuItems={menuItems} />
        </div>
        {/* --------------------------------------------------------- */}
        {isPage1 && (
          <>
            {/*     Section 1 ( Theme )     */}
            {/* =========================== */}
            <div className={styles.section}>
              <div className={styles.sectionTitle}>
                <span>Theme</span>
              </div>
              <ThemeSwitcher />
            </div>
          </>
        )}
        {/* --------------------------------------------------------- */}
        {isPage2 && (
          <>
            {/*     Section 1 (Select LLM)      */}
            {/* =============================== */}
            <div className={styles.section}>
              {/*     Warning card     */}
              {llmContext?.modelType === "Private LLM" && (
                <div className={styles.warningCard}>
                  <div className={styles.warningContent}>
                    <div className={styles.warningIcon}>⚠</div>
                    <div className={styles.warningText}>
                      Write the exact name of model as in Ollama. For getting
                      pulled model list run <b>ollama list</b> in terminal.
                    </div>
                  </div>
                </div>
              )}
              <div className={styles.sectionTitle}>
                <span>Select LLM</span>
              </div>
              <LLMSelector />
            </div>
            {/*   Section 2 (Output Language)    */}
            {/* ================================= */}
            <div className={styles.section}>
              <div className={styles.sectionTitle}>
                <span>Output Language</span>
              </div>
              <DropdownMenu defaultOption="English" optionList={["English"]} taskType="output_language" />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Settings;
