import React, { useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { Header } from "../../components/Header";
import { Menubar } from "../../components/ui/Menubar";
import { DropdownMenu } from "./components/DropdownMenu";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import styles from "./style/index.module.css";

export const SettingsPage: React.FC = () => {
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

  //
  return (
    <>
      <Sidebar />
      <div className={styles.container}>
        <Header title="Settings" />
        <div className={styles.setting_container}>
          <div className={styles.menubar_container}>
            <Menubar menuItems={menuItems} />
          </div>
          {isPage1 && (
            <>
              {/* ------------------- */}
              {/* Section 1 ( Theme ) */}
              <div className={styles.section}>
                <div className={styles.section_title}>
                  <span>AI Model</span>
                </div>
                <DropdownMenu
                  optionList={["Llama 3"]}
                  defaultOption="Llama 3"
                />
              </div>

              {/* Section 2 ( Theme ) */}
              <div className={styles.section}>
                <div className={styles.section_title}>
                  <span>Theme</span>
                </div>
                <ThemeSwitcher />
              </div>
            </>
          )}
          {isPage2 && <></>}
        </div>
      </div>
    </>
  );
};
