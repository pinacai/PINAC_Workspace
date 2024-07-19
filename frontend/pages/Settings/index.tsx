import React, { useState, useEffect } from "react";
import { Sidebar } from "../../components/Sidebar";
import { Header } from "../../components/Header";
import { Menubar } from "../../components/ui/Menubar";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { LLMSelector } from "./components/LLMSelector";
import { DropdownMenu } from "./components/DropdownMenu";
import styles from "./style/index.module.css";

export const SettingsPage: React.FC = () => {
  const [isPage1, setIsPage1] = useState<boolean>(true); // show by default
  const [isPage2, setIsPage2] = useState<boolean>(false);
  const [selectedLlmType, setSelectedLlmType] = useState<string>("Cloud LLM"); // default value

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

  //
  useEffect(() => {
    const preferredLlmType = localStorage.getItem("preferred-model-type");
    if (preferredLlmType) {
      setSelectedLlmType(preferredLlmType);
    }
  }, []);

  // ------------------------------ //
  return (
    <>
      <Sidebar />
      <div className={styles.container}>
        <Header title="Settings" />
        <div className={styles.setting_container}>
          <div className={styles.menubar_container}>
            <Menubar menuItems={menuItems} />
          </div>
          {/* --------------------------------------------------------- */}
          {isPage1 && (
            <>
              {/*     Section 1 ( Theme )     */}
              {/* =========================== */}
              <div className={styles.section}>
                <div className={styles.section_title}>
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
                {selectedLlmType === "Private LLM" && (
                  <div className={styles.warning_card}>
                    <div className={styles.warning_content}>
                      <div className={styles.warning_icon}>⚠</div>
                      <div className={styles.warning_text}>
                        Write the exact name of model as in Ollama. For getting
                        pulled model list run <b>ollama list</b> in terminal.
                      </div>
                    </div>
                  </div>
                )}
                <div className={styles.section_title}>
                  <span>Select LLM</span>
                </div>
                <LLMSelector
                  selectedLlmType={selectedLlmType}
                  setSelectedLlmType={setSelectedLlmType}
                />
              </div>
              {/*   Section 2 (Output Language)    */}
              {/* ================================= */}
              <div className={styles.section}>
                <div className={styles.section_title}>
                  <span>Output Language</span>
                </div>
                <DropdownMenu
                  defaultOption="English"
                  optionList={["English"]}
                  localStorageVariableName="output-language"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
